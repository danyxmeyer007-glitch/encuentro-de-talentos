"use client";

import { ChangeEvent, FormEvent } from "react";

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

type CamerinoProfileProps = {
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
  updateForm: (field: "camerino_theme" | "stage_name", value: string) => void;
};

const themeOptions = [
  {
    value: "gold",
    label: "Dorado",
    glow: "rgba(250, 204, 21, 0.34)",
    gradient: "linear-gradient(135deg, #facc15, #fb7185, #22d3ee)",
    soft: "rgba(250, 204, 21, 0.14)",
  },
  {
    value: "cyan",
    label: "Neón",
    glow: "rgba(34, 211, 238, 0.34)",
    gradient: "linear-gradient(135deg, #22d3ee, #38bdf8, #ffffff)",
    soft: "rgba(34, 211, 238, 0.14)",
  },
  {
    value: "pink",
    label: "Pop",
    glow: "rgba(236, 72, 153, 0.36)",
    gradient: "linear-gradient(135deg, #ec4899, #f97316, #facc15)",
    soft: "rgba(236, 72, 153, 0.14)",
  },
  {
    value: "violet",
    label: "Violeta",
    glow: "rgba(168, 85, 247, 0.34)",
    gradient: "linear-gradient(135deg, #a855f7, #ec4899, #22d3ee)",
    soft: "rgba(168, 85, 247, 0.14)",
  },
  {
    value: "emerald",
    label: "Verde",
    glow: "rgba(52, 211, 153, 0.32)",
    gradient: "linear-gradient(135deg, #34d399, #22d3ee, #facc15)",
    soft: "rgba(52, 211, 153, 0.14)",
  },
];

const sampleTypeOptions = [
  { value: "video", label: "Video" },
  { value: "audio", label: "Audio" },
  { value: "image", label: "Imagen" },
  { value: "link", label: "Link" },
] as const;

