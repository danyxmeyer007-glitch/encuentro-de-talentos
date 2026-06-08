import { createClient } from "@supabase/supabase-js";

function isValidSupabaseUrl(value: string | undefined) {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);

    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function hasSupabaseServerConfig() {
  return Boolean(
    isValidSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY),
  );
}

export function createSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseSecretKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

  if (!isValidSupabaseUrl(supabaseUrl) || !supabaseSecretKey) {
    throw new Error("Missing Supabase server configuration");
  }

  return createClient(supabaseUrl!, supabaseSecretKey, {
    auth: {
      persistSession: false,
    },
  });
}
