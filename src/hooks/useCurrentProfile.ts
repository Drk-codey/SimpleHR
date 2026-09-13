import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import type { ProfileRow } from "@/types/database.types";

async function fetchCurrentProfile(userId: string): Promise<ProfileRow> {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();

  if (error) throw error;
  return data;
}

/**
 * Loads the `profiles` row (role, display name) for the signed-in user.
 * This is the source of truth the UI uses to decide what to show — the
 * database's RLS policies are the source of truth for what's actually allowed.
 */
export function useCurrentProfile() {
  const { session } = useAuth();
  const userId = session?.user.id;

  return useQuery({
    queryKey: ["profiles", "me", userId],
    queryFn: () => fetchCurrentProfile(userId!),
    enabled: !!userId,
    staleTime: 5 * 60_000,
  });
}
