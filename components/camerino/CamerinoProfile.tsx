"use client";

import { ChangeEvent, FormEvent, ReactNode, useEffect, useMemo, useState } from "react";

type CamerinoSample = {
  id: string;
  user_id: string;
  title: string;
  url: string;
  sample_type: "audio" | "video" | "image" | "link";
};

type CamerinoForm = {
  name: string;
  username: string;
  photo_url: string;
  country: string;
  city: string;
  bio: string;
  talent_type: string;
  stage_name: string;
  genre: string;
  demo_video_url: string;
  camerino_theme: string;
};

type CamerinoEditableField = keyof CamerinoForm;

type Props = {
  addSample: (event: FormEvent<HTMLFormElement>) => void;
  deleteSample: (sampleId: string) => void;
  form: CamerinoForm;
  isEditing: boolean;
  isSaving: boolean;
  onPhotoChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSave: (event: FormEvent<HTMLFormElement>) => void;
  photoFile: File | null;
  sampleTitle: string;
  sampleType: CamerinoSample["sample_type"];
  sampleUrl: string;
  samples: CamerinoSample[];
  setSampleTitle: (value: string) => void;
  setSampleType: (value: CamerinoSample["sample_type"]) => void;
  setSampleUrl: (value: string) => void;
  updateForm: (field: CamerinoEditableField, value: string) => void;
  followersCount?: number;
  friendsCount?: number;
  onMessageClick?: () => void;
};

const themes = [
  {
    value: "gold",
    label: "Galaxia Dorada",
    accent: "#FFD700",
    glow: "rgba(255,215,0,.55)",
    bg: "radial-gradient(circle at 18% 18%,rgba(255,215,0,.24),transparent 28%),radial-gradient(circle at 82% 22%,rgba(236,72,153,.18),transparent 30%),linear-gradient(135deg,#050505,#111827 55%,#140a00)",
  },
  {
    value: "cyan",
    label: "Órbita Cósmica",
    accent: "#22d3ee",
    glow: "rgba(34,211,238,.55)",
    bg: "radial-gradient(circle at 15% 20%,rgba(34,211,238,.26),transparent 28%),radial-gradient(circle at 85% 25%,rgba(255,145,0,.22),transparent 30%),linear-gradient(135deg,#020617,#050505 55%,#1a0618)",
  },
  {
    value: "pink",
    label: "Premiere Pop",
    accent: "#ec4899",
    glow: "rgba(236,72,153,.55)",
    bg: "radial-gradient(circle at 20% 20%,rgba(236,72,153,.26),transparent 28%),radial-gradient(circle at 85% 20%,rgba(255,215,0,.18),transparent 30%),linear-gradient(135deg,#160014,#050505 55%,#111827)",
  },
  {
    value: "violet",
    label: "Royal Talent",
    accent: "#a855f7",
    glow: "rgba(168,85,247,.55)",
    bg: "radial-gradient(circle at 20% 20%,rgba(168,85,247,.26),transparent 28%),radial-gradient(circle at 85% 20%,rgba(255,215,0,.18),transparent 30%),linear-gradient(135deg,#090011,#050505 55%,#101827)",
  },
  {
    value: "emerald",
    label: "Emerald Live",
    accent: "#34d399",
    glow: "rgba(52,211,153,.55)",
    bg: "radial-gradient(circle at 20% 20%,rgba(52,211,153,.24),transparent 28%),radial-gradient(circle at 85% 20%,rgba(34,211,238,.18),transparent 30%),linear-gradient(135deg,#001711,#050505 55%,#111827)",
  },
];

const designs = [
  "Órbita Estelar",
  "Escenario Galaxy",
  "Premiere Gold",
  "Neón Cósmico",
];

const sampleTypes = [
  { value: "video", label: "Video" },
  { value: "audio", label: "Audio" },
  { value: "image", label: "Imagen" },
  { value: "link", label: "Link" },
] as const;

const allowedThemeValues = ["gold", "cyan", "pink", "violet", "emerald"];

