import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing Supabase env vars");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export async function POST(request: Request) {
  try {
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

    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (existing) {
      return Response.json(
        { success: false, message: "Username sudah digunakan", field: "username" },
        { status: 409 }
      );
    }

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
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
    });

    if (authError) {
      return Response.json(
        { success: false, message: authError.message },
        { status: 500 }
      );
    }

    if (!authData?.user) {
      return Response.json(
        { success: false, message: "Gagal membuat akun" },
        { status: 500 }
      );
    }

    return Response.json({ success: true });
  } catch (err) {
    return Response.json(
      { success: false, message: err instanceof Error ? err.message : "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}
