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

  const supabase = createSupabaseAdminClient();
  const { error: userError } = await supabase.from("users").upsert(
    {
      id: user.id,
      email: user.email ?? "",
      role: "audience",
    },
    { ignoreDuplicates: true, onConflict: "id" },
  );

  if (userError) {
    return NextResponse.json(
      { error: "No se pudo preparar tu usuario para el concurso" },
      { status: 500 },
    );
  }

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
