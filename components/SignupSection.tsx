"use client";

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Session } from "@supabase/supabase-js";
import CamerinoProfile from "@/components/camerino/CamerinoProfile";
import {
  createSupabaseBrowserClient,
  hasSupabaseBrowserConfig,
} from "@/lib/supabase/client";

type Role = "audience" | "performer";
type AuthMode = "signup" | "signin";
type FriendStatus = "pending" | "accepted" | "declined";

type ProfileForm = {
  name: string;
  username: string;
  photo_url: string;
  country: string;
  city: string;
  birth_year: string;
  birth_month: string;
  birth_day: string;
  gender: string;
  bio: string;
  talent_type: string;
  age_range: string;
  stage_name: string;
  genre: string;
  experience_level: string;
  social_links: string;
  demo_video_url: string;
  camerino_theme: string;
};

type DirectoryProfile = {
  user_id: string;
  name: string;
  username: string;
  photo_url: string | null;
  country: string | null;
  city: string | null;
  date_of_birth: string | null;
  gender: string | null;
  bio: string | null;
  talent_type: string | null;
  age_range: string | null;
  stage_name?: string | null;
  genre?: string | null;
  camerino_theme: string | null;
  follower_count: number;
  is_following: boolean;
  friend_status?: FriendStatus | "received" | "friends";
};

type FriendRequest = {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: FriendStatus;
};

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  body: string;
  created_at: string;
};

type CamerinoSample = {
  id: string;
  user_id: string;
  title: string;
  url: string;
  sample_type: "audio" | "video" | "image" | "link";
};

const emptyForm: ProfileForm = {
  name: "",
  username: "",
  photo_url: "",
  country: "",
  city: "",
  birth_year: "",
  birth_month: "",
  birth_day: "",
  gender: "",
  bio: "",
  talent_type: "",
  age_range: "",
  stage_name: "",
  genre: "",
  experience_level: "",
  social_links: "",
  demo_video_url: "",
  camerino_theme: "gold",
};

const talentOptions = [
  "Canto",
  "Rap & Freestyle",
  "Beats & Producción Musical",
  "Instrumentistas",
  "Danza",
  "Teatro & Actuación",
  "Fotografía",
  "Cine & Video",
  "Arte Digital",
  "Diseño de Moda",
  "Escritura & Poesía",
  "Comedia",
  "Maquillaje Artístico",
  "DJ & Mezcla",
  "Artes Plásticas",
  "Talento Libre",
];

const countryOptions = [
  "Estados Unidos",
  "México",
  "Colombia",
  "República Dominicana",
  "Puerto Rico",
  "Venezuela",
  "Argentina",
  "Chile",
  "Perú",
  "España",
  "Otro",
];

const genderOptions = [
  { value: "mujer", label: "Mujer" },
  { value: "hombre", label: "Hombre" },
  { value: "no_binario", label: "No binario" },
  { value: "prefiero_no_decir", label: "Prefiero no decir" },
  { value: "otro", label: "Otro" },
];

const monthOptions = [
  { value: "01", label: "Enero" },
  { value: "02", label: "Febrero" },
  { value: "03", label: "Marzo" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Mayo" },
  { value: "06", label: "Junio" },
  { value: "07", label: "Julio" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
];

const currentYear = new Date().getFullYear();
const birthYears = Array.from({ length: 90 }, (_item, index) =>
  String(currentYear - 8 - index),
);
const birthDays = Array.from({ length: 31 }, (_item, index) =>
  String(index + 1).padStart(2, "0"),
);
const pendingProfileStorageKey = "encuentro_pending_profile";
const maxProfilePhotoSize = 2 * 1024 * 1024;

function normalizeUsername(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 32);
}

function createInternalUsername(stageName: string, currentUserId: string) {
  const base = normalizeUsername(stageName) || "perfil_et";
  const suffix = currentUserId.replace(/-/g, "").slice(0, 8);
  const maxBaseLength = Math.max(3, 32 - suffix.length - 1);

  return `${base.slice(0, maxBaseLength)}_${suffix}`;
}

function parseSocialLinks(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return {};
  }

  return trimmed
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((links, url, index) => {
      links[`link_${index + 1}`] = url;
      return links;
    }, {});
}

function serializeSocialLinks(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return "";
  }

  return Object.values(value as Record<string, string>)
    .filter(Boolean)
    .join(", ");
}

function getPhotoPath(userId: string, file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExtension = extension.replace(/[^a-z0-9]/g, "") || "jpg";

  return `${userId}/profile-${Date.now()}.${safeExtension}`;
}

function getDateOfBirth(form: ProfileForm) {
  if (!form.birth_year || !form.birth_month || !form.birth_day) {
    return "";
  }

  const date = new Date(
    Number(form.birth_year),
    Number(form.birth_month) - 1,
    Number(form.birth_day),
  );
  const isValid =
    date.getFullYear() === Number(form.birth_year) &&
    date.getMonth() === Number(form.birth_month) - 1 &&
    date.getDate() === Number(form.birth_day);

  if (!isValid) {
    return "";
  }

  return `${form.birth_year}-${form.birth_month}-${form.birth_day}`;
}

function splitDateOfBirth(value: string | null) {
  if (!value) {
    return { birth_year: "", birth_month: "", birth_day: "" };
  }

  const [birth_year, birth_month, birth_day] = value.split("-");

  return {
    birth_year: birth_year ?? "",
    birth_month: birth_month ?? "",
    birth_day: birth_day ?? "",
  };
}

