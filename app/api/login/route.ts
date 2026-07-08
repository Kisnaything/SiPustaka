import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email dan password wajib diisi" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const pendingCookies: Array<{
      name: string;
      value: string;
      options?: Record<string, unknown>;
    }> = [];

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          pendingCookies.push(...cookiesToSet);
        },
      },
    });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const msg = error.message?.toLowerCase() || "";
      let message: string;

      if (msg.includes("email not confirmed")) {
        message =
          "Email belum dikonfirmasi. Silakan cek email Anda untuk tautan konfirmasi, atau hubungi admin.";
      } else if (msg.includes("invalid login credentials")) {
        message = "Email atau password salah.";
      } else if (msg.includes("user is banned")) {
        message = "Akun Anda telah dinonaktifkan.";
      } else if (msg.includes("rate limit")) {
        message =
          "Terlalu banyak percobaan login. Silakan coba lagi nanti.";
      } else {
        message = error.message;
      }

      return NextResponse.json({ success: false, message }, { status: 400 });
    }

    const role = data.user?.user_metadata?.role;
    let redirectUrl: string;

    if (role === "admin") {
      redirectUrl = "/admin";
    } else if (role === "member") {
      redirectUrl = "/member";
    } else {
      await supabase.auth.signOut();
      return NextResponse.json(
        { success: false, message: "Akun tidak memiliki role yang valid." },
        { status: 403 }
      );
    }

    const response = NextResponse.json({
      success: true,
      redirect: redirectUrl,
    });

    for (const { name, value, options } of pendingCookies) {
      response.cookies.set(name, value, options as Record<string, unknown>);
    }

    return response;
  } catch (err) {
    console.error("Login API error:", err);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