function getSampleLabel(type: CamerinoSample["sample_type"]) {
  return sampleTypeOptions.find((option) => option.value === type)?.label ?? "Link";
}

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
}: CamerinoProfileProps) {
  const theme =
    themeOptions.find((option) => option.value === form.camerino_theme) ??
    themeOptions[0];
  const displayName = form.stage_name || form.name || "Mi Camerino";
  const location = [form.city, form.country].filter(Boolean).join(", ");

  return (
    <section className="overflow-hidden rounded-[28px] border border-white/15 bg-black/34 shadow-[0_0_38px_rgba(0,0,0,0.28)]">
      <div
        className="relative min-h-72 p-5 md:p-7"
        style={{
          background: `radial-gradient(circle at 18% 20%, ${theme.glow}, transparent 32%), radial-gradient(circle at 78% 18%, rgba(255,255,255,0.16), transparent 24%), linear-gradient(135deg, rgba(2,6,23,0.92), rgba(15,23,42,0.74))`,
        }}
      >
        <div className="absolute inset-x-0 top-0 h-1" style={{ background: theme.gradient }} />

        <div className="relative grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="flex gap-4">
            <div
              className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-[28px] border border-white/24 bg-black/30 text-3xl font-black shadow-[0_0_38px_rgba(255,255,255,0.12)]"
              style={{ boxShadow: `0 0 42px ${theme.glow}` }}
            >
              {form.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt=""
                  className="h-full w-full object-cover"
                  src={form.photo_url}
                />
              ) : (
                displayName.slice(0, 1)
              )}
            </div>

            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-white/62">
                Camerino personal
              </p>
              <h3 className="mt-2 break-words text-3xl font-black leading-none md:text-5xl">
                {displayName}
              </h3>
              <p className="mt-2 text-sm font-black text-cyan-100">
                @{form.username || "usuario"}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.12em] text-white/72">
                <span className="rounded-full border border-white/18 bg-white/10 px-3 py-2">
                  {form.talent_type || "Talento libre"}
                </span>
                <span className="rounded-full border border-white/18 bg-white/10 px-3 py-2">
                  {form.genre || "Estilo propio"}
                </span>
                {location ? (
                  <span className="rounded-full border border-white/18 bg-white/10 px-3 py-2">
                    {location}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="grid content-between gap-5">
            <p className="rounded-[22px] border border-white/14 bg-black/24 p-4 text-sm font-semibold leading-7 text-white/72">
              {form.bio ||
                "Este camerino esta listo para presentar canciones, demos, fotos, videos y momentos favoritos."}
            </p>

            {isEditing ? (
              <form
                className="grid gap-3 rounded-[22px] border border-white/14 bg-black/24 p-4"
                onSubmit={onSave}
              >
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-xs font-black uppercase tracking-[0.16em] text-white/58">
                      Nombre real
                    </span>
                    <span className="rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white/52">
                      {form.name || "Guardado en tu perfil"}
                    </span>
                  </label>
                  <label className="grid gap-2">
                    <span className="text-xs font-black uppercase tracking-[0.16em] text-white/58">
                      Nombre artístico
                    </span>
                    <input
                      className="input"
                      placeholder="Tu nombre de escenario"
                      value={form.stage_name}
                      onChange={(event) =>
                        updateForm("stage_name", event.target.value)
                      }
                    />
                  </label>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-xs font-black uppercase tracking-[0.16em] text-white/58">
                      Foto
                    </span>
                    <input
                      accept="image/*"
                      className="input"
                      disabled={isSaving}
                      type="file"
                      onChange={onPhotoChange}
                    />
                    <span className="text-xs font-bold text-white/45">
                      {photoFile ? photoFile.name : "Máximo 3 MB"}
                    </span>
                  </label>
                  <label className="grid gap-2">
                    <span className="text-xs font-black uppercase tracking-[0.16em] text-white/58">
                      Color del camerino
                    </span>
                    <select
                      className="input"
                      value={form.camerino_theme}
                      onChange={(event) =>
                        updateForm("camerino_theme", event.target.value)
                      }
                    >
                      {themeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <button
                  className="gold-button-small justify-self-start"
                  disabled={isSaving}
                >
                  {isSaving ? "Guardando..." : "Guardar camerino"}
                </button>
              </form>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-5 md:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
              Muestras destacadas
            </p>
            <h4 className="mt-1 text-2xl font-black">Mi trabajo</h4>
          </div>
          <span className="rounded-full border border-white/14 bg-white/8 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-white/55">
            {samples.length} muestras
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {samples.length ? (
            samples.map((sample) => (
              <article
                className="rounded-[18px] border border-white/12 bg-white/[0.045] p-4"
                key={sample.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-white/42">
                      {getSampleLabel(sample.sample_type)}
                    </p>
                    <h5 className="mt-1 truncate text-lg font-black">
                      {sample.title}
                    </h5>
                  </div>
                  <button
                    className="rounded-full border border-white/12 px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-white/52 transition hover:border-red-300/50 hover:text-red-100"
                    type="button"
                    onClick={() => deleteSample(sample.id)}
                  >
                    Quitar
                  </button>
                </div>
                <a
                  className="mt-4 inline-flex rounded-full border border-white/14 bg-black/24 px-4 py-2 text-sm font-black text-cyan-100 transition hover:border-cyan-200/50"
                  href={sample.url}
                  rel="noreferrer"
                  target="_blank"
                >
                  Ver muestra
                </a>
              </article>
            ))
          ) : (
            <div
              className="rounded-[18px] border border-white/12 p-5 text-sm font-bold leading-6 text-white/62 md:col-span-2"
              style={{ background: theme.soft }}
            >
              Agrega videos, canciones, fotos, demos o links para que tu
              camerino se sienta como tu espacio de artista.
            </div>
          )}
        </div>

        <form
          className="grid gap-3 rounded-[20px] border border-white/12 bg-black/24 p-4 md:grid-cols-[1fr_1fr_auto]"
          onSubmit={addSample}
        >
          <input
            className="input"
            placeholder="Titulo de la muestra"
            value={sampleTitle}
            onChange={(event) => setSampleTitle(event.target.value)}
          />
          <input
            className="input"
            placeholder="URL de video, audio, imagen o portafolio"
            type="url"
            value={sampleUrl}
            onChange={(event) => setSampleUrl(event.target.value)}
          />
          <div className="grid gap-3 sm:grid-cols-[1fr_auto] md:grid-cols-1">
            <select
              className="input"
              value={sampleType}
              onChange={(event) =>
                setSampleType(event.target.value as CamerinoSample["sample_type"])
              }
            >
              {sampleTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button className="gold-button-small" type="submit">
              Agregar
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