function getAgeRange(dateOfBirth: string) {
  if (!dateOfBirth) {
    return "";
  }

  const today = new Date();
  const birthDate = new Date(`${dateOfBirth}T00:00:00`);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDelta = today.getMonth() - birthDate.getMonth();

  if (
    monthDelta < 0 ||
    (monthDelta === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  if (age < 18) return "13-17";
  if (age < 25) return "18-24";
  if (age < 35) return "25-34";

  return "35+";
}

function validateRequiredProfileFields(form: ProfileForm, hasProfilePhoto: boolean) {
  const dateOfBirth = getDateOfBirth(form);

  if (!form.name.trim()) return "Agrega tu nombre completo.";
  if (!form.stage_name.trim()) return "Agrega tu nombre artistico.";
  if (!form.country.trim()) return "Selecciona tu pais.";
  if (!form.city.trim()) return "Agrega tu ciudad.";
  if (!dateOfBirth) return "Agrega tu fecha de nacimiento completa y valida.";
  if (!form.gender) return "Selecciona tu genero.";
  if (!hasProfilePhoto) return "Sube una foto de perfil.";
  if (!form.talent_type) return "Selecciona tu categoria.";
  if (!form.bio.trim()) return "Agrega una bio corta para tu perfil.";

  return "";
}

function getPublicSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredUrl) {
    try {
      const url = new URL(configuredUrl);

      if (url.protocol === "https:" || url.protocol === "http:") {
        return url.origin;
      }
    } catch {
      // Fall back to the current origin when the env value is not a valid URL.
    }
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "";
}

function getEmailRedirectTo() {
  const siteUrl = getPublicSiteUrl();

  return siteUrl ? `${siteUrl}/registro?verified=1` : undefined;
}

function isAlreadyRegisteredError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();

  return (
    message.includes("already registered") ||
    message.includes("already been registered") ||
    message.includes("user already registered")
  );
}

function isSignupDisabledError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  return error.message.toLowerCase().includes("signups not allowed");
}

