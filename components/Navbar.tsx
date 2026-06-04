import Link from "next/link";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/concursos", label: "Concursos" },
  { href: "/participar", label: "Participar" },
  { href: "/mentores", label: "Mentores" },
];

export default function Navbar() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-cyan-300/20 bg-[#020617]/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-12 w-16 items-center justify-center rounded-xl border border-cyan-300/50 bg-gradient-to-br from-cyan-400 via-blue-700 to-orange-400 shadow-[0_0_25px_rgba(34,211,238,0.45)] transition group-hover:scale-105 group-hover:shadow-[0_0_35px_rgba(251,191,36,0.6)]">
            <span className="text-2xl font-black italic tracking-tighter text-white drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]">
              ET
            </span>
          </div>

          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-white">
              Encuentro
            </p>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-yellow-300">
              de Talentos
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-semibold uppercase tracking-[0.18em] text-white/80 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-yellow-300 hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="/participar"
          className="rounded-full border border-yellow-300/60 bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500 px-5 py-2 text-sm font-black uppercase tracking-widest text-black shadow-[0_0_25px_rgba(251,191,36,0.5)] transition hover:scale-105"
        >
          Unirme
        </Link>
      </nav>
    </header>
  );
}