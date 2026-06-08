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

export function hasSupabaseBrowserConfig() {
  return Boolean(
    isValidSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  );
}

export function createSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isValidSupabaseUrl(supabaseUrl) || !supabasePublishableKey) {
    throw new Error("Missing Supabase browser configuration");
  }

  return createClient(supabaseUrl!, supabasePublishableKey);
}
