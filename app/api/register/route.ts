const AUTH_PER_PAGE = 200;

async function getAllAuthUsers(
  baseUrl: string,
  headers: Record<string, string>
): Promise<{ users: any[]; error?: string }> {
  const allUsers: any[] = [];
  let page = 1;

  try {
    for (;;) {
      const url = `${baseUrl}/auth/v1/admin/users?page=${page}&per_page=${AUTH_PER_PAGE}`;
      const res = await fetch(url, { headers });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        return { users: [], error: `HTTP ${res.status}: ${text.slice(0, 200)}` };
      }
      const data = await res.json();
      const users: any[] = data.users ?? [];
      if (users.length === 0) break;
      allUsers.push(...users);
      if (users.length < AUTH_PER_PAGE) break;
      page++;
    }
  } catch (err) {
    return { users: [], error: err instanceof Error ? err.message : String(err) };
  }

  return { users: allUsers };
}

async function checkPublicTable(
  supabaseUrl: string,
  serviceRoleKey: string,
  email: string,
  username: string
): Promise<string | null> {
  const headers = {
    "apikey": serviceRoleKey,
    "Authorization": `Bearer ${serviceRoleKey}`,
  };

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/users?email=eq.${encodeURIComponent(email)}&select=email&limit=1`,
      { headers }
    );
    if (res.ok) {
      const rows = await res.json();
      if (rows.length > 0) return "Email sudah terdaftar.";
    }
  } catch {
    // skip
  }

  if (username) {
    try {
      const res2 = await fetch(
        `${supabaseUrl}/rest/v1/users?username=eq.${encodeURIComponent(username)}&select=username&limit=1`,
        { headers }
      );
      if (res2.ok) {
        const rows = await res2.json();
        if (rows.length > 0) return "Username sudah digunakan.";
      }
    } catch {
      // skip
    }
  }

  return null;
}

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
    const { namaLengkap, email, password, username, noTelepon, alamat } = body;

    if (!namaLengkap || !email || !password || !username || !noTelepon || !alamat) {
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

    const authHeaders = {
      "Content-Type": "application/json",
      "apikey": serviceRoleKey,
      "Authorization": `Bearer ${serviceRoleKey}`,
    };

    // 1. Cek duplikat username di auth system (semua halaman)
    const { users: authUsers, error: listErr } = await getAllAuthUsers(supabaseUrl, authHeaders);
    if (listErr) {
      console.error("List auth users error:", listErr);
    }

    if (authUsers.some((u: any) => u.user_metadata?.username === username)) {
      return Response.json(
        { success: false, message: "Username sudah digunakan." },
        { status: 409 }
      );
    }

    // 2. Cek duplikat di tabel publik users
    const publicConflict = await checkPublicTable(supabaseUrl, serviceRoleKey, email, username);
    if (publicConflict) {
      return Response.json({ success: false, message: publicConflict }, { status: 409 });
    }

    // 3. Buat user di Supabase Auth (raw fetch)
    const createRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          role: "member",
          nama_lengkap: namaLengkap,
          username,
          telepon: noTelepon,
          alamat,
        },
      }),
    });

    if (!createRes.ok) {
      const bodyText = await createRes.text().catch(() => "");
      console.error("Create auth user failed:", createRes.status, bodyText.slice(0, 500));

      let msg = "Gagal mendaftarkan akun.";
      try {
        const errData = JSON.parse(bodyText);
        const errMsg = (
          errData.message ||
          errData.msg ||
          errData.error ||
          ""
        ).toLowerCase();

        if (errMsg.includes("already exists") || errMsg.includes("duplicate") || errMsg.includes("already registered") || createRes.status === 409) {
          msg = "Email sudah terdaftar.";
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
    console.error("Register error:", err);
    return Response.json(
      { success: false, message: err instanceof Error ? err.message : "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}