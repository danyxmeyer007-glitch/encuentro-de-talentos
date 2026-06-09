import { NextResponse } from "next/server";
import {
  createSupabaseAdminClient,
  hasSupabaseServerConfig,
} from "@/lib/supabase/server";

export const runtime = "nodejs";

type ContestRegistrationRequest = {
  contestSlug?: string;
};

const singingContestSlug = "voz-piloto-2026";
const maxVoiceParticipants = 10;

function normalizeUsername(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 32);
}

function getFallbackUsername(userId: string, email?: string) {
  const emailBase = email?.split("@")[0] ?? "";
  const base = normalizeUsername(emailBase) || "perfil_et";
  const suffix = userId.replace(/-/g, "").slice(0, 8);
  const maxBaseLength = Math.max(3, 32 - suffix.length - 1);

  return `${base.slice(0, maxBaseLength)}_${suffix}`;
}

async function getAuthenticatedUser(request: Request) {
  if (!hasSupabaseServerConfig()) {
    return null;
  }

  const authHeader = request.headers.get("authorization");
  const token = authHeader?.match(/^Bearer\s+(.+)$/i)?.[1];

  if (!token) {
    return null;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return null;
  }

  return data.user;
}

async function getParticipantIds() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("contest_registrations")
    .select("user_id")
    .eq("contest_slug", singingContestSlug)
    .order("created_at", { ascending: true })
    .limit(maxVoiceParticipants);

  if (error) {
    throw error;
  }

  return (data ?? []).map((registration) => registration.user_id as string);
}

async function ensureContestProfile(
  user: NonNullable<Awaited<ReturnType<typeof getAuthenticatedUser>>>,
) {
  const supabase = createSupabaseAdminClient();

  const { error: userError } = await supabase.from("users").upsert(
    {
      id: user.id,
      email: user.email ?? "",
      role: "performer",
    },
    { onConflict: "id" },
  );

  if (userError) {
    throw userError;
  }

  const { data: profile, error: profileReadError } = await supabase
    .from("profiles")
    .select("user_id, name, username, photo_url, talent_type")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileReadError) {
    throw profileReadError;
  }

  const userMetadata = user.user_metadata as
    | { name?: string; full_name?: string; stage_name?: string }
    | undefined;
  const fallbackName =
    profile?.name ||
    userMetadata?.name ||
    userMetadata?.full_name ||
    user.email?.split("@")[0] ||
    "Participante ET";

  if (!profile) {
    const { error: profileInsertError } = await supabase.from("profiles").insert({
      user_id: user.id,
      name: fallbackName,
      username: getFallbackUsername(user.id, user.email ?? undefined),
      photo_url: null,
      talent_type: "Canto",
      camerino_theme: "gold",
    });

    if (profileInsertError) {
      throw profileInsertError;
    }
  }

  const { error: performerError } = await supabase
    .from("performer_profiles")
    .upsert({
      user_id: user.id,
      stage_name: userMetadata?.stage_name || fallbackName,
      genre: profile?.talent_type || "Canto",
      experience_level: null,
      social_links: {},
      demo_video_url: null,
    });

  if (performerError) {
    throw performerError;
  }
}

export async function POST(request: Request) {
  if (!hasSupabaseServerConfig()) {
    return NextResponse.json(
      { error: "Supabase server environment is not configured" },
      { status: 500 },
    );
  }

  let body: ContestRegistrationRequest;

  try {
    body = (await request.json()) as ContestRegistrationRequest;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if ((body.contestSlug ?? singingContestSlug) !== singingContestSlug) {
    return NextResponse.json({ error: "Concurso no disponible" }, { status: 400 });
  }

  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json(
      { error: "Inicia sesion para registrarte en canto" },
      { status: 401 },
    );
  }

  const participantIds = await getParticipantIds();

  if (
    participantIds.length >= maxVoiceParticipants &&
    !participantIds.includes(user.id)
  ) {
    return NextResponse.json(
      { error: "La lista fija de canto ya tiene 10 participantes." },
      { status: 403 },
    );
  }

  try {
    await ensureContestProfile(user);
  } catch {
    return NextResponse.json(
      { error: "No se pudo preparar tu usuario para el concurso" },
      { status: 500 },
    );
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("contest_registrations").insert({
    contest_slug: singingContestSlug,
    user_id: user.id,
  });

  if (error && error.code !== "23505") {
    return NextResponse.json(
      { error: "No se pudo registrar tu perfil en canto" },
      { status: 500 },
    );
  }

  const updatedParticipantIds = await getParticipantIds();

  return NextResponse.json({
    participantIds: updatedParticipantIds,
    registered: true,
  });
}
