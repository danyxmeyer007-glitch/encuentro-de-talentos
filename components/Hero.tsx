import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-end justify-start overflow-hidden px-6 pb-20 pt-28 md:px-16 md:pb-24"
    >
      <div className="relative z-10 max-w-md text-left">
        <div className="mb-4 inline-flex rounded-full border border-cyan-300/30 bg-black/45 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-100 backdrop-blur-md">
          🌌 Talento creativo
        </div>

        <h1 className="mb-4 text-3xl font-black leading-tight text-white drop-shadow-[0_0_18px_rgba(0,0,0,0.9)] md:text-5xl">
          Tu talento.
          <br />
          Tu momento.
          <br />
          Tu historia.
        </h1>

        <p className="mb-7 max-w-sm text-base font-medium text-white/85 drop-shadow-[0_0_10px_rgba(0,0,0,0.9)] md:text-lg">
          Participa en concursos, recibe apoyo de mentores y gana premios.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/participar"
            className="rounded-full bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500 px-6 py-3 text-sm font-black uppercase tracking-widest text-black shadow-[0_0_25px_rgba(251,191,36,0.55)] transition hover:scale-105"
          >
            🚀 Participar
          </Link>

          <Link
            href="/concursos"
            className="rounded-full border border-cyan-300/40 bg-black/35 px-6 py-3 text-sm font-black uppercase tracking-widest text-white backdrop-blur-md transition hover:border-yellow-300/70 hover:text-yellow-300"
          >
            Ver concursos
          </Link>
        </div>
      </div>
    </section>
  );
}