export default function SignupSection({
  mode = "registro",
}: {
  mode?: "registro" | "camerino";
}) {
  const supabase = useMemo(
    () => (hasSupabaseBrowserConfig() ? createSupabaseBrowserClient() : null),
    [],
  );
  const [session, setSession] = useState<Session | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>("signup");
  const [role, setRole] = useState<Role>("audience");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<ProfileForm>(emptyForm);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [directory, setDirectory] = useState<DirectoryProfile[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [samples, setSamples] = useState<CamerinoSample[]>([]);
  const [sampleTitle, setSampleTitle] = useState("");
  const [sampleUrl, setSampleUrl] = useState("");
  const [sampleType, setSampleType] =
    useState<CamerinoSample["sample_type"]>("video");
  const [selectedFriendId, setSelectedFriendId] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [status, setStatus] = useState("");
  const [verificationNotice, setVerificationNotice] = useState("");
  const [showExistingEmailActions, setShowExistingEmailActions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const isCamerinoPage = mode === "camerino";

  const userId = session?.user.id ?? "";
  const missingSupabaseConfig = !supabase;
  const displayedStatus =
    status ||
    (missingSupabaseConfig
      ? "Faltan las variables NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
      : "");
  const myProfile = directory.find((profile) => profile.user_id === userId);
  const friends = directory.filter((profile) => profile.friend_status === "friends");
  const activeFriendId = selectedFriendId || friends[0]?.user_id || "";
  const selectedFriend = friends.find((profile) => profile.user_id === activeFriendId);
  const visibleMessages = messages.filter(
    (message) =>
      activeFriendId &&
      ((message.sender_id === userId && message.receiver_id === activeFriendId) ||
        (message.sender_id === activeFriendId && message.receiver_id === userId)),
  );

  const loadCamerino = useCallback(async (currentUserId: string) => {
    if (!supabase) {
      setStatus("Falta configurar Supabase para cargar el camerino.");
      return;
    }

    const [
      profilesResponse,
      performersResponse,
      followsResponse,
      requestsResponse,
      messagesResponse,
      samplesResponse,
      userResponse,
    ] = await Promise.all([
      supabase
        .from("profiles")
        .select(
          "user_id, name, username, photo_url, country, city, date_of_birth, gender, bio, talent_type, age_range, camerino_theme",
        )
        .order("created_at", { ascending: false }),
      supabase
        .from("performer_profiles")
        .select(
          "user_id, stage_name, genre, experience_level, social_links, demo_video_url",
        ),
      supabase.from("follows").select("follower_id, following_id"),
      supabase
        .from("friend_requests")
        .select("id, requester_id, addressee_id, status"),
      supabase
        .from("messages")
        .select("id, sender_id, receiver_id, body, created_at")
        .order("created_at", { ascending: true }),
      supabase
        .from("camerino_samples")
        .select("id, user_id, title, url, sample_type")
        .order("created_at", { ascending: false }),
      supabase.from("users").select("role").eq("id", currentUserId).maybeSingle(),
    ]);

    if (profilesResponse.error) {
      setStatus(profilesResponse.error.message);
      return;
    }

    const performerByUser = new Map(
      (performersResponse.data ?? []).map((performer) => [
        performer.user_id,
        performer,
      ]),
    );
    const follows = followsResponse.data ?? [];
    const friendRequests = (requestsResponse.data ?? []) as FriendRequest[];

    const nextDirectory: DirectoryProfile[] = (profilesResponse.data ?? []).map((profile) => {
      const performer = performerByUser.get(profile.user_id);
      const request = friendRequests.find(
        (item) =>
          (item.requester_id === currentUserId &&
            item.addressee_id === profile.user_id) ||
          (item.requester_id === profile.user_id &&
            item.addressee_id === currentUserId),
      );
      const followerCount = follows.filter(
        (follow) => follow.following_id === profile.user_id,
      ).length;
      const isFollowing = follows.some(
        (follow) =>
          follow.follower_id === currentUserId &&
          follow.following_id === profile.user_id,
      );
      const friendStatus: DirectoryProfile["friend_status"] =
        request?.status === "accepted"
          ? "friends"
          : request?.status === "pending" &&
              request.addressee_id === currentUserId
            ? "received"
            : request?.status;

      return {
        ...profile,
        stage_name: performer?.stage_name ?? null,
        genre: performer?.genre ?? null,
        camerino_theme: profile.camerino_theme ?? "gold",
        follower_count: followerCount,
        is_following: isFollowing,
        friend_status: friendStatus,
      };
    });

    setDirectory(nextDirectory);
    setRequests(friendRequests);
    setMessages((messagesResponse.data ?? []) as Message[]);
    setSamples((samplesResponse.data ?? []) as CamerinoSample[]);
    setRole(userResponse.data?.role === "audience" ? "audience" : "performer");

    const currentProfile = nextDirectory.find(
      (profile) => profile.user_id === currentUserId,
    );
    const currentPerformer = performerByUser.get(currentUserId);

    if (currentProfile) {
      const birthParts = splitDateOfBirth(currentProfile.date_of_birth);

      setForm({
        name: currentProfile.name ?? "",
        username: currentProfile.username ?? "",
        photo_url: currentProfile.photo_url ?? "",
        country: currentProfile.country ?? "",
        city: currentProfile.city ?? "",
        birth_year: birthParts.birth_year,
        birth_month: birthParts.birth_month,
        birth_day: birthParts.birth_day,
        gender: currentProfile.gender ?? "",
        bio: currentProfile.bio ?? "",
        talent_type: currentProfile.talent_type ?? "",
        age_range: currentProfile.age_range ?? "",
        stage_name: currentPerformer?.stage_name ?? "",
        genre: currentPerformer?.genre ?? "",
        experience_level: currentPerformer?.experience_level ?? "",
        social_links: serializeSocialLinks(currentPerformer?.social_links),
        demo_video_url: currentPerformer?.demo_video_url ?? "",
        camerino_theme: currentProfile.camerino_theme ?? "gold",
      });
    }
  }, [supabase]);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const handleEmailCallback = async () => {
      if (typeof window === "undefined") return;

      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const verified = url.searchParams.get("verified");
      const errorDescription =
        url.searchParams.get("error_description") ||
        url.searchParams.get("error");

      if (errorDescription) {
        setStatus(errorDescription);
        window.history.replaceState({}, "", window.location.pathname);
        return;
      }

      if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          setStatus(error.message);
          return;
        }

        const nextSession = data.session;

        if (nextSession) {
          setSession(nextSession);
          setVerificationNotice(
            "Gracias por verificar tu correo. Ya puedes terminar tu perfil y entrar a tu camerino.",
          );
          const pendingProfile = window.localStorage.getItem(
            pendingProfileStorageKey,
          );

          if (pendingProfile) {
            try {
              const parsed = JSON.parse(pendingProfile) as {
                email?: string;
                form?: ProfileForm;
              };

              if (parsed.email === nextSession.user.email && parsed.form) {
                setForm(parsed.form);
              }
            } catch {
              window.localStorage.removeItem(pendingProfileStorageKey);
            }
          }

          void loadCamerino(nextSession.user.id);
        }

        window.history.replaceState({}, "", window.location.pathname);
        return;
      }

      if (verified) {
        setVerificationNotice(
          "Gracias por verificar tu correo. Inicia sesion para abrir tu camerino.",
        );
        window.history.replaceState({}, "", window.location.pathname);
      }
    };

    void handleEmailCallback();

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) {
        void loadCamerino(data.session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession) {
        void loadCamerino(nextSession.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadCamerino, supabase]);

  function updateForm(field: keyof ProfileForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: field === "username" ? normalizeUsername(value) : value,
    }));
  }

  async function saveCamerinoTheme(nextTheme: string) {
    if (!supabase || !userId) {
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ camerino_theme: nextTheme || "gold" })
      .eq("user_id", userId);

    if (error) {
      setStatus(error.message);
    }
  }

  function updateCamerinoForm(
    field: "camerino_theme" | "stage_name",
    value: string,
  ) {
    updateForm(field, value);

    if (field === "camerino_theme") {
      void saveCamerinoTheme(value);
    }
  }

  async function saveCamerinoBasics() {
    if (!supabase) {
      setStatus("Falta configurar Supabase para guardar el camerino.");
      return;
    }

    if (!userId) {
      setStatus("Inicia sesion para guardar tu camerino.");
      return;
    }

    const nextTheme = form.camerino_theme || "gold";
    const nextStageName = form.stage_name.trim();

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ camerino_theme: nextTheme })
      .eq("user_id", userId);

    if (profileError) {
      throw profileError;
    }

    if (nextStageName) {
      const { error: userError } = await supabase
        .from("users")
        .update({ role: "performer" })
        .eq("id", userId);

      if (userError) {
        throw userError;
      }

      const { error: performerError } = await supabase
        .from("performer_profiles")
        .upsert({
          user_id: userId,
          stage_name: nextStageName,
          genre: form.genre.trim() || form.talent_type || null,
          experience_level: form.experience_level.trim() || null,
          social_links: parseSocialLinks(form.social_links),
          demo_video_url: form.demo_video_url.trim() || null,
        });

      if (performerError) {
        throw performerError;
      }
    }

    setRole(nextStageName ? "performer" : role);
    await loadCamerino(userId);
  }

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0] ?? null;

    if (nextFile && nextFile.size > maxProfilePhotoSize) {
      setStatus("La foto debe pesar 2 MB o menos por ahora.");
      event.target.value = "";
      setPhotoFile(null);
      return;
    }

    setStatus("");
    setPhotoFile(nextFile);
  }

  async function uploadProfilePhoto(currentUserId: string) {
    if (!supabase) {
      throw new Error("Falta configurar Supabase para subir fotos.");
    }

    if (!photoFile) {
      return form.photo_url.trim();
    }

    const path = getPhotoPath(currentUserId, photoFile);
    const { error } = await supabase.storage
      .from("profile-photos")
      .upload(path, photoFile, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage.from("profile-photos").getPublicUrl(path);
    setPhotoFile(null);

    return data.publicUrl;
  }

  async function handleAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    setShowExistingEmailActions(false);
    setIsSaving(true);

    try {
      const authModeForRequest = isCamerinoPage ? "signin" : authMode;

      if (!supabase) {
        throw new Error("Falta configurar Supabase para registrar usuarios.");
      }

      if (authModeForRequest === "signup" && !isCamerinoPage) {
        const validationMessage = validateRequiredProfileFields(
          form,
          Boolean(photoFile || form.photo_url),
        );

        if (validationMessage) {
          throw new Error(validationMessage);
        }
      }

      const emailRedirectTo = getEmailRedirectTo();
      const auth =
        authModeForRequest === "signup"
          ? await supabase.auth.signUp({
              email,
              password,
              options: {
                data: { role: "audience" },
                emailRedirectTo,
              },
            })
          : await supabase.auth.signInWithPassword({ email, password });

      if (auth.error) {
        throw auth.error;
      }

      const nextSession = auth.data.session;

      if (!nextSession) {
        if (authModeForRequest === "signup" && typeof window !== "undefined") {
          window.localStorage.setItem(
            pendingProfileStorageKey,
            JSON.stringify({ email, form }),
          );
        }

        setVerificationNotice(
          "Gracias por registrarte. Te enviamos un correo de verificacion; abre el enlace para activar tu camerino.",
        );
        setStatus(
          "Si no lo ves, revisa spam o promociones. El enlace debe regresar a esta pagina.",
        );
        return;
      }

      setSession(nextSession);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(pendingProfileStorageKey);
      }

      if (authModeForRequest === "signin") {
        setStatus("Entrando a tu camerino.");
        window.location.assign("/camerino");
        return;
      }

      await saveProfile(
        nextSession.user.id,
        nextSession.user.email ?? email,
        form.stage_name.trim() ? "performer" : "audience",
      );
      setStatus("Listo. Tu perfil ya esta en el camerino.");
      if (typeof window !== "undefined") {
        window.location.assign("/camerino");
      }
    } catch (error) {
      if (isAlreadyRegisteredError(error)) {
        setShowExistingEmailActions(true);
        setStatus(
          "Ese correo ya existe en Supabase. Puede ser un registro pendiente de verificacion; revisa tu correo o reenvia el enlace.",
        );
      } else if (isSignupDisabledError(error)) {
        setStatus(
          "Los registros estan desactivados en Supabase. Activa Email signups en Authentication para permitir nuevas cuentas.",
        );
      } else {
        setStatus(error instanceof Error ? error.message : "No se pudo registrar.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  async function resendVerificationEmail() {
    if (!supabase) {
      setStatus("Falta configurar Supabase para reenviar el correo.");
      return;
    }

    if (!email.trim()) {
      setStatus("Escribe tu correo para reenviar la verificacion.");
      return;
    }

    setIsSaving(true);
    setStatus("");

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email.trim(),
      options: {
        emailRedirectTo: getEmailRedirectTo(),
      },
    });

    setIsSaving(false);

    if (error) {
      setStatus(error.message);
      return;
    }

    setVerificationNotice(
      "Te reenviamos el correo de verificacion. Abre el enlace para activar tu camerino.",
    );
    setStatus("Revisa inbox, spam o promociones.");
  }

  async function saveProfile(
    currentUserId = userId,
    currentEmail = email,
    profileRole = role,
  ) {
    if (!supabase) {
      setStatus("Falta configurar Supabase para guardar el perfil.");
      return;
    }

    if (!currentUserId) {
      setStatus("Inicia sesion para guardar tu perfil.");
      return;
    }

    const username =
      normalizeUsername(form.username) ||
      createInternalUsername(form.stage_name || form.name, currentUserId);
    const dateOfBirth = getDateOfBirth(form);
    const validationMessage = validateRequiredProfileFields(
      form,
      Boolean(photoFile || form.photo_url),
    );

    if (validationMessage) {
      setStatus(validationMessage);
      return;
    }

    const photoUrl = await uploadProfilePhoto(currentUserId);

    const nextProfileRole: Role = form.stage_name.trim() ? "performer" : profileRole;

    const { error: userError } = await supabase
      .from("users")
      .update({ role: nextProfileRole })
      .eq("id", currentUserId);

    if (userError) {
      throw userError;
    }

    const { error: profileError } = await supabase.from("profiles").upsert({
      user_id: currentUserId,
      name: form.name.trim(),
      username,
      photo_url: photoUrl || null,
      country: form.country.trim() || null,
      city: form.city.trim() || null,
      date_of_birth: dateOfBirth,
      gender: form.gender || null,
      bio: form.bio.trim() || null,
      talent_type: form.talent_type || null,
      age_range: getAgeRange(dateOfBirth) || null,
      camerino_theme: form.camerino_theme || "gold",
    });

    if (profileError) {
      throw profileError;
    }

    if (nextProfileRole === "performer") {
      const { error: performerError } = await supabase
        .from("performer_profiles")
        .upsert({
          user_id: currentUserId,
          stage_name: form.stage_name.trim() || form.name.trim(),
          genre: form.genre.trim() || form.talent_type || null,
          experience_level: form.experience_level.trim() || null,
          social_links: parseSocialLinks(form.social_links),
          demo_video_url: form.demo_video_url.trim() || null,
        });

      if (performerError) {
        throw performerError;
      }
    }

    if (currentEmail) {
      setEmail(currentEmail);
    }

    setForm((current) => ({
      ...current,
      photo_url: photoUrl,
    }));
    await loadCamerino(currentUserId);
  }

  async function handleProfileSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    setIsSaving(true);

    try {
      await saveProfile();
      setStatus("Perfil actualizado.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "No se pudo guardar.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleCamerinoSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    setIsSaving(true);

    try {
      await saveCamerinoBasics();
      setStatus("Camerino actualizado.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "No se pudo guardar.");
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleFollow(profile: DirectoryProfile) {
    if (!supabase) return;
    if (!userId || profile.user_id === userId) return;

    const request = profile.is_following
      ? supabase
          .from("follows")
          .delete()
          .eq("follower_id", userId)
          .eq("following_id", profile.user_id)
      : supabase
          .from("follows")
          .insert({ follower_id: userId, following_id: profile.user_id });

    const { error } = await request;

    if (error) {
      setStatus(error.message);
      return;
    }

    await loadCamerino(userId);
  }

  async function requestFriend(profile: DirectoryProfile) {
    if (!supabase) return;
    if (!userId || profile.user_id === userId) return;

    const existingRequest = requests.find(
      (request) =>
        (request.requester_id === userId &&
          request.addressee_id === profile.user_id) ||
        (request.requester_id === profile.user_id &&
          request.addressee_id === userId),
    );

    if (existingRequest?.addressee_id === userId) {
      const { error } = await supabase
        .from("friend_requests")
        .update({ status: "accepted" })
        .eq("id", existingRequest.id);

      if (error) {
        setStatus(error.message);
        return;
      }
    } else if (!existingRequest) {
      const { error } = await supabase.from("friend_requests").insert({
        requester_id: userId,
        addressee_id: profile.user_id,
      });

      if (error) {
        setStatus(error.message);
        return;
      }
    }

    await loadCamerino(userId);
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;

    const receiverId = selectedFriendId || friends[0]?.user_id || "";

    if (!userId || !receiverId || !messageBody.trim()) return;

    const { error } = await supabase.from("messages").insert({
      sender_id: userId,
      receiver_id: receiverId,
      body: messageBody.trim(),
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    setMessageBody("");
    await loadCamerino(userId);
  }

  async function addSample(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;

    if (!userId || !sampleTitle.trim() || !sampleUrl.trim()) {
      setStatus("Agrega titulo y URL para publicar una muestra.");
      return;
    }

    const { error } = await supabase.from("camerino_samples").insert({
      user_id: userId,
      title: sampleTitle.trim(),
      url: sampleUrl.trim(),
      sample_type: sampleType,
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    setSampleTitle("");
    setSampleUrl("");
    setSampleType("video");
    await loadCamerino(userId);
  }

  async function deleteSample(sampleId: string) {
    if (!supabase) return;
    if (!userId) return;

    const { error } = await supabase
      .from("camerino_samples")
      .delete()
      .eq("id", sampleId)
      .eq("user_id", userId);

    if (error) {
      setStatus(error.message);
      return;
    }

    await loadCamerino(userId);
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(null);
    setForm(emptyForm);
    setPhotoFile(null);
    setSamples([]);
    setRole("audience");
    setVerificationNotice("");
    setIsEditingProfile(false);
    setStatus("Sesion cerrada.");
  }

  return (
    <section
      id={isCamerinoPage ? "camerino" : "registro"}
      className={`relative px-4 text-white ${
        isCamerinoPage ? "py-8 md:py-10" : "py-16 md:py-24"
      }`}
    >
      <div className="pointer-events-none absolute inset-x-8 top-10 h-56 rounded-full bg-[radial-gradient(circle_at_28%_45%,rgba(34,211,238,0.1),transparent_48%),radial-gradient(circle_at_70%_45%,rgba(236,72,153,0.08),transparent_52%),radial-gradient(circle_at_50%_70%,rgba(250,204,21,0.1),transparent_62%)] blur-[22px]" />

      <div
        className={`relative mx-auto grid max-w-7xl gap-8 ${
          isCamerinoPage && session
            ? "grid-cols-1"
            : "lg:grid-cols-[0.85fr_1.15fr]"
        }`}
      >
        {(!isCamerinoPage || !session) ? (
          <div>
            <p className="mb-4 text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
              {isCamerinoPage ? "Mi Perfil" : "Participa 2026"}
            </p>
            <h1 className="bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 bg-clip-text text-4xl font-black uppercase leading-none text-transparent md:text-6xl">
              {isCamerinoPage
                ? "Entra a tu camerino"
                : "Crea tu perfil y entra a tu camerino"}
            </h1>
            <p className="mt-5 text-lg font-medium leading-8 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.18)]">
              {isCamerinoPage
                ? "Inicia sesion para ver tu espacio personal, editar tu estilo y mostrar tus mejores muestras."
                : "El registro es para todos: audiencia, fans y futuros artistas. Una vez dentro, desde Mi Perfil puedes activar tu alta de artista para participar en canciones, debuts y el escenario live."}
            </p>
          </div>
        ) : null}

        <div
          className={`text-left ${
            isCamerinoPage && session
              ? ""
              : "rounded-[24px] border border-white/[0.16] bg-white/[0.035] p-5 shadow-[0_0_18px_rgba(250,204,21,0.11),inset_0_1px_0_rgba(255,255,255,0.18)] md:p-8"
          }`}
        >
          {!session ? (
            <form onSubmit={handleAuth}>
              {isCamerinoPage ? (
                <div className="mb-5 rounded-[22px] border border-cyan-300/20 bg-cyan-300/10 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
                    Acceso privado
                  </p>
                  <p className="mt-2 text-sm font-bold leading-6 text-white/68">
                    Usa el correo y contraseña de tu cuenta para abrir tu
                    camerino.
                  </p>
                </div>
              ) : (
                <div className="mb-5 grid grid-cols-2 rounded-full border border-white/15 bg-black/30 p-1">
                  <button
                    className={`rounded-full px-4 py-3 text-sm font-black uppercase tracking-[0.12em] transition ${
                      authMode === "signup"
                        ? "bg-white text-slate-950"
                        : "text-white/70"
                    }`}
                    type="button"
                    onClick={() => setAuthMode("signup")}
                  >
                    Registro
                  </button>
                  <button
                    className={`rounded-full px-4 py-3 text-sm font-black uppercase tracking-[0.12em] transition ${
                      authMode === "signin"
                        ? "bg-white text-slate-950"
                        : "text-white/70"
                    }`}
                    type="button"
                    onClick={() => setAuthMode("signin")}
                  >
                    Entrar
                  </button>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  className="input"
                  autoComplete="email"
                  name="email"
                  placeholder="Correo electronico"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setShowExistingEmailActions(false);
                  }}
                  required
                />
                <label className="relative block">
                  <input
                    className="input w-full pr-28"
                    autoComplete={
                      authMode === "signup" ? "new-password" : "current-password"
                    }
                    minLength={8}
                    name="password"
                    pattern="(?=.*[A-Za-z])(?=.*[0-9]).{8,}"
                    placeholder="Contrasena segura"
                    title="Usa minimo 8 caracteres con letras y numeros."
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-cyan-100"
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                  >
                    {showPassword ? "Ocultar" : "Ver"}
                  </button>
                </label>
              </div>

              {authMode === "signup" && !isCamerinoPage ? (
                isCamerinoPage ? null : (
                  <ProfileEditor
                    form={form}
                    isSaving={isSaving}
                    onPhotoChange={handlePhotoChange}
                    photoFile={photoFile}
                    role={role}
                    setRole={setRole}
                    showArtistRegistration={false}
                    updateForm={updateForm}
                  />
                )
              ) : null}

              <button className="gold-button mt-5 w-full" disabled={isSaving}>
                {isSaving
                  ? "Guardando..."
                  : authMode === "signup" && !isCamerinoPage
                    ? "Crear mi perfil"
                    : "Entrar a mi camerino"}
              </button>
            </form>
          ) : (
            <div className="grid gap-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                    Sesion activa
                  </p>
                  <h2 className="mt-1 text-2xl font-black">
                    {myProfile?.stage_name || myProfile?.name || "Tu camerino"}
                  </h2>
                </div>
                {!isCamerinoPage ? (
                <div className="flex flex-wrap gap-2">
                  <button
                    className="secondary-button px-5 py-3"
                    type="button"
                    onClick={() => setIsEditingProfile((current) => !current)}
                  >
                    {isEditingProfile ? "Cerrar edición" : "Editar mi perfil"}
                  </button>
                  <button className="secondary-button px-5 py-3" onClick={signOut}>
                    Salir
                  </button>
                </div>
                ) : null}
              </div>

              <CamerinoProfile
                addSample={addSample}
                deleteSample={deleteSample}
                form={form}
                isSaving={isSaving}
                onPhotoChange={handlePhotoChange}
                onSave={handleCamerinoSave}
                photoFile={photoFile}
                sampleTitle={sampleTitle}
                sampleType={sampleType}
                sampleUrl={sampleUrl}
                samples={samples.filter((sample) => sample.user_id === userId)}
                setSampleTitle={setSampleTitle}
                setSampleType={setSampleType}
                setSampleUrl={setSampleUrl}
                updateForm={updateCamerinoForm}
              />

              {isEditingProfile && !isCamerinoPage ? (
                <form
                  className="rounded-[24px] border border-white/[0.14] bg-black/24 p-4 md:p-5"
                  onSubmit={handleProfileSave}
                >
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
                    Editar datos
                  </p>
                  <ProfileEditor
                    form={form}
                    isSaving={isSaving}
                    onPhotoChange={handlePhotoChange}
                    photoFile={photoFile}
                    role={role}
                    setRole={setRole}
                    showArtistRegistration
                    updateForm={updateForm}
                  />
                  <button className="gold-button mt-5 w-full" disabled={isSaving}>
                    {isSaving ? "Guardando..." : "Guardar perfil"}
                  </button>
                </form>
              ) : null}
            </div>
          )}

          {verificationNotice ? (
            <div className="mt-4 rounded-[22px] border border-yellow-300/35 bg-yellow-300/12 p-4 shadow-[0_0_24px_rgba(250,204,21,0.12)]">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-200">
                Gracias
              </p>
              <p className="mt-2 text-sm font-bold leading-6 text-yellow-50">
                {verificationNotice}
              </p>
            </div>
          ) : null}

          {displayedStatus ? (
            <p className="mt-4 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm font-bold text-cyan-100">
              {displayedStatus}
            </p>
          ) : null}

          {!session && showExistingEmailActions ? (
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                className="secondary-button px-5 py-3"
                disabled={isSaving}
                type="button"
                onClick={resendVerificationEmail}
              >
                Reenviar verificacion
              </button>
              <button
                className="secondary-button px-5 py-3"
                disabled={isSaving}
                type="button"
                onClick={() => {
                  setAuthMode("signin");
                  setStatus("Prueba entrar con ese correo y tu contrasena.");
                }}
              >
                Entrar con este correo
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {session ? (
        <div className="relative mx-auto mt-10 grid max-w-7xl gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <ArtistDirectory
            currentUserId={userId}
            profiles={directory}
            requestFriend={requestFriend}
            toggleFollow={toggleFollow}
          />
          <MessagesPanel
            friends={friends}
            messageBody={messageBody}
            messages={visibleMessages}
            selectedFriend={selectedFriend}
            selectedFriendId={activeFriendId}
            sendMessage={sendMessage}
            setMessageBody={setMessageBody}
            setSelectedFriendId={setSelectedFriendId}
            userId={userId}
          />
        </div>
      ) : null}
    </section>
  );
}

function ProfileEditor({
  form,
  isSaving,
  onPhotoChange,
  photoFile,
  role,
  setRole,
  showArtistRegistration,
  updateForm,
}: {
  form: ProfileForm;
  isSaving: boolean;
  onPhotoChange: (event: ChangeEvent<HTMLInputElement>) => void;
  photoFile: File | null;
  role: Role;
  setRole: (role: Role) => void;
  showArtistRegistration: boolean;
  updateForm: (field: keyof ProfileForm, value: string) => void;
}) {
  return (
    <div className="mt-5 grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <input
          className="input"
          placeholder="Nombre completo"
          value={form.name}
          onChange={(event) => updateForm("name", event.target.value)}
          required
        />
        <input
          className="input"
          placeholder="Nombre artistico"
          value={form.stage_name}
          onChange={(event) => updateForm("stage_name", event.target.value)}
          required
        />
        <select
          className="input"
          value={form.country}
          onChange={(event) => updateForm("country", event.target.value)}
          required
        >
          <option value="">País</option>
          {countryOptions.map((country) => (
            <option key={country}>{country}</option>
          ))}
        </select>
        <input
          className="input"
          placeholder="Ciudad"
          value={form.city}
          onChange={(event) => updateForm("city", event.target.value)}
          required
        />
      </div>

      <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.06] p-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
              Tu cumple
            </p>
            <p className="mt-1 text-sm font-bold text-white/60">
              Fecha de nacimiento 
            </p>
          </div>
          {getDateOfBirth(form) ? (
            <span className="rounded-full border border-yellow-300/30 bg-yellow-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-yellow-100">
              {getAgeRange(getDateOfBirth(form))}
            </span>
          ) : null}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <select
            className="input"
            value={form.birth_day}
            onChange={(event) => updateForm("birth_day", event.target.value)}
            required
          >
            <option value="">Día</option>
            {birthDays.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <select
            className="input"
            value={form.birth_month}
            onChange={(event) => updateForm("birth_month", event.target.value)}
            required
          >
            <option value="">Mes</option>
            {monthOptions.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          <select
            className="input"
            value={form.birth_year}
            onChange={(event) => updateForm("birth_year", event.target.value)}
            required
          >
            <option value="">Año</option>
            {birthYears.map((year) => (
              <option key={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      <select
        className="input"
        value={form.gender}
        onChange={(event) => updateForm("gender", event.target.value)}
        required
      >
        <option value="">Género</option>
        {genderOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <label className="grid gap-2 rounded-2xl border border-white/15 bg-black/25 p-4">
        <span className="text-xs font-black uppercase tracking-[0.16em] text-cyan-200">
          Foto de perfil
        </span>
        <input
          accept="image/*"
          className="input"
          disabled={isSaving}
          required={!form.photo_url}
          type="file"
          onChange={onPhotoChange}
        />
        <span className="text-xs font-bold text-white/55">
          {photoFile
            ? photoFile.name
            : form.photo_url
              ? "Foto actual guardada"
              : "Sube una imagen desde tu computadora o movil. Máximo 2 MB."}
        </span>
      </label>

      <select
        className="input"
        value={form.talent_type}
        onChange={(event) => updateForm("talent_type", event.target.value)}
        required
      >
        <option value="">Selecciona tu categoria</option>
        {talentOptions.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>

      {showArtistRegistration && role === "audience" ? (
        <div className="rounded-2xl border border-yellow-300/25 bg-yellow-300/10 p-4">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-yellow-200">
            Alta de artista
          </p>
          <p className="mt-2 text-sm leading-6 text-white/68">
            Tu perfil ya puede existir como audiencia. Activa esta opcion solo
            si quieres competir, subir demos o participar en turnos del escenario.
          </p>
          <button
            className="gold-button-small mt-4"
            disabled={isSaving}
            type="button"
            onClick={() => setRole("performer")}
          >
            Darme de alta como artista
          </button>
        </div>
      ) : null}

      {role === "performer" ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-yellow-300/25 bg-yellow-300/10 p-4 md:col-span-2">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-yellow-200">
              Perfil de artista activo
            </p>
            <p className="mt-2 text-sm leading-6 text-white/68">
              Estos datos apareceran como tu perfil artistico dentro de la
              comunidad y las audiciones.
            </p>
          </div>
          <input
            className="input"
            placeholder="Genero o estilo"
            value={form.genre}
            onChange={(event) => updateForm("genre", event.target.value)}
          />
          <input
            className="input"
            placeholder="Nivel de experiencia"
            value={form.experience_level}
            onChange={(event) =>
              updateForm("experience_level", event.target.value)
            }
          />
          <input
            className="input"
            placeholder="Demo video URL"
            value={form.demo_video_url}
            onChange={(event) => updateForm("demo_video_url", event.target.value)}
          />
          <input
            className="input md:col-span-2"
            placeholder="Links sociales separados por coma"
            value={form.social_links}
            onChange={(event) => updateForm("social_links", event.target.value)}
          />
        </div>
      ) : null}

      <textarea
        className="input min-h-32 resize-y"
        placeholder="Bio corta para tu camerino"
        value={form.bio}
        onChange={(event) => updateForm("bio", event.target.value)}
        required
      />
    </div>
  );
}

function ArtistDirectory({
  currentUserId,
  profiles,
  requestFriend,
  toggleFollow,
}: {
  currentUserId: string;
  profiles: DirectoryProfile[];
  requestFriend: (profile: DirectoryProfile) => void;
  toggleFollow: (profile: DirectoryProfile) => void;
}) {
  const publicProfiles = profiles.filter(
    (profile) => profile.user_id !== currentUserId,
  );

  return (
    <div className="rounded-[24px] border border-white/[0.16] bg-white/[0.035] p-5 shadow-[0_0_18px_rgba(250,204,21,0.11),inset_0_1px_0_rgba(255,255,255,0.18)] md:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-pink-300">
            Comunidad
          </p>
          <h2 className="mt-1 text-2xl font-black">Artistas y perfiles</h2>
        </div>
        <p className="text-sm font-bold text-white/62">
          {publicProfiles.length} perfiles visibles
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {publicProfiles.length ? (
          publicProfiles.map((profile) => (
            <article
              className="rounded-[18px] border border-white/12 bg-black/28 p-4"
              key={profile.user_id}
            >
              <div className="flex gap-3">
                <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full border border-cyan-300/30 bg-cyan-300/10 text-lg font-black text-cyan-100">
                  {profile.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt=""
                      className="h-full w-full object-cover"
                      src={profile.photo_url}
                    />
                  ) : (
                    profile.name.slice(0, 1)
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-black">
                    {profile.stage_name || profile.name}
                  </h3>
                  <p className="truncate text-sm font-bold text-cyan-200">
                    @{profile.username}
                  </p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-white/45">
                    {profile.genre || profile.talent_type || "Talento libre"}
                  </p>
                </div>
              </div>

              <p className="mt-3 line-clamp-3 min-h-16 text-sm leading-6 text-white/68">
                {profile.bio || "Este perfil esta preparando su debut."}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  className="gold-button-small"
                  type="button"
                  onClick={() => toggleFollow(profile)}
                >
                  {profile.is_following ? "Siguiendo" : "Seguir"}
                </button>
                <button
                  className="secondary-button px-4 py-2 text-sm"
                  disabled={
                    profile.friend_status === "pending" ||
                    profile.friend_status === "friends"
                  }
                  type="button"
                  onClick={() => requestFriend(profile)}
                >
                  {profile.friend_status === "friends"
                    ? "Amigos"
                    : profile.friend_status === "received"
                      ? "Aceptar"
                      : profile.friend_status === "pending"
                        ? "Enviada"
                        : "Agregar"}
                </button>
                <span className="text-xs font-black uppercase tracking-[0.12em] text-white/45">
                  {profile.follower_count} seguidores
                </span>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[18px] border border-white/12 bg-black/28 p-5 text-sm font-bold text-white/62 md:col-span-2">
            Aun no hay otros perfiles. Cuando mas artistas se registren,
            apareceran aqui para seguirlos y agregarlos.
          </div>
        )}
      </div>
    </div>
  );
}

function MessagesPanel({
  friends,
  messageBody,
  messages,
  selectedFriend,
  selectedFriendId,
  sendMessage,
  setMessageBody,
  setSelectedFriendId,
  userId,
}: {
  friends: DirectoryProfile[];
  messageBody: string;
  messages: Message[];
  selectedFriend?: DirectoryProfile;
  selectedFriendId: string;
  sendMessage: (event: FormEvent<HTMLFormElement>) => void;
  setMessageBody: (value: string) => void;
  setSelectedFriendId: (value: string) => void;
  userId: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/[0.16] bg-white/[0.035] p-5 shadow-[0_0_18px_rgba(250,204,21,0.11),inset_0_1px_0_rgba(255,255,255,0.18)] md:p-6">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-300">
        Mensajes
      </p>
      <h2 className="mt-1 text-2xl font-black">Camerino privado</h2>

      {friends.length ? (
        <div className="mt-5 grid gap-4">
          <select
            className="input"
            value={selectedFriendId}
            onChange={(event) => setSelectedFriendId(event.target.value)}
          >
            {friends.map((friend) => (
              <option key={friend.user_id} value={friend.user_id}>
                {friend.stage_name || friend.name}
              </option>
            ))}
          </select>

          <div className="min-h-72 rounded-[18px] border border-white/12 bg-black/30 p-4">
            <div className="mb-4 border-b border-white/10 pb-3">
              <p className="text-sm font-black text-cyan-100">
                {selectedFriend?.stage_name || selectedFriend?.name}
              </p>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/42">
                Solo amigos aceptados pueden escribir
              </p>
            </div>

            <div className="grid max-h-64 gap-3 overflow-y-auto pr-1">
              {messages.length ? (
                messages.map((message) => {
                  const isMine = message.sender_id === userId;

                  return (
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                        isMine
                          ? "ml-8 bg-cyan-300/16 text-cyan-50"
                          : "mr-8 bg-white/10 text-white/78"
                      }`}
                      key={message.id}
                    >
                      {message.body}
                    </div>
                  );
                })
              ) : (
                <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-bold text-white/55">
                  Todavia no hay mensajes con este artista.
                </p>
              )}
            </div>
          </div>

          <form className="flex gap-3" onSubmit={sendMessage}>
            <input
              className="input"
              placeholder="Escribe un mensaje"
              value={messageBody}
              onChange={(event) => setMessageBody(event.target.value)}
            />
            <button className="gold-button px-5" type="submit">
              Enviar
            </button>
          </form>
        </div>
      ) : (
        <div className="mt-5 rounded-[18px] border border-white/12 bg-black/28 p-5 text-sm font-bold leading-6 text-white/62">
          Agrega artistas como amigos para abrir conversaciones privadas en tu
          camerino.
        </div>
      )}
    </div>
  );
}
