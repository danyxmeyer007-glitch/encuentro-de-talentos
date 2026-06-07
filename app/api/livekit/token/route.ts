import { randomUUID } from "node:crypto";
import { AccessToken } from "livekit-server-sdk";
import { NextResponse } from "next/server";
import {
  createSupabaseAdminClient,
  hasSupabaseServerConfig,
} from "@/lib/supabase/server";

export const runtime = "nodejs";

type LiveKitRole = "audience" | "performer" | "host";

type TokenRequest = {
  role?: LiveKitRole;
  identity?: string;
  code?: string;
};

const roomName = process.env.LIVEKIT_ROOM_NAME ?? "voces-debut-julio-15";

async function createLiveKitToken(role: LiveKitRole, identity: string) {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error("Missing LiveKit credentials");
  }

  const canPublish = role === "host" || role === "performer";
  const canAdmin = role === "host";

  const token = new AccessToken(apiKey, apiSecret, {
    name: identity,
    identity,
    metadata: JSON.stringify({ role }),
    ttl: 60 * 60 * 3,
  });

  token.addGrant({
    room: roomName,
    roomAdmin: canAdmin,
    roomCreate: canAdmin,
    roomJoin: true,
    canPublish,
    canPublishData: true,
    canSubscribe: true,
  });

  return token.toJwt();
}

function normalizeIdentity(identity: string | undefined, role: LiveKitRole) {
  const cleaned = identity?.trim().replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 48);

  return cleaned || `${role}-${randomUUID().slice(0, 8)}`;
}

async function isLiveRoomOpenForAudience() {
  if (!hasSupabaseServerConfig()) {
    return false;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("live_rooms")
    .select("status")
    .eq("livekit_room_name", roomName)
    .eq("status", "live")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data);
}

export async function POST(request: Request) {
  let body: TokenRequest;

  try {
    body = (await request.json()) as TokenRequest;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const role = body.role ?? "audience";

  if (!["audience", "performer", "host"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  if (role === "performer" && body.code !== process.env.LIVEKIT_PERFORMER_CODE) {
    return NextResponse.json({ error: "Invalid performer code" }, { status: 403 });
  }

  if (role === "host" && body.code !== process.env.LIVEKIT_HOST_CODE) {
    return NextResponse.json({ error: "Invalid host code" }, { status: 403 });
  }

  if (role === "audience") {
    const liveRoomOpen = await isLiveRoomOpenForAudience();

    if (!liveRoomOpen) {
      return NextResponse.json(
        { error: "El escenario no esta live todavia" },
        { status: 403 },
      );
    }
  }

  try {
    const token = await createLiveKitToken(
      role,
      normalizeIdentity(body.identity, role),
    );

    return NextResponse.json({
      roomName,
      serverUrl: process.env.LIVEKIT_URL,
      token,
    });
  } catch {
    return NextResponse.json(
      { error: "LiveKit environment is not configured" },
      { status: 500 },
    );
  }
}