export default function CamerinoProfile({
  addSample,
  deleteSample,
  form,
  isEditing,
  isSaving,
  onPhotoChange,
  onSave,
  photoFile,
  sampleTitle,
  sampleType,
  sampleUrl,
  samples,
  setSampleTitle,
  setSampleType,
  setSampleUrl,
  updateForm,
  followersCount = 0,
  friendsCount = 0,
  onMessageClick,
}: Props) {
  const [design, setDesign] = useState(designs[0]);
  const photoPreviewUrl = useMemo(
    () => (photoFile ? URL.createObjectURL(photoFile) : ""),
    [photoFile],
  );

  const safeTheme = allowedThemeValues.includes(form.camerino_theme)
    ? form.camerino_theme
    : "gold";

  const theme = themes.find((item) => item.value === safeTheme) ?? themes[0];

  const displayName = form.stage_name || form.name || "Mi Camerino";
  const username = form.username || "usuario";
  const location = [form.city, form.country].filter(Boolean).join(", ");
  const visiblePhotoUrl = photoPreviewUrl || form.photo_url;

  useEffect(() => {
    return () => {
      if (photoPreviewUrl) {
        URL.revokeObjectURL(photoPreviewUrl);
      }
    };
  }, [photoPreviewUrl]);

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <section className="rounded-[36px] border border-white/10 bg-[#050505] p-3 text-white shadow-[0_40px_120px_rgba(0,0,0,.75)]">
      <article className="overflow-hidden rounded-[30px] border border-yellow-300/15 bg-black">
        <div
          className="relative m-3 overflow-hidden rounded-[26px] border border-white/10 p-5 md:p-8"
          style={{ background: theme.bg }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[url('/et-portada.png')] bg-cover bg-center opacity-10" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/75" />

          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,.95)]" />
              <span className="text-xs font-black uppercase tracking-[.24em] text-white/55">
                Activo
              </span>
            </div>

            {form.demo_video_url ? (
              <a
                href={form.demo_video_url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full px-5 py-2.5 text-xs font-black uppercase tracking-[.16em] text-black transition hover:scale-105"
                style={{
                  background: theme.accent,
                  boxShadow: `0 0 30px ${theme.glow}`,
                }}
              >
                Demo
              </a>
            ) : null}
          </div>

          <div className="relative mt-8 grid gap-8 lg:grid-cols-[250px_1fr]">
            <aside className="grid justify-items-center gap-4">
              <div
                className="rounded-[34px] p-2.5"
                style={{
                  background: `linear-gradient(135deg,${theme.accent},#ffffff22,#ec4899)`,
                  boxShadow: `0 0 45px ${theme.glow}`,
                }}
              >
                <div className="h-48 w-48 overflow-hidden rounded-[28px] border border-black/50 bg-black p-2">
                  <div className="h-full w-full overflow-hidden rounded-[22px] bg-[#080808]">
                    {visiblePhotoUrl ? (
                      <div
                        aria-label={displayName}
                        className="h-full w-full object-cover"
                        role="img"
                        style={{
                          backgroundImage: `url(${visiblePhotoUrl})`,
                          backgroundPosition: "center",
                          backgroundSize: "cover",
                        }}
                      />
                    ) : (
                      <div
                        className="grid h-full place-items-center text-6xl font-black"
                        style={{ color: theme.accent }}
                      >
                        {initials || "ET"}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <p
                className="w-full rounded-full px-4 py-2 text-center text-xs font-black uppercase tracking-[.18em] text-black"
                style={{ background: theme.accent }}
              >
                {form.talent_type || "Talento"}
              </p>

              <div className="grid w-full grid-cols-3 gap-2">
                <Stat label="Fans" value={followersCount} />
                <Stat label="Amigos" value={friendsCount} />
                <Stat label="Shows" value={samples.length} />
              </div>

              <button
                type="button"
                onClick={onMessageClick}
                className="w-full rounded-full border border-cyan-200/25 bg-cyan-300/10 px-5 py-3 text-sm font-black uppercase tracking-[.14em] text-cyan-100 transition hover:bg-cyan-300/20"
              >
                Mensaje
              </button>
            </aside>

            <main className="flex flex-col justify-center">
              <p
                className="text-xs font-black uppercase tracking-[.36em]"
                style={{ color: theme.accent }}
              >
                Camerino oficial
              </p>

              <h1 className="mt-3 break-words text-5xl font-black uppercase leading-none md:text-7xl xl:text-8xl">
                {displayName}
              </h1>

              <p className="mt-4 text-sm font-black text-white/55">
                @{username}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <Chip theme={theme}>{form.genre || "Estilo propio"}</Chip>
                {location ? <Chip theme={theme}>{location}</Chip> : null}
                <Chip theme={theme}>{design}</Chip>
              </div>

              <p className="mt-7 max-w-4xl text-lg font-semibold leading-8 text-white/70">
                {form.bio ||
                  "Agrega tu biografía para mostrar tu historia, tu talento y tu energía en el escenario."}
              </p>
            </main>
          </div>
        </div>

        {isEditing ? (
          <form
            onSubmit={onSave}
            className="m-3 grid gap-4 rounded-[26px] border border-white/10 bg-white/[.045] p-5 md:grid-cols-2"
          >
            <Field title="Diseño">
              <select
                className="input"
                value={design}
                onChange={(event) => setDesign(event.target.value)}
              >
                {designs.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </Field>

            <Field title="Color">
              <select
                className="input"
                value={safeTheme}
                onChange={(event) =>
                  updateForm("camerino_theme", event.target.value)
                }
              >
                {themes.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field title="Nombre artístico">
              <input
                className="input"
                value={form.stage_name}
                placeholder="Nombre artístico"
                onChange={(event) =>
                  updateForm("stage_name", event.target.value)
                }
              />
            </Field>

            <Field title="Categoría pública">
              <input
                className="input"
                value={form.talent_type}
                placeholder="Canto, danza, actuación..."
                onChange={(event) =>
                  updateForm("talent_type", event.target.value)
                }
              />
            </Field>

            <Field title="Género o estilo">
              <input
                className="input"
                value={form.genre}
                placeholder="Balada, urbano, pop, regional..."
                onChange={(event) => updateForm("genre", event.target.value)}
              />
            </Field>

            <Field title="Foto de perfil">
              <input
                className="input"
                accept="image/*"
                disabled={isSaving}
                type="file"
                onChange={onPhotoChange}
              />
              <span className="text-xs font-bold text-white/40">
                {photoFile ? photoFile.name : "Máximo 3 MB"}
              </span>
            </Field>

            <Field title="Demo URL">
              <input
                className="input"
                value={form.demo_video_url}
                placeholder="https://..."
                type="url"
                onChange={(event) =>
                  updateForm("demo_video_url", event.target.value)
                }
              />
            </Field>

            <Field title="Biografía">
              <textarea
                className="input min-h-32 resize-y"
                value={form.bio}
                placeholder="Cuenta tu historia y qué quieres mostrar en ET."
                onChange={(event) => updateForm("bio", event.target.value)}
              />
            </Field>

            <button
              disabled={isSaving}
              className="gold-button text-sm md:col-span-2"
            >
              {isSaving ? "Guardando..." : "Guardar camerino"}
            </button>
          </form>
        ) : null}
      </article>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_360px]">
        <section className="rounded-[30px] border border-white/10 bg-black p-5">
          <h2
            className="text-sm font-black uppercase tracking-[.26em]"
            style={{ color: theme.accent }}
          >
            Muestras destacadas
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {samples.length ? (
              samples.map((sample, index) => (
                <article
                  key={sample.id}
                  className="overflow-hidden rounded-[24px] border border-white/10 bg-white/[.045] transition hover:-translate-y-1 hover:border-white/25"
                >
                  <div className="m-3 overflow-hidden rounded-[20px] border border-white/10">
                    <div
                      className="grid aspect-video place-items-center text-5xl font-black"
                      style={{
                        background: `radial-gradient(circle at 30% 20%,${theme.accent},transparent 32%),linear-gradient(135deg,#070707,#111827 55%,#ec4899)`,
                      }}
                    >
                      {index + 1}
                    </div>
                  </div>

                  <div className="p-4 pt-1">
                    <p className="text-xs font-black uppercase tracking-[.16em] text-white/40">
                      {sample.sample_type}
                    </p>

                    <h3 className="mt-1 truncate font-black uppercase">
                      {sample.title}
                    </h3>

                    <div className="mt-4 flex justify-between gap-2">
                      <a
                        href={sample.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase text-white/75"
                      >
                        Ver
                      </a>

                      <button
                        type="button"
                        onClick={() => deleteSample(sample.id)}
                        className="rounded-full border border-white/10 px-3 py-2 text-xs font-black uppercase text-white/45 hover:text-red-100"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[24px] border border-white/10 bg-white/[.04] p-5 text-sm font-bold text-white/55 md:col-span-3">
                Agrega videos, canciones, fotos, demos o links para construir tu show.
              </div>
            )}
          </div>
        </section>

        <aside className="rounded-[30px] border border-white/10 bg-black p-5">
          <h2
            className="text-sm font-black uppercase tracking-[.26em]"
            style={{ color: theme.accent }}
          >
            Nueva muestra
          </h2>

          <form onSubmit={addSample} className="mt-5 grid gap-3">
            <input
              className="input"
              placeholder="Título"
              value={sampleTitle}
              onChange={(event) => setSampleTitle(event.target.value)}
            />

            <input
              className="input"
              placeholder="URL"
              type="url"
              value={sampleUrl}
              onChange={(event) => setSampleUrl(event.target.value)}
            />

            <select
              className="input"
              value={sampleType}
              onChange={(event) =>
                setSampleType(event.target.value as CamerinoSample["sample_type"])
              }
            >
              {sampleTypes.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            <button
              className="gold-button text-sm"
            >
              Agregar
            </button>
          </form>
        </aside>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-[18px] border border-white/10 bg-white/[.05] p-3 text-center">
      <strong className="block text-xl font-black">{value}</strong>
      <span className="text-[10px] font-black uppercase tracking-[.12em] text-white/45">
        {label}
      </span>
    </div>
  );
}

function Chip({
  children,
  theme,
}: {
  children: ReactNode;
  theme: {
    accent: string;
  };
}) {
  return (
    <span
      className="rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[.13em]"
      style={{
        borderColor: `${theme.accent}66`,
        background: `${theme.accent}18`,
        color: theme.accent,
      }}
    >
      {children}
    </span>
  );
}

function Field({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase tracking-[.16em] text-white/45">
        {title}
      </span>
      {children}
    </label>
  );
}
