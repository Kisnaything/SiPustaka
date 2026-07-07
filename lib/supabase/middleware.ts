import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  const isAuthRoute =
    path === "/login" ||
    path === "/signup-admin" ||
    path === "/signup-anggota" ||
    path === "/lupa-pass" ||
    path === "/reset-password";

  const isDashboardRoute =
    path.startsWith("/admin") || path.startsWith("/member");

  if (!user) {
    if (isDashboardRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return supabaseResponse;
  }

  const role = user.user_metadata?.role;

  if (isDashboardRoute && role === "admin" && path.startsWith("/member")) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (isDashboardRoute && role === "member" && path.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/member", request.url));
  }

  if (isAuthRoute) {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (role === "member") {
      return NextResponse.redirect(new URL("/member", request.url));
    }
  }

  return supabaseResponse;
}
