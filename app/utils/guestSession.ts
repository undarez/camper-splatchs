import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function createGuestSession() {
  const { data, error } = await supabase
    .from("guest_sessions")
    .insert([
      {
        ip_address: "", // On peut ajouter l'IP si nécessaire
        user_agent: window.navigator.userAgent,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating guest session:", error);
    return null;
  }

  localStorage.setItem("guestSessionId", data.id);
  return data.id;
}

export async function checkGuestSession() {
  const sessionId = localStorage.getItem("guestSessionId");
  if (!sessionId) return false;

  const { data, error } = await supabase.rpc("is_valid_guest_session", {
    session_id: sessionId,
  });

  if (error || !data) {
    localStorage.removeItem("guestSessionId");
    return false;
  }

  return data;
}
