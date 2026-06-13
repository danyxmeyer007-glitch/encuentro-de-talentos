"use client";

import {
  Room,
  RoomEvent,
  type Participant,
  type RemoteParticipant,
  type RemoteTrack,
} from "livekit-client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  createSupabaseBrowserClient,
  hasSupabaseBrowserConfig,
} from "@/lib/supabase/client";

type AudioWindow = Window & {
  webkitAudioContext?: typeof AudioContext;
};

type LiveKitRole = "audience" | "performer" | "host";

type StagePerformer = {
  userId?: string;
  name: string;
  role: string;
  song: string;
  color: string;
  photoUrl?: string | null;
  city?: string | null;
  country?: string | null;
};

type RoomSignal =
  | {
      type: "reaction";
      reaction: string;
      sender: string;
    }
  | {
      type: "vote";
      sender: string;
    }
  | {
      type: "stage-control";
      control: string;
      enabled: boolean;
      sender: string;
      nextPerformerIndex?: number;
    };

const contestSlug = "voz-piloto-2026";
const liveKitRoomName = "encuentrodetalentos";
const maxVoiceParticipants = 10;

const reactions = ["Bravo", "Aplausos", "Otra", "Fuego"];

const reactionSounds: Record<string, string> = {
  Bravo: "/sounds/bravo.mp3",
  Aplausos: "/sounds/aplausos.mp3",
  Otra: "/sounds/otra.mp3",
  Fuego: "/sounds/fuego.mp3",
};

