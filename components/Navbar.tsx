"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useJoinedNavigation } from "@/lib/useJoinedNavigation";
import {
  createSupabaseBrowserClient,
  hasSupabaseBrowserConfig,
} from "@/lib/supabase/client";

export default function Navbar() {
  const router = useRouter();
  const { isJoined, links } = useJoinedNavigation();

  async function handleSignOut() {
    if (hasSupabaseBrowserConfig()) {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
    }

    router.push("/");
    router.refresh();
  }

  return (
    <header className="fixed left-0 top-0 z-50 w-full px-4 pt-4">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-[28px] border border-white/15 bg-white/[0.025] px-5 py-3 shadow-[0_0_38px_rgba(34,211,238,0.14),0_0_52px_rgba(250,204,21,0.1),inset_0_1px_0_rgba(255,255,255,0.16)] sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-12 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/[0.015] shadow-[0_0_24px_rgba(34,211,238,0.2),0_0_34px_rgba(250,204,21,0.14),inset_0_1px_0_rgba(255,255,255,0.18)] transition group-hover:scale-105 group-hover:shadow-[0_0_34px_rgba(34,211,238,0.38),0_0_48px_rgba(236,72,153,0.26)]">
            <span className="bg-gradient-to-br from-white via-cyan-300 to-yellow-300 bg-clip-text pr-1 text-2xl font-black tracking-[-0.12em] text-transparent drop-shadow-[0_0_12px_rgba(34,211,238,0.55)]">
              ET
            </span>
          </div>

          <div className="hidden leading-tight sm:block">
            <p className="bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 bg-clip-text text-sm font-black uppercase tracking-[0.2em] text-transparent">
              Encuentro
            </p>
            <p className="bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 bg-clip-text text-sm font-black uppercase tracking-[0.25em] text-transparent">
              de Talentos
            </p>
          </div>
        </Link>

        <div className="hidden min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto px-3 text-xs font-black uppercase tracking-[0.1em] text-cyan-300 md:flex xl:gap-2 xl:tracking-[0.14em]">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="shrink-0 rounded-full border border-transparent px-2 py-2 transition drop-shadow-[0_0_6px_rgba(34,211,238,0.24)] hover:border-cyan-300/20 hover:bg-cyan-300/[0.035] hover:text-cyan-100 hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.55)] hover:shadow-[0_0_24px_rgba(34,211,238,0.2)] lg:px-3"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {isJoined ? (
          <button
            className="rounded-full border border-white/25 bg-[linear-gradient(180deg,rgba(255,255,255,0.32),transparent_46%),linear-gradient(90deg,#22d3ee,#ec4899,#facc15)] px-5 py-2 text-sm font-black uppercase tracking-widest text-white shadow-[0_0_30px_rgba(34,211,238,0.3),0_0_38px_rgba(250,204,21,0.25),inset_0_1px_0_rgba(255,255,255,0.45)] transition hover:scale-105 hover:shadow-[0_0_42px_rgba(34,211,238,0.62),0_0_58px_rgba(236,72,153,0.36),0_14px_34px_rgba(250,204,21,0.22)]"
            type="button"
            onClick={handleSignOut}
          >
            Salir
          </button>
        ) : (
          <Link
            href="/registro"
            className="rounded-full border border-white/25 bg-[linear-gradient(180deg,rgba(255,255,255,0.32),transparent_46%),linear-gradient(90deg,#22d3ee,#ec4899,#facc15)] px-5 py-2 text-sm font-black uppercase tracking-widest text-white shadow-[0_0_30px_rgba(34,211,238,0.3),0_0_38px_rgba(250,204,21,0.25),inset_0_1px_0_rgba(255,255,255,0.45)] transition hover:scale-105 hover:shadow-[0_0_42px_rgba(34,211,238,0.62),0_0_58px_rgba(236,72,153,0.36),0_14px_34px_rgba(250,204,21,0.22)]"
          >
            Unirme
          </Link>
        )}
      </nav>
    </header>
  );
}
