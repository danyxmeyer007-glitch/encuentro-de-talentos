import { NextResponse } from "next/server";
import {
  createSupabaseAdminClient,
  hasSupabaseServerConfig,
} from "@/lib/supabase/server";

export const runtime = "nodejs";

type RoomStateRequest = {
  status?: "scheduled" | "live" | "closed";
};

const roomName = process.env.LIVEKIT_ROOM_NAME ?? "voces-debut-julio-15";
const contestSlug = "voz-piloto-2026";

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

async function isRegisteredContestPerformer(userId: string | null) {
  if (!userId || !hasSupabaseServerConfig()) {
    return false;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("contest_registrations")
    .select("id")
    .eq("contest_slug", contestSlug)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data);
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
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("live_rooms")
    .upsert(
      {
        livekit_room_name: roomName,
        title: "Voces Debut",
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