export default function Escenario() {
  const roomRef = useRef<Room | null>(null);
  const mediaContainerRef = useRef<HTMLDivElement | null>(null);
  const localPreviewRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const supabase = useMemo(
    () => (hasSupabaseBrowserConfig() ? createSupabaseBrowserClient() : null),
    [],
  );
  const [activePerformer, setActivePerformer] = useState(0);
  const [contestQueue, setContestQueue] = useState<StagePerformer[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [queueStatus, setQueueStatus] = useState(() =>
    hasSupabaseBrowserConfig()
      ? "Cargando fila de concurso"
      : "Conecta Supabase para cargar la fila real",
  );
  const [joined, setJoined] = useState(false);
  const [reactionCount, setReactionCount] = useState(0);
  const [roomOpen, setRoomOpen] = useState(false);
  const [micPassed, setMicPassed] = useState(false);
  const [muted, setMuted] = useState(false);
  const votingOpen = true;
  const [votes, setVotes] = useState(0);
  const liveKitIdentity = "";
  const [liveKitStatus, setLiveKitStatus] = useState("Listo para conectar");
  const [connectedRole, setConnectedRole] = useState<LiveKitRole | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [cameraEnabledForTurn, setCameraEnabledForTurn] = useState(false);
  const [liveKitParticipants, setLiveKitParticipants] = useState(0);
  const [activeSpeakers, setActiveSpeakers] = useState<string[]>([]);
  const [roomEvents, setRoomEvents] = useState<string[]>([
    "Sala lista para LiveKit",
  ]);

  const stageQueue = contestQueue;
  const safeActivePerformer = stageQueue[activePerformer] ? activePerformer : 0;
  const performer = stageQueue[safeActivePerformer] ?? null;
  const currentUserRegistered = contestQueue.some(
    (item) => item.userId && item.userId === currentUserId,
  );
  const isMyTurn = Boolean(
    currentUserId && performer?.userId && performer.userId === currentUserId,
  );
  const canPublishThisTurn = currentUserRegistered && isMyTurn;
  const hasNextPerformer = safeActivePerformer < stageQueue.length - 1;
  const isFinalModerator = currentUserRegistered && isMyTurn && !hasNextPerformer;
  const canModerateStage = currentUserRegistered && isMyTurn;
  const curtainOpen = roomOpen && Boolean(performer?.userId);
  const primaryStageLabel = !currentUserRegistered
    ? "Registrarme en canto"
    : !roomOpen && canModerateStage
      ? "Abrir escenario"
      : canPublishThisTurn
        ? publishing
          ? "Cantando en vivo"
          : "Entrar a mi turno"
        : connectedRole === "audience"
          ? "Estas en audiencia"
          : "Entrar como audiencia";

  const liveListeners = useMemo(
    () => liveKitParticipants + (joined ? 1 : 0),
    [joined, liveKitParticipants],
  );

  useEffect(() => {
    return () => {
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      roomRef.current?.disconnect();
    };
  }, []);

  async function requestStageMedia() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setLiveKitStatus("Este navegador no permite activar micrófono/cámara.");
      return false;
    }

    try {
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: cameraEnabledForTurn,
      });

      localStreamRef.current = stream;

      if (localPreviewRef.current) {
        localPreviewRef.current.srcObject = stream;
        await localPreviewRef.current.play().catch(() => undefined);
      }

      setLiveKitStatus(
        cameraEnabledForTurn
          ? "Permisos activos: microfono/camara listos"
          : "Permiso activo: microfono listo",
      );

      return true;
    } catch (error) {
      setLiveKitStatus(
        error instanceof Error
          ? `Autoriza microfono/camara en el navegador: ${error.message}`
          : "Autoriza microfono/camara en el navegador",
      );

      return false;
    }
  }

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let isActive = true;
    const client = supabase;

    async function loadContestQueue() {
      const [{ data: sessionData }, registrationsResult, roomResult] =
        await Promise.all([
          client.auth.getSession(),
          client
            .from("contest_registrations")
            .select("user_id, created_at")
            .eq("contest_slug", contestSlug)
            .order("created_at", { ascending: true })
            .limit(maxVoiceParticipants),
          client
            .from("live_rooms")
            .select("status")
            .eq("livekit_room_name", liveKitRoomName)
            .maybeSingle(),
        ]);

      if (!isActive) {
        return;
      }

      const sessionUserId = sessionData.session?.user.id ?? null;
      const roomIsOpen = roomResult.data?.status === "live";

      setCurrentUserId(sessionUserId);
      setRoomOpen(roomIsOpen);

      if (registrationsResult.error) {
        setQueueStatus("No se pudo cargar la fila del concurso");

        return;
      }

      const registrations = registrationsResult.data ?? [];
      const userIds = registrations.map((registration) => registration.user_id);

      if (userIds.length === 0) {
        setContestQueue([]);
        setQueueStatus("Aún no hay participantes registrados en canto");

        return;
      }

      const [profilesResult, performersResult] = await Promise.all([
        client
          .from("profiles")
          .select("user_id, name, username, photo_url, country, city")
          .in("user_id", userIds),
        client
          .from("performer_profiles")
          .select("user_id, stage_name, genre")
          .in("user_id", userIds),
      ]);

      if (!isActive) {
        return;
      }

      const profilesByUser = new Map(
        (profilesResult.data ?? []).map((profile) => [profile.user_id, profile]),
      );
      const performersByUser = new Map(
        (performersResult.data ?? []).map((profile) => [profile.user_id, profile]),
      );
      const colors = ["#22d3ee", "#ec4899", "#facc15", "#a78bfa", "#34d399"];

      const nextQueue = registrations.map((registration, index) => {
        const profile = profilesByUser.get(registration.user_id);
        const performerProfile = performersByUser.get(registration.user_id);

        return {
          userId: registration.user_id,
          name:
            profile?.name ||
            performerProfile?.stage_name ||
            (profile?.username ? `@${profile.username}` : `Participante ${index + 1}`),
          role: "En fila",
          song: performerProfile?.genre || "Audición de canto",
          color: colors[index % colors.length],
          photoUrl: profile?.photo_url,
          city: profile?.city,
          country: profile?.country,
        };
      });

      setContestQueue(nextQueue);

      if (!roomIsOpen && sessionUserId) {
        const userQueueIndex = nextQueue.findIndex((item) => item.userId === sessionUserId);

        if (userQueueIndex >= 0) {
          setActivePerformer(userQueueIndex);
        }
      }

      setQueueStatus("Fila oficial de participantes cargada");
    }

    void loadContestQueue();

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setCurrentUserId(session?.user.id ?? null);
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  function createAudioContext() {
    const AudioContextClass =
      window.AudioContext ?? (window as AudioWindow).webkitAudioContext;

    return AudioContextClass ? new AudioContextClass() : null;
  }

  function playTone(frequencies: number[], duration = 0.32) {
    const audioContext = createAudioContext();

    if (!audioContext) {
      return;
    }

    const now = audioContext.currentTime;
    const masterGain = audioContext.createGain();

    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.exponentialRampToValueAtTime(0.16, now + 0.025);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    masterGain.connect(audioContext.destination);

    frequencies.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const toneGain = audioContext.createGain();

      oscillator.type = index === 0 ? "triangle" : "sine";
      oscillator.frequency.setValueAtTime(frequency, now + index * 0.055);
      oscillator.frequency.exponentialRampToValueAtTime(
        frequency * 1.14,
        now + duration,
      );
      toneGain.gain.setValueAtTime(0.42 / frequencies.length, now);
      oscillator.connect(toneGain);
      toneGain.connect(masterGain);
      oscillator.start(now + index * 0.045);
      oscillator.stop(now + duration + index * 0.045);
    });

    window.setTimeout(() => audioContext.close(), (duration + 0.2) * 1000);
  }

  function playApplause() {
    const audioContext = createAudioContext();

    if (!audioContext) {
      return;
    }

    const now = audioContext.currentTime;
    const buffer = audioContext.createBuffer(
      1,
      audioContext.sampleRate * 0.48,
      audioContext.sampleRate,
    );
    const data = buffer.getChannelData(0);

    for (let index = 0; index < data.length; index += 1) {
      const noise = Math.sin(index * 91.7) * Math.sin(index * 0.037);

      data[index] = noise * (index % 47 < 14 ? 0.9 : 0.22);
    }

    const noise = audioContext.createBufferSource();
    const filter = audioContext.createBiquadFilter();
    const gain = audioContext.createGain();

    noise.buffer = buffer;
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1800, now);
    filter.Q.setValueAtTime(0.82, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);
    noise.start(now);
    noise.stop(now + 0.5);

    window.setTimeout(() => audioContext.close(), 720);
  }

  function playRecordedSound(reaction: string) {
    const audio = new Audio(reactionSounds[reaction]);

    audio.volume = reaction === "Aplausos" ? 0.8 : 0.92;

    return audio.play();
  }

  function pushRoomEvent(event: string) {
    setRoomEvents((current) => [event, ...current].slice(0, 5));
  }

  async function publishRoomSignal(signal: RoomSignal) {
    if (!roomRef.current) {
      return;
    }

    const payload = new TextEncoder().encode(JSON.stringify(signal));

    await roomRef.current.localParticipant.publishData(payload, {
      reliable: true,
      topic: "escenario-control",
    });
  }

  function handleRoomSignal(signal: RoomSignal) {
    if (signal.type === "reaction") {
      setReactionCount((current) => current + 1);
      pushRoomEvent(`${signal.sender}: ${signal.reaction}`);

      return;
    }

    if (signal.type === "vote") {
      setVotes((current) => current + 1);
      pushRoomEvent(`${signal.sender} voto`);

      return;
    }

    if (typeof signal.nextPerformerIndex === "number") {
      setActivePerformer(signal.nextPerformerIndex);

      if (stageQueue[signal.nextPerformerIndex]?.userId === currentUserId) {
        setLiveKitStatus("Es tu turno: activa tu micrófono");
      }
    }

    pushRoomEvent(`${signal.sender}: ${signal.control}`);
  }

  function updateParticipantCount(room: Room) {
    setLiveKitParticipants(room.numParticipants);
  }

  function handleJoin() {
    setJoined(true);
  }

  function handleReaction(reaction: string) {
    if (!roomOpen) {
      setLiveKitStatus("Las reacciones se activan cuando el escenario está en vivo");
      return;
    }

    setReactionCount((current) => current + 1);
    pushRoomEvent(`Tu: ${reaction}`);
    void publishRoomSignal({
      type: "reaction",
      reaction,
      sender: liveKitIdentity.trim() || connectedRole || "audience",
    });

    playRecordedSound(reaction).catch(() => {
      if (reaction === "Bravo") {
        playTone([392, 523.25, 659.25], 0.36);
      } else if (reaction === "Aplausos") {
        playApplause();
      } else if (reaction === "Otra") {
        playTone([440, 587.33, 783.99], 0.42);
      } else {
        playTone([196, 392, 784], 0.32);
      }
    });
  }

  function handleVote() {
    if (!roomOpen) {
      setLiveKitStatus("La votación se activa cuando el escenario está en vivo");
      return;
    }

    if (votingOpen) {
      setVotes((current) => current + 1);
      pushRoomEvent("Tu voto fue enviado");
      void publishRoomSignal({
        type: "vote",
        sender: liveKitIdentity.trim() || connectedRole || "audience",
      });
    }
  }

  async function handleLiveKitConnect(role: LiveKitRole = "audience") {
    if (role === "performer" && !canPublishThisTurn) {
      setLiveKitStatus(
        currentUserRegistered
          ? "Espera tu turno en la fila"
          : "Registra tu perfil en canto para entrar como performer",
      );

      return false;
    }

    setLiveKitStatus("Generando token");

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    const { data: sessionData } = supabase
      ? await supabase.auth.getSession()
      : { data: { session: null } };

    if (sessionData.session?.access_token) {
      headers.Authorization = `Bearer ${sessionData.session.access_token}`;
    }

    const response = await fetch("/api/livekit/token", {
      method: "POST",
      headers,
      body: JSON.stringify({
        role,
        identity: liveKitIdentity || (role === "performer" ? performer?.name ?? "" : ""),
        code: "",
      }),
    });

    if (!response.ok) {
      const result = (await response.json()) as { error?: string };

      setLiveKitStatus(result.error ?? "No se pudo generar token");

      return false;
    }

    const result = (await response.json()) as {
      serverUrl?: string;
      token: string;
      roomName: string;
    };

    if (!result.serverUrl) {
      setLiveKitStatus("Falta LIVEKIT_URL");

      return false;
    }

    roomRef.current?.disconnect();
    setPublishing(false);

    const room = new Room({
      adaptiveStream: true,
      dynacast: true,
    });

    room
      .on(RoomEvent.Connected, () => {
        updateParticipantCount(room);
      })
      .on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
        updateParticipantCount(room);
        pushRoomEvent(`${participant.identity} entro`);
      })
      .on(RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => {
        updateParticipantCount(room);
        pushRoomEvent(`${participant.identity} salio`);
      })
      .on(RoomEvent.ActiveSpeakersChanged, (participants: Participant[]) => {
        setActiveSpeakers(
          participants
            .map((participant) => participant.name || participant.identity)
            .slice(0, 3),
        );
      })
      .on(RoomEvent.DataReceived, (payload, participant, _kind, topic) => {
        if (topic !== "escenario-control") {
          return;
        }

        try {
          const signal = JSON.parse(new TextDecoder().decode(payload)) as RoomSignal;

          handleRoomSignal(signal);
        } catch {
          pushRoomEvent("Mensaje LiveKit no valido");
        }
      })
      .on(RoomEvent.TrackSubscribed, (track: RemoteTrack) => {
        if (!mediaContainerRef.current) {
          return;
        }

        const element = track.attach();

        element.setAttribute("data-livekit-track", "true");
        mediaContainerRef.current.append(element);
      })
      .on(RoomEvent.TrackUnsubscribed, (track: RemoteTrack) => {
        track.detach().forEach((element) => element.remove());
      })
      .on(RoomEvent.Disconnected, () => {
        setConnectedRole(null);
        setPublishing(false);
        setLiveKitParticipants(0);
        setActiveSpeakers([]);
        setLiveKitStatus("Desconectado");
      });

    try {
      await room.connect(result.serverUrl, result.token);
    } catch (error) {
      setLiveKitStatus(
        error instanceof Error
          ? `No se pudo conectar a LiveKit: ${error.message}`
          : "No se pudo conectar a LiveKit",
      );

      return false;
    }

    roomRef.current = room;
    setConnectedRole(role);
    setRoomOpen(true);
    setLiveKitParticipants(room.numParticipants);
    pushRoomEvent(`Conectado como ${role}`);
    setLiveKitStatus(`Conectado a ${result.roomName}`);

    return true;
  }

  async function handleOpenStage() {
    if (!canModerateStage) {
      setLiveKitStatus("Solo el moderador en turno puede encender el en vivo");

      return;
    }

    const mediaAllowed = await requestStageMedia();

    if (!mediaAllowed) {
      return;
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    const { data: sessionData } = supabase
      ? await supabase.auth.getSession()
      : { data: { session: null } };

    if (sessionData.session?.access_token) {
      headers.Authorization = `Bearer ${sessionData.session.access_token}`;
    }

    const response = await fetch("/api/livekit/room-state", {
      method: "POST",
      headers,
      body: JSON.stringify({ status: "live" }),
    });

    if (!response.ok) {
      const result = (await response.json()) as { error?: string };

      setLiveKitStatus(result.error ?? "No se pudo abrir el escenario");

      return;
    }

    setRoomOpen(true);
    pushRoomEvent("Escenario abierto por participante registrado");
    setLiveKitStatus("Escenario en vivo: la audiencia ya puede entrar");
    await handleStartPublishing();
  }

  async function handleCloseStage() {
    if (!isFinalModerator) {
      setLiveKitStatus("Solo el último moderador puede apagar el en vivo");

      return;
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    const { data: sessionData } = supabase
      ? await supabase.auth.getSession()
      : { data: { session: null } };

    if (sessionData.session?.access_token) {
      headers.Authorization = `Bearer ${sessionData.session.access_token}`;
    }

    const response = await fetch("/api/livekit/room-state", {
      method: "POST",
      headers,
      body: JSON.stringify({ status: "closed" }),
    });

    if (!response.ok) {
      const result = (await response.json()) as { error?: string };

      setLiveKitStatus(result.error ?? "No se pudo apagar el escenario");

      return;
    }

    await handleStopPublishing();
    await handleLiveKitDisconnect();
    setRoomOpen(false);
    setMicPassed(false);
    pushRoomEvent("En vivo apagado por último moderador");
    setLiveKitStatus("Escenario cerrado");
  }

  async function handleStartPublishing() {
    const mediaAllowed = await requestStageMedia();

    if (!mediaAllowed) {
      return;
    }

    if (!roomRef.current || connectedRole !== "performer") {
      if (!canModerateStage) {
        setLiveKitStatus("Conecta como participante en turno");

        return;
      }

      const connected = await handleLiveKitConnect("performer");

      if (!connected || !roomRef.current) {
        return;
      }
    }

    if (!canModerateStage) {
      setLiveKitStatus("Tu mic/cámara se activa solo cuando llega tu turno");

      return;
    }

    try {
      await roomRef.current.localParticipant.setMicrophoneEnabled(true);
      await roomRef.current.localParticipant.setCameraEnabled(cameraEnabledForTurn);
    } catch (error) {
      setLiveKitStatus(
        error instanceof Error
          ? `Permite el microfono/camara en el navegador: ${error.message}`
          : "Permite el microfono/camara en el navegador",
      );

      return;
    }
    setPublishing(true);
    setMicPassed(true);
    setMuted(false);
    setLiveKitStatus(
      cameraEnabledForTurn ? "Publicando microfono/camara" : "Publicando microfono",
    );
  }

  async function handleStopPublishing() {
    if (!roomRef.current) {
      return;
    }

    await roomRef.current.localParticipant.setCameraEnabled(false);
    await roomRef.current.localParticipant.setMicrophoneEnabled(false);
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;

    if (localPreviewRef.current) {
      localPreviewRef.current.srcObject = null;
    }

    setPublishing(false);
    setLiveKitStatus("Audio/video detenido");
  }

  async function handlePassMicrophone() {
    if (!canModerateStage) {
      setLiveKitStatus("Solo el moderador en turno puede pasar el micrófono");

      return;
    }

    if (!hasNextPerformer) {
      setLiveKitStatus("Este es el último turno. Apaga el en vivo al terminar.");

      return;
    }

    const nextPerformerIndex = safeActivePerformer + 1;

    await handleStopPublishing();
    setActivePerformer(nextPerformerIndex);
    setMicPassed(false);
    void publishRoomSignal({
      type: "stage-control",
      control: "paso el microfono al siguiente participante",
      enabled: true,
      nextPerformerIndex,
      sender: liveKitIdentity.trim() || connectedRole || "performer",
    });
    pushRoomEvent("Micrófono pasado al siguiente participante");
  }

  async function handleLiveKitDisconnect() {
    roomRef.current?.disconnect();
    roomRef.current = null;
    mediaContainerRef.current
      ?.querySelectorAll("[data-livekit-track]")
      .forEach((element) => element.remove());
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;

    if (localPreviewRef.current) {
      localPreviewRef.current.srcObject = null;
    }

    setConnectedRole(null);
    setPublishing(false);
    setLiveKitParticipants(0);
    setActiveSpeakers([]);
    pushRoomEvent("Saliste de LiveKit");
  }

  async function handlePrimaryStageAction() {
    if (!roomOpen && canModerateStage) {
      await handleOpenStage();

      return;
    }

    if (canPublishThisTurn) {
      await handleStartPublishing();

      return;
    }

    await handleLiveKitConnect("audience");
  }

  return (
    <main className="scenario-page">
      <section className="scenario-hero" aria-labelledby="scenario-title">
        <div className="scenario-copy">
          <p className="scenario-eyebrow">Escenario en vivo ET</p>
          <h1 id="scenario-title" className="scenario-title">
            <span>Próximamente</span>
            <strong>Voces</strong>
            <em>Debut</em>
          </h1>
          <p className="scenario-date">Julio 15</p>
          <p className="scenario-description">
            No te lo pierdas. Un teatro digital para escuchar, cantar y vivir
            presentaciones estilo sala en vivo con artistas al frente y oyentes
            reaccionando en tiempo real.
          </p>

          <div className="scenario-actions">
            <button
              type="button"
              className="join-event-button"
              onClick={handleJoin}
              aria-pressed={joined}
            >
              {joined ? "Ya estás dentro" : "Unirme al evento"}
            </button>
            <a href="#live-room" className="watch-stage-link">
              Ver escenario
            </a>
          </div>
        </div>

        <div className="scenario-live-panel" aria-label="Estado del evento">
          <div className="live-dot" />
          <span>{roomOpen ? "sala abierta" : "sala en espera"}</span>
          <span>{liveListeners} oyentes</span>
          <span>{liveKitParticipants} livekit</span>
          <span>{stageQueue.length} participantes</span>
        </div>
      </section>

      <section id="live-room" className="theater-shell" aria-label="Escenario en vivo">
        <div className="theater-sign">
          <span>ET Live</span>
          <strong>Voces Debut</strong>
          <span>15 Julio</span>
        </div>

        <div className="livekit-status" aria-label="Estado de la sala LiveKit">
          <span>LiveKit listo</span>
          <strong>{liveKitStatus}</strong>
          <span>{activeSpeakers.length ? activeSpeakers.join(", ") : "sin voces activas"}</span>
          <em>{votingOpen ? "Votación activa" : "Votación cerrada"}</em>
        </div>

        <div className="stage-lights" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>

        <div
          className={`curtain curtain-left ${curtainOpen ? "is-open" : ""}`}
          aria-hidden="true"
        />
        <div
          className={`curtain curtain-right ${curtainOpen ? "is-open" : ""}`}
          aria-hidden="true"
        />

        <div className="main-stage">
          <div className="performer-row">
            {stageQueue.length ? (
              stageQueue.map((item, index) => (
                <div
                  key={item.userId ?? item.name}
                  className={`performer ${activePerformer === index ? "is-active" : ""} ${
                    item.userId === currentUserId ? "is-mine" : ""
                  }`}
                  style={{ "--performer-color": item.color } as React.CSSProperties}
                >
                  <span className="performer-spotlight" />
                  <span className="performer-avatar">
                    {item.photoUrl ? (
                      <Image
                        src={item.photoUrl}
                        alt=""
                        className="performer-photo"
                        width={58}
                        height={58}
                        unoptimized
                      />
                    ) : (
                      <span className="performer-head">
                        {item.name.slice(0, 1).toUpperCase()}
                      </span>
                    )}
                    <span className="performer-body" />
                    <span className="performer-mic" />
                  </span>
                  <strong>{item.name}</strong>
                  <small>
                    {item.userId === currentUserId
                      ? activePerformer === index
                        ? "Tu turno"
                        : "En tu fila"
                      : item.role}
                  </small>
                </div>
              ))
            ) : (
              <div className="empty-stage-message">
                <strong>Esperando al primer participante registrado</strong>
                <span>Únete a un concurso para aparecer en la fila oficial del escenario.</span>
              </div>
            )}
          </div>

          <div className="stage-camera-frame">
            <video
              ref={localPreviewRef}
              className="local-preview"
              autoPlay
              muted
              playsInline
            />
            <div ref={mediaContainerRef} className="livekit-media" aria-live="polite" />
          </div>

          <div className="song-now">
            <span>{roomOpen ? "Presentándose ahora" : "Fila preparada"}</span>
            <strong>{performer?.song ?? "Esperando datos oficiales de audición"}</strong>
          </div>

          <div className="audio-wave" aria-hidden="true">
            {Array.from({ length: 26 }).map((_, index) => (
              <span key={index} style={{ "--bar": index } as React.CSSProperties} />
            ))}
          </div>
        </div>

        <div className="audience-floor" aria-label="Oyentes en vivo">
          {liveListeners > 0 ? (
            Array.from({ length: Math.min(liveListeners, 12) }).map((_, index) => (
              <span
                key={index}
                className="listener-seat"
                style={{ "--seat": index } as React.CSSProperties}
                title="Oyente en vivo"
              >
                ET
              </span>
            ))
          ) : (
            <span className="audience-empty">La audiencia se abre cuando la sala entra en vivo</span>
          )}
        </div>

        <div className="live-controls" aria-label="Controles de la sala">
          <div>
            <span className="controls-label">Sala en vivo</span>
            <strong>{reactionCount} reacciones</strong>
          </div>
          <div className="reaction-buttons">
            {reactions.map((reaction) => (
              <button
                key={reaction}
                type="button"
                disabled={!roomOpen}
                onClick={() => handleReaction(reaction)}
              >
                {reaction}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="competitor-room" aria-label="Sala de competidores">
        <div className="ops-grid">
          <section className="ops-panel" aria-label="Acceso de participantes">
            <div className="ops-heading">
              <span>Fila de canto</span>
              <strong>{isMyTurn ? "Tu turno" : "En espera"}</strong>
            </div>
            <div className="queue-list" aria-label="Cola de participantes">
              {stageQueue.length ? (
                stageQueue.map((item, index) => (
                  <div
                    key={item.userId ?? item.name}
                    className={activePerformer === index ? "is-active" : ""}
                  >
                    <span>{index + 1}</span>
                    <strong>{item.name}</strong>
                    <em>{item.userId === currentUserId ? "yo" : item.song}</em>
                  </div>
                ))
              ) : (
                <div>
                  <span>0</span>
                  <strong>Esperando participantes</strong>
                  <em>Únete desde Concursos</em>
                </div>
              )}
            </div>
            {!currentUserRegistered ? (
              <Link className="publish-button" href="/concursos">
                {primaryStageLabel}
              </Link>
            ) : (
              <button
                type="button"
                className="publish-button"
                disabled={
                  primaryStageLabel === "Cantando en vivo" ||
                  primaryStageLabel === "Estas en audiencia"
                }
                onClick={handlePrimaryStageAction}
              >
                {primaryStageLabel}
              </button>
            )}
            <div className="stream-state">
              <span>{queueStatus}</span>
              <span>
                {currentUserRegistered
                  ? "Registrado en canto"
                  : "Necesitas estar registrado en canto para abrir el en vivo"}
              </span>
              <span>{connectedRole === "performer" ? "Conectado a LiveKit" : "Sin conexión de participante"}</span>
              <span>{micPassed ? "Micrófono activo" : "Listo para turno"}</span>
              <span>{muted ? "Silenciado por host" : "Canal listo"}</span>
            </div>
          </section>

          <section className="ops-panel" aria-label="Votación de audiencia">
            <div className="ops-heading">
              <span>Votación en vivo</span>
              <strong>{votes} votos</strong>
            </div>
            <button
              type="button"
              className="vote-button"
              onClick={handleVote}
              disabled={!votingOpen || !roomOpen}
            >
              Votar
            </button>
          </section>
        </div>

        {canModerateStage || roomEvents.length ? (
        <section className="livekit-console" aria-label="Conexión LiveKit">
          <div className="ops-heading">
            <span>Sala LiveKit</span>
            <strong>{connectedRole ? connectedRole : "desconectado"}</strong>
          </div>
          <p className="livekit-note">
            La audiencia solo escucha y vota. Los controles aparecen para el
            moderador registrado cuando llega su turno.
          </p>
          <div className="livekit-actions">
            {canModerateStage ? (
              <>
                <label className="camera-toggle">
                  <input
                    type="checkbox"
                    checked={cameraEnabledForTurn}
                    onChange={(event) => setCameraEnabledForTurn(event.target.checked)}
                  />
                  Cámara opcional
                </label>
                <button type="button" onClick={handleStartPublishing}>
                  {cameraEnabledForTurn ? "Encender mic/cámara" : "Encender micrófono"}
                </button>
                {hasNextPerformer ? (
                  <button
                    type="button"
                    onClick={handlePassMicrophone}
                    disabled={!publishing || connectedRole !== "performer"}
                  >
                    Pasar micrófono
                  </button>
                ) : null}
                <button type="button" onClick={handleStopPublishing} disabled={!publishing}>
                  Apagar micrófono
                </button>
                {isFinalModerator ? (
                  <button type="button" onClick={handleCloseStage} disabled={!roomOpen}>
                    Apagar en vivo
                  </button>
                ) : null}
              </>
            ) : null}
          </div>
          <div className="event-feed" aria-label="Eventos de sala">
            {roomEvents.map((event, index) => (
              <span key={`${event}-${index}`}>{event}</span>
            ))}
          </div>
        </section>
        ) : null}
      </section>

      <style>{`
        .scenario-page {
          min-height: 100vh;
          padding: 110px 1rem 4rem;
          color: white;
          overflow: hidden;
        }

        .scenario-hero {
          position: relative;
          width: min(1180px, 100%);
          margin: 0 auto 2rem;
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 1.5rem;
          align-items: end;
        }

        .scenario-copy {
          max-width: 820px;
        }

        .scenario-eyebrow {
          margin: 0 0 1rem;
          color: #67e8f9;
          font-size: 0.85rem;
          font-weight: 1000;
          letter-spacing: 0.28em;
          text-transform: uppercase;
        }

        .scenario-title {
          margin: 0;
          max-width: 920px;
          font-weight: 1000;
          letter-spacing: 0;
          line-height: 0.86;
          text-transform: uppercase;
        }

        .scenario-title span,
        .scenario-title strong,
        .scenario-title em {
          display: block;
        }

        .scenario-title span {
          width: fit-content;
          border: 1px solid rgba(103, 232, 249, 0.28);
          border-radius: 8px;
          background: rgba(0, 0, 0, 0.42);
          padding: 0.45rem 0.65rem;
          color: #67e8f9;
          font-size: clamp(0.95rem, 2vw, 1.35rem);
          letter-spacing: 0.28em;
          line-height: 1;
          box-shadow: 0 0 22px rgba(34, 211, 238, 0.16);
        }

        .scenario-title strong {
          margin-top: 0.7rem;
          background: linear-gradient(90deg, #ffffff, #67e8f9, #f472b6);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-size: clamp(4.2rem, 11vw, 9.8rem);
          line-height: 0.82;
        }

        .scenario-title em {
          background: linear-gradient(90deg, #fde047, #f472b6, #67e8f9);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-size: clamp(3.4rem, 8vw, 7.6rem);
          font-style: normal;
          line-height: 0.88;
        }

        .scenario-date {
          margin: 1rem 0 0;
          color: #fde68a;
          font-size: clamp(1.6rem, 3vw, 3rem);
          font-weight: 1000;
          text-transform: uppercase;
        }

        .scenario-description {
          max-width: 680px;
          margin: 1rem 0 0;
          color: #bae6fd;
          font-size: 1.05rem;
          font-weight: 700;
          line-height: 1.8;
        }

        .scenario-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
          margin-top: 1.7rem;
        }

        .join-event-button,
        .watch-stage-link {
          display: inline-flex;
          min-height: 48px;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 0.85rem 1.35rem;
          font-size: 0.9rem;
          font-weight: 1000;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
        }

        .join-event-button {
          border: 1px solid rgba(255, 255, 255, 0.26);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.32), transparent 46%),
            linear-gradient(90deg, #22d3ee, #ec4899, #facc15);
          color: white;
          cursor: pointer;
          box-shadow:
            0 0 28px rgba(34, 211, 238, 0.28),
            0 0 34px rgba(250, 204, 21, 0.22),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
        }

        .watch-stage-link {
          border: 1px solid rgba(103, 232, 249, 0.34);
          background: rgba(0, 0, 0, 0.34);
          color: #cffafe;
        }

        .join-event-button:hover,
        .watch-stage-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 38px rgba(34, 211, 238, 0.34);
        }

        .scenario-live-panel {
          display: flex;
          min-width: 230px;
          flex-wrap: wrap;
          align-items: center;
          justify-content: flex-end;
          gap: 0.7rem;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 8px;
          background: rgba(0, 0, 0, 0.44);
          padding: 1rem;
          color: #e0f2fe;
          font-size: 0.82rem;
          font-weight: 1000;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
        }

        .live-dot {
          width: 0.72rem;
          height: 0.72rem;
          border-radius: 999px;
          background: #22c55e;
          box-shadow: 0 0 18px #22c55e;
          animation: livePulse 1.6s ease-in-out infinite;
        }

        .theater-shell {
          position: relative;
          width: min(1180px, 100%);
          margin: 0 auto;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 8px;
          background:
            radial-gradient(circle at 50% 4%, rgba(250, 204, 21, 0.22), transparent 22%),
            linear-gradient(180deg, rgba(8, 10, 28, 0.96), rgba(0, 0, 0, 0.92) 58%, rgba(31, 12, 6, 0.96));
          box-shadow:
            0 0 56px rgba(34, 211, 238, 0.14),
            0 0 62px rgba(250, 204, 21, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.18);
        }

        .theater-sign {
          position: relative;
          z-index: 4;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 1rem;
          align-items: center;
          padding: 1.1rem clamp(1rem, 4vw, 3rem);
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(0, 0, 0, 0.5);
          text-align: center;
          text-transform: uppercase;
        }

        .theater-sign span {
          color: #67e8f9;
          font-size: 0.78rem;
          font-weight: 1000;
          letter-spacing: 0.18em;
        }

        .theater-sign strong {
          color: #fef3c7;
          font-size: clamp(1rem, 2vw, 1.45rem);
          letter-spacing: 0.12em;
        }

        .livekit-status {
          position: relative;
          z-index: 4;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 0.7rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(2, 6, 23, 0.58);
          padding: 0.8rem 1rem;
          text-align: center;
          text-transform: uppercase;
        }

        .livekit-status span,
        .livekit-status em {
          color: #67e8f9;
          font-size: 0.72rem;
          font-style: normal;
          font-weight: 1000;
          letter-spacing: 0.14em;
        }

        .livekit-status strong {
          color: #fef3c7;
          font-size: 0.8rem;
          letter-spacing: 0.12em;
        }

        .stage-lights {
          position: absolute;
          inset: 4rem 6% auto;
          z-index: 1;
          display: flex;
          justify-content: space-between;
          pointer-events: none;
        }

        .stage-lights span {
          width: 18%;
          height: 420px;
          transform-origin: top;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.3), rgba(250, 204, 21, 0.14), transparent);
          clip-path: polygon(42% 0, 58% 0, 100% 100%, 0 100%);
          filter: blur(1px);
          opacity: 0.58;
          animation: lightSweep 5.5s ease-in-out infinite;
        }

        .stage-lights span:nth-child(2) {
          animation-delay: -1.4s;
          background: linear-gradient(180deg, rgba(103, 232, 249, 0.28), rgba(34, 211, 238, 0.12), transparent);
        }

        .stage-lights span:nth-child(3) {
          animation-delay: -2.8s;
          background: linear-gradient(180deg, rgba(244, 114, 182, 0.24), rgba(236, 72, 153, 0.12), transparent);
        }

        .stage-lights span:nth-child(4) {
          animation-delay: -4.1s;
        }

        .curtain {
          position: absolute;
          top: 0;
          bottom: 0;
          z-index: 2;
          width: 18%;
          background:
            repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.08) 0 4px, transparent 4px 18px),
            linear-gradient(90deg, #4c0519, #be123c 48%, #4c0519);
          opacity: 0.88;
          pointer-events: none;
          transition: transform 1.1s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.8s ease;
        }

        .curtain-left {
          left: 0;
          box-shadow: 18px 0 36px rgba(0, 0, 0, 0.5);
        }

        .curtain-right {
          right: 0;
          box-shadow: -18px 0 36px rgba(0, 0, 0, 0.5);
        }

        .curtain-left.is-open {
          transform: translateX(-78%);
          opacity: 0.44;
        }

        .curtain-right.is-open {
          transform: translateX(78%);
          opacity: 0.44;
        }

        .main-stage {
          position: relative;
          z-index: 3;
          min-height: 470px;
          padding: 4rem clamp(1rem, 7vw, 6rem) 2rem;
          display: grid;
          align-content: end;
          gap: 1.4rem;
        }

        .performer-row {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(0.7rem, 2vw, 1.3rem);
          align-items: end;
        }

        .performer {
          --performer-color: #22d3ee;
          position: relative;
          min-height: 230px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 8px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(0, 0, 0, 0.36));
          color: white;
          overflow: hidden;
          display: grid;
          place-items: end center;
          padding: 1rem;
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }

        .performer.is-active {
          transform: translateY(-8px);
          border-color: color-mix(in srgb, var(--performer-color), white 25%);
          box-shadow:
            0 0 34px color-mix(in srgb, var(--performer-color), transparent 50%),
            inset 0 1px 0 rgba(255, 255, 255, 0.16);
        }

        .performer-spotlight {
          position: absolute;
          inset: 0 14% 22%;
          background: linear-gradient(180deg, color-mix(in srgb, var(--performer-color), transparent 58%), transparent);
          clip-path: polygon(44% 0, 56% 0, 100% 100%, 0 100%);
          opacity: 0.4;
          pointer-events: none;
        }

        .performer-avatar {
          position: relative;
          z-index: 2;
          width: 92px;
          height: 142px;
          display: grid;
          justify-items: center;
          align-items: start;
        }

        .performer-head {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          background: radial-gradient(circle at 34% 26%, #ffffff, var(--performer-color) 28%, #111827 72%);
          color: white;
          font-size: 1.25rem;
          font-weight: 1000;
          box-shadow: 0 0 22px color-mix(in srgb, var(--performer-color), transparent 45%);
        }

        .performer-photo {
          width: 58px;
          height: 58px;
          border: 2px solid rgba(255, 255, 255, 0.68);
          border-radius: 999px;
          object-fit: cover;
          box-shadow:
            0 0 24px color-mix(in srgb, var(--performer-color), transparent 38%),
            0 10px 22px rgba(0, 0, 0, 0.34);
        }

        .performer-body {
          width: 76px;
          height: 86px;
          margin-top: -2px;
          border-radius: 36px 36px 8px 8px;
          background: linear-gradient(180deg, var(--performer-color), #020617 86%);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.32);
        }

        .performer-mic {
          position: absolute;
          right: 5px;
          top: 58px;
          width: 8px;
          height: 62px;
          border-radius: 999px;
          background: #e5e7eb;
          transform: rotate(-18deg);
          box-shadow: 0 0 12px rgba(255, 255, 255, 0.42);
        }

        .performer strong,
        .performer small {
          position: relative;
          z-index: 2;
          display: block;
          text-align: center;
        }

        .performer strong {
          font-size: 1rem;
          font-weight: 1000;
          text-transform: uppercase;
        }

        .performer small {
          color: #bae6fd;
          font-size: 0.72rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .song-now {
          justify-self: center;
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem 0.8rem;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 8px;
          background: rgba(0, 0, 0, 0.55);
          padding: 0.85rem 1rem;
          color: #fef3c7;
          box-shadow: 0 0 28px rgba(250, 204, 21, 0.12);
        }

        .stage-camera-frame {
          display: grid;
          gap: 0.65rem;
          width: min(620px, 100%);
          justify-self: center;
          border: 1px solid rgba(250, 204, 21, 0.22);
          border-radius: 8px;
          background:
            radial-gradient(circle at 50% 0%, rgba(250, 204, 21, 0.12), transparent 48%),
            rgba(2, 6, 23, 0.62);
          padding: 0.65rem;
          box-shadow:
            0 0 34px rgba(34, 211, 238, 0.13),
            0 0 42px rgba(250, 204, 21, 0.11);
        }

        .local-preview {
          display: block;
          width: 100%;
          min-height: 190px;
          max-height: 340px;
          border: 1px solid rgba(103, 232, 249, 0.2);
          border-radius: 8px;
          background: #020617;
          object-fit: cover;
        }

        .song-now span {
          color: #67e8f9;
          font-size: 0.72rem;
          font-weight: 1000;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .song-now strong {
          font-size: 1rem;
          font-weight: 1000;
          text-transform: uppercase;
        }

        .audio-wave {
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }

        .audio-wave span {
          width: 6px;
          height: calc(12px + (var(--bar) % 9) * 4px);
          border-radius: 999px;
          background: linear-gradient(180deg, #67e8f9, #f472b6, #facc15);
          animation: waveBounce 0.9s ease-in-out infinite;
          animation-delay: calc(var(--bar) * -0.045s);
        }

        .audience-floor {
          position: relative;
          z-index: 3;
          display: grid;
          grid-template-columns: repeat(12, minmax(30px, 1fr));
          gap: 0.6rem;
          padding: 1.4rem clamp(1rem, 6vw, 5rem) 2rem;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.05), transparent 24%),
            repeating-linear-gradient(90deg, rgba(250, 204, 21, 0.08) 0 1px, transparent 1px 9%);
          border-top: 1px solid rgba(255, 255, 255, 0.12);
        }

        .listener-seat {
          aspect-ratio: 1;
          display: grid;
          place-items: center;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background:
            radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.62), transparent 18%),
            linear-gradient(135deg, rgba(34, 211, 238, 0.5), rgba(236, 72, 153, 0.42), rgba(250, 204, 21, 0.46));
          color: white;
          font-size: 0.8rem;
          font-weight: 1000;
          box-shadow: 0 0 18px rgba(34, 211, 238, 0.14);
          animation: seatGlow 3s ease-in-out infinite;
          animation-delay: calc(var(--seat) * -0.17s);
        }

        .live-controls {
          position: relative;
          z-index: 4;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(0, 0, 0, 0.58);
          padding: 1rem clamp(1rem, 4vw, 3rem);
        }

        .controls-label {
          display: block;
          color: #67e8f9;
          font-size: 0.72rem;
          font-weight: 1000;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .live-controls strong {
          color: #fef3c7;
          font-size: 1rem;
          text-transform: uppercase;
        }

        .reaction-buttons {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 0.5rem;
        }

        .reaction-buttons button {
          min-height: 38px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.06);
          color: #e0f2fe;
          cursor: pointer;
          font-size: 0.75rem;
          font-weight: 1000;
          letter-spacing: 0.08em;
          padding: 0.55rem 0.78rem;
          text-transform: uppercase;
          transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
        }

        .reaction-buttons button:hover {
          transform: translateY(-2px);
          border-color: rgba(250, 204, 21, 0.52);
          background: rgba(250, 204, 21, 0.12);
        }

        .competitor-room {
          width: min(1180px, 100%);
          margin: 1.25rem auto 0;
          display: grid;
          gap: 1rem;
        }

        .ops-panel {
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 8px;
          background: rgba(0, 0, 0, 0.5);
          box-shadow:
            0 0 24px rgba(34, 211, 238, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.12);
        }

        .ops-heading span {
          color: #67e8f9;
          font-size: 0.72rem;
          font-weight: 1000;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .ops-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 1rem;
        }

        .ops-panel {
          display: grid;
          gap: 1rem;
          align-content: start;
          padding: 1rem;
        }

        .ops-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.8rem;
        }

        .ops-heading strong {
          border: 1px solid rgba(250, 204, 21, 0.28);
          border-radius: 999px;
          color: #fef3c7;
          font-size: 0.72rem;
          font-weight: 1000;
          letter-spacing: 0.08em;
          padding: 0.42rem 0.6rem;
          text-transform: uppercase;
        }

        .vote-button,
        .publish-button,
        .livekit-actions button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.06);
          color: #e0f2fe;
          cursor: pointer;
          font-size: 0.75rem;
          font-weight: 1000;
          letter-spacing: 0.08em;
          padding: 0.65rem 0.82rem;
          text-align: center;
          text-decoration: none;
          text-transform: uppercase;
          transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
        }

        .vote-button:hover:not(:disabled),
        .publish-button:hover,
        .livekit-actions button:hover:not(:disabled) {
          transform: translateY(-2px);
          border-color: rgba(34, 211, 238, 0.48);
          background: rgba(34, 211, 238, 0.12);
        }

        .queue-list {
          display: grid;
          gap: 0.55rem;
          max-height: 250px;
          overflow: auto;
          padding-right: 0.15rem;
        }

        .queue-list div {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          gap: 0.7rem;
          align-items: center;
          min-height: 46px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.045);
          color: white;
          padding: 0.65rem 0.75rem;
          text-align: left;
          transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
        }

        .queue-list div.is-active {
          transform: translateY(-1px);
          border-color: rgba(250, 204, 21, 0.44);
          background: rgba(250, 204, 21, 0.1);
        }

        .queue-list span {
          display: grid;
          width: 1.85rem;
          aspect-ratio: 1;
          place-items: center;
          border-radius: 999px;
          background: rgba(34, 211, 238, 0.12);
          color: #67e8f9;
          font-size: 0.74rem;
          font-weight: 1000;
        }

        .queue-list strong {
          min-width: 0;
          overflow: hidden;
          color: #fef3c7;
          font-size: 0.86rem;
          font-weight: 1000;
          text-overflow: ellipsis;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .queue-list em {
          color: #bae6fd;
          font-size: 0.72rem;
          font-style: normal;
          font-weight: 900;
          text-transform: uppercase;
        }

        .stream-state {
          display: grid;
          gap: 0.48rem;
        }

        .stream-state span {
          color: #bae6fd;
          font-size: 0.82rem;
          font-weight: 900;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .vote-button {
          width: 100%;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.24), transparent 46%),
            linear-gradient(90deg, #22d3ee, #ec4899, #facc15);
          color: white;
        }

        .vote-button:disabled,
        .publish-button:disabled,
        .livekit-actions button:disabled {
          cursor: not-allowed;
          filter: grayscale(0.8);
          opacity: 0.5;
        }

        .publish-button {
          width: 100%;
        }

        .livekit-console {
          display: grid;
          gap: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 8px;
          background: rgba(0, 0, 0, 0.5);
          padding: 1rem;
          box-shadow:
            0 0 24px rgba(34, 211, 238, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.12);
        }

        .livekit-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
        }

        .livekit-note {
          margin: 0;
          color: #bae6fd;
          font-size: 0.86rem;
          font-weight: 800;
          line-height: 1.6;
        }

        .camera-toggle {
          display: inline-flex;
          min-height: 42px;
          align-items: center;
          gap: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.05);
          color: #e0f2fe;
          cursor: pointer;
          font-size: 0.75rem;
          font-weight: 1000;
          letter-spacing: 0.08em;
          padding: 0.65rem 0.82rem;
          text-transform: uppercase;
        }

        .camera-toggle input {
          accent-color: #22d3ee;
        }

        .livekit-media {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 0.8rem;
          min-height: 68px;
          border: 1px dashed rgba(103, 232, 249, 0.24);
          border-radius: 8px;
          padding: 0.75rem;
          place-items: center;
        }

        .livekit-media:empty::before {
          content: "LiveKit remoto aparecera aqui al publicar.";
          color: #bae6fd;
          font-size: 0.84rem;
          font-weight: 800;
        }

        .livekit-media video,
        .livekit-media audio {
          width: 100%;
          max-height: 340px;
          border-radius: 8px;
          background: #020617;
        }

        .event-feed {
          display: grid;
          gap: 0.4rem;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          background: rgba(2, 6, 23, 0.42);
          padding: 0.75rem;
        }

        .event-feed span {
          color: #bae6fd;
          font-size: 0.82rem;
          font-weight: 850;
          letter-spacing: 0.02em;
        }

        @keyframes livePulse {
          0%, 100% {
            opacity: 0.58;
            transform: scale(0.86);
          }

          50% {
            opacity: 1;
            transform: scale(1.12);
          }
        }

        @keyframes lightSweep {
          0%, 100% {
            transform: rotate(-8deg);
            opacity: 0.38;
          }

          50% {
            transform: rotate(8deg);
            opacity: 0.72;
          }
        }

        @keyframes waveBounce {
          0%, 100% {
            transform: scaleY(0.52);
          }

          50% {
            transform: scaleY(1.2);
          }
        }

        @keyframes seatGlow {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.72;
          }

          50% {
            transform: translateY(-5px);
            opacity: 1;
          }
        }

        @media (max-width: 860px) {
          .scenario-hero {
            grid-template-columns: 1fr;
          }

          .scenario-live-panel {
            justify-content: flex-start;
            width: fit-content;
          }

          .curtain {
            width: 10%;
          }

          .main-stage {
            min-height: 420px;
            padding-top: 3rem;
          }
        }

        @media (max-width: 640px) {
          .scenario-page {
            padding-top: 100px;
          }

          .scenario-title strong {
            font-size: clamp(3.2rem, 18vw, 5.4rem);
          }

          .scenario-title em {
            font-size: clamp(2.8rem, 15vw, 4.6rem);
          }

          .theater-sign {
            grid-template-columns: 1fr;
            gap: 0.35rem;
          }

          .ops-grid {
            grid-template-columns: 1fr;
          }

          .performer-row {
            grid-template-columns: 1fr;
          }

          .performer {
            min-height: 178px;
          }

          .performer-avatar {
            width: 78px;
            height: 108px;
          }

          .performer-head {
            width: 40px;
            height: 40px;
          }

          .performer-photo {
            width: 48px;
            height: 48px;
          }

          .performer-body {
            width: 62px;
            height: 64px;
          }

          .performer-mic {
            top: 48px;
            height: 48px;
          }

          .audio-wave span {
            width: 4px;
          }

          .audience-floor {
            grid-template-columns: repeat(6, minmax(28px, 1fr));
          }

          .live-controls {
            align-items: stretch;
            flex-direction: column;
          }

          .reaction-buttons {
            justify-content: flex-start;
          }
        }
      `}</style>
    </main>
  );
}
