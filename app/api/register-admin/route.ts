export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return Response.json(
        { success: false, message: "Konfigurasi server tidak lengkap." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { namaLengkap, email, password, username, noTelepon, kodeAkses } = body;

    if (!namaLengkap || !email || !password || !username || !noTelepon || !kodeAkses) {
      return Response.json(
        { success: false, message: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return Response.json(
        { success: false, message: "Password minimal 8 karakter", field: "password" },
        { status: 400 }
      );
    }

    if (kodeAkses !== process.env.ADMIN_ACCESS_CODE) {
      return Response.json(
        { success: false, message: "Kode akses tidak valid.", field: "kodeAkses" },
        { status: 403 }
      );
    }

    const headers = {
      "Content-Type": "application/json",
      "apikey": serviceRoleKey,
      "Authorization": `Bearer ${serviceRoleKey}`,
    };

    // Cek duplikat email & username sebelum mencoba daftar
    const listRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, { headers });
    if (listRes.ok) {
      const listData = await listRes.json();
      const users: any[] = listData.users || [];
      if (users.some((u: any) => u.email === email)) {
        return Response.json({ success: false, message: "Email sudah terdaftar." }, { status: 409 });
      }
      if (users.some((u: any) => u.user_metadata?.username === username)) {
        return Response.json({ success: false, message: "Username sudah digunakan." }, { status: 409 });
      }
    }

    const authUrl = `${supabaseUrl}/auth/v1/admin/users`;
    const res = await fetch(authUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          role: "admin",
          nama_lengkap: namaLengkap,
          username,
          telepon: noTelepon,
        },
      }),
    });

    if (!res.ok) {
      let bodyText = "";
      try { bodyText = await res.text(); } catch { bodyText = ""; }
      let msg = "Gagal mendaftarkan akun.";
      try {
        const errData = JSON.parse(bodyText);
        if (errData.msg?.includes?.("Database error")) {
          if (errData.error_id) {
            msg = "Terjadi kesalahan pada server autentikasi. Silakan coba lagi atau hubungi administrator.";
          } else {
            msg = errData.msg;
          }
        } else {
          msg = errData.message || errData.msg || errData.error || msg;
        }
      } catch {
        if (bodyText) msg = bodyText.slice(0, 200);
      }
      return Response.json({ success: false, message: msg }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Register-admin error:", err);
    const message = err instanceof Error ? err.message : "Terjadi kesalahan";
    return Response.json({ success: false, message }, { status: 500 });
  }
}
