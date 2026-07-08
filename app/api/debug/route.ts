import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const results: Record<string, unknown> = {};

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    results.env = {
      hasUrl: !!supabaseUrl,
      hasServiceKey: !!serviceRoleKey,
      hasAnonKey: !!anonKey,
    };

    if (!supabaseUrl || !serviceRoleKey) {
      return Response.json({ error: "Missing env vars", ...results });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: usersData, error: usersError } = await supabase
      .from("users")
      .select("*")
      .limit(5);

    results.usersTable = usersError
      ? { error: usersError.message }
      : { exists: true, sample: usersData };

    const { data: authUsers, error: authError } =
      await supabase.auth.admin.listUsers();

    results.authUsers = authError
      ? { error: authError.message }
      : authUsers.users.map((u) => ({
          id: u.id,
          email: u.email,
          role: u.user_metadata?.role,
          created_at: u.created_at,
        }));

    return Response.json(results);
  } catch (err) {
    return Response.json({
      error: err instanceof Error ? err.message : String(err),
      ...results,
    });
  }
}
