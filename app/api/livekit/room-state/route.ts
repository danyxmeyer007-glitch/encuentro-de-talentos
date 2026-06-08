import { NextResponse } from "next/server";
import {
  createSupabaseAdminClient,
  hasSupabaseServerConfig,
} from "@/lib/supabase/server";

export const runtime = "nodejs";

type RoomStateRequest = {
  status?: "scheduled" | "live" | "closed";
};

const roomName = process.env.LIVEKIT_ROOM_NAME ?? "encuentrodetalentos";
const contestSlug = "voz-piloto-2026";
const minVoiceParticipants = 1;
const maxVoiceParticipants = 10;

async function getAuthenticatedUserId(request: Request) {
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

  if (error) {
    return null;
  }

  return data.user?.id ?? null;
}

async function getFixedVoiceParticipants() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("contest_registrations")
    .select("user_id")
    .eq("contest_slug", contestSlug)
    .order("created_at", { ascending: true })
    .limit(maxVoiceParticipants);

  if (error) {
    throw error;
  }

  return (data ?? []).map((registration) => registration.user_id);
}

async function isRegisteredContestPerformer(userId: string | null) {
  if (!userId || !hasSupabaseServerConfig()) {
    return false;
  }

  const fixedParticipants = await getFixedVoiceParticipants();

  return fixedParticipants.includes(userId);
}

async function isFinalContestModerator(userId: string | null) {
  if (!userId || !hasSupabaseServerConfig()) {
    return false;
  }

  const fixedParticipants = await getFixedVoiceParticipants();

  return fixedParticipants.at(-1) === userId;
}

export async function POST(request: Request) {
  if (!hasSupabaseServerConfig()) {
    return NextResponse.json(
      { error: "Supabase server environment is not configured" },
      { status: 500 },
    );
  }

  let body: RoomStateRequest;

  try {
    body = (await request.json()) as RoomStateRequest;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const userId = await getAuthenticatedUserId(request);
  const isRegisteredPerformer = await isRegisteredContestPerformer(userId);

  if (!isRegisteredPerformer) {
    return NextResponse.json(
      { error: "Solo participantes registrados pueden abrir el escenario" },
      { status: 403 },
    );
  }

  const status = body.status ?? "live";

  if (status === "live") {
    const fixedParticipants = await getFixedVoiceParticipants();

    if (fixedParticipants.length < minVoiceParticipants) {
      return NextResponse.json(
        { error: "Se necesita minimo 1 participante registrado para abrir el live" },
        { status: 403 },
      );
    }
  }

  if (status === "closed") {
    const isFinalModerator = await isFinalContestModerator(userId);

    if (!isFinalModerator) {
      return NextResponse.json(
        { error: "Solo el ultimo moderador puede apagar el live" },
        { status: 403 },
      );
    }
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("live_rooms")
    .upsert(
      {
        livekit_room_name: roomName,
        title: "Encuentro de Talentos Live",
        status,
      },
      { onConflict: "livekit_room_name" },
    )
    .select("status")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "No se pudo actualizar el escenario" },
      { status: 500 },
    );
  }

  return NextResponse.json({ status: data.status });
}
