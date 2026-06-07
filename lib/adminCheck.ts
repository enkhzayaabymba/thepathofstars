import { supabase } from "./supabase";

// Queries the admins table — RLS ensures only the real admin sees their row.
// Returns true only if the current session's user_id exists in admins table.
export async function checkIsAdmin(): Promise<boolean> {
  const { data } = await supabase.from("admins").select("id").maybeSingle();
  return !!data;
}
