import { createClient } from "./client";

export async function ensureAnonymousUser() {
  const supabase = createClient();

  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser();

  if (user && !getUserError) {
    return user;
  }

  // If an old/invalid session exists, remove it locally.
  if (getUserError) {
    await supabase.auth.signOut({ scope: "local" });
  }

  const { data, error: signInError } =
    await supabase.auth.signInAnonymously();

  if (signInError) {
    throw signInError;
  }

  if (!data.user) {
    throw new Error("Supabase did not return a user.");
  }

  return data.user;
}