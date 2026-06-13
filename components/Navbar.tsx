"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  createSupabaseBrowserClient,
  hasSupabaseBrowserConfig,
} from "@/lib/supabase/client";

type StandaloneNavigator = Navigator & {
  standalone?: boolean;
};

const websiteTopLinks = [
  { href: "/camerino", label: "Camerino" },
  { href: "/concursos", label: "Concursos" },
  { href: "/mentores", label: "Mentores" },
  { href: "/salon-de-la-fama", label: "Salón" },
  { href: "/legal", label: "Legal" },
];

const appTopLinks = [
  { href: "/camerino", label: "Camerino" },
  { href: "/concursos", label: "Concursos" },
  { href: "/escenario", label: "Escenario" },
  { href: "/mentores", label: "Mentores" },
  { href: "/salon-de-la-fama", label: "Salón" },
];

const websiteBottomLinks = [
  { href: "/salon-de-la-fama", label: "Salón", icon: "★" },
  { href: "/camerino", label: "Perfil", icon: "◐" },
  { href: "/concursos", label: "Concursos", icon: "+" },
  { href: "/salon-de-la-fama#rankings", label: "Ranking", icon: "≡" },
  { href: "/legal", label: "Legal", icon: "§" },
];

const appBottomLinks = [
  { href: "/salon-de-la-fama", label: "Salón", icon: "★" },
  { href: "/camerino", label: "Perfil", icon: "◐" },
  { href: "/concursos", label: "Concursos", icon: "+" },
  { href: "/escenario", label: "Escenario", icon: "▶" },
  { href: "/salon-de-la-fama#rankings", label: "Ranking", icon: "≡" },
];

function isStandaloneApp() {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    window.navigator.userAgent.includes("EncuentroTalentosAndroid") ||
    (window.navigator as StandaloneNavigator).standalone === true
  );
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = useMemo(
    () => (hasSupabaseBrowserConfig() ? createSupabaseBrowserClient() : null),
    [],
  );
  const [isJoined, setIsJoined] = useState(false);
  const [isApp, setIsApp] = useState(false);

  useEffect(() => {
    function syncDisplayMode() {
      setIsApp(isStandaloneApp());
    }

    const standaloneQuery = window.matchMedia("(display-mode: standalone)");

    syncDisplayMode();
    standaloneQuery.addEventListener("change", syncDisplayMode);

    return () => {
      standaloneQuery.removeEventListener("change", syncDisplayMode);
    };
  }, []);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let isActive = true;

    supabase.auth.getSession().then(({ data }) => {
      if (isActive) {
        setIsJoined(Boolean(data.session));
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsJoined(Boolean(session));
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleSignOut() {
    if (supabase) {
      await supabase.auth.signOut();
    }

    router.push("/");
    router.refresh();
  }

  const topLinks = isApp ? appTopLinks : websiteTopLinks;
  const bottomLinks = isApp ? appBottomLinks : websiteBottomLinks;

  return (
    <>
      <header className="fixed left-0 top-0 z-50 w-full px-3 pt-3">
        <nav className="mx-auto flex max-w-7xl items-center gap-3 rounded-lg border border-[#FFD700]/25 bg-[#050505]/88 px-3 py-2 shadow-[0_18px_60px_rgba(0,0,0,0.38),0_0_34px_rgba(255,215,0,0.18)] backdrop-blur-xl">
          <Link href="/" className="group flex shrink-0 items-center gap-2 no-underline">
            <span className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-lg border border-[#FFD700]/45 bg-black shadow-[0_0_22px_rgba(255,215,0,0.26)]">
              <Image
                src="/et-simple.png"
                alt="Encuentro de Talentos"
                fill
                sizes="44px"
                className="object-cover"
                priority
              />
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block text-xs font-black uppercase tracking-[0.18em] text-white">
                Encuentro
              </span>
              <span className="block text-xs font-black uppercase tracking-[0.18em] text-[#FFD700]">
                de Talentos
              </span>
            </span>
          </Link>

          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Buscar</span>
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#FFD700]">
              ⌕
            </span>
            <input
              className="h-11 w-full rounded-full border border-white/10 bg-white/[0.06] pl-9 pr-3 text-sm font-bold text-white outline-none transition placeholder:text-white/40 focus:border-[#FFD700]/60 focus:shadow-[0_0_20px_rgba(255,215,0,0.18)]"
              placeholder="Buscar talentos, audiciones o mentores"
              type="search"
            />
          </label>

          <div className="hidden items-center gap-1 lg:flex">
            {topLinks.map((link) => (
              <Link
                className="rounded-full px-3 py-2 text-xs font-black uppercase tracking-[0.1em] text-white/72 no-underline transition hover:bg-white/[0.06] hover:text-white"
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {isJoined ? (
            <button
              className="et-primary-button hidden items-center justify-center px-4 py-2 text-xs md:inline-flex"
              type="button"
              onClick={handleSignOut}
            >
              Salir
            </button>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                className="et-primary-button inline-flex items-center justify-center px-4 py-2 text-xs no-underline"
                href="/registro"
              >
                Entrar
              </Link>
              <Link
                className="et-primary-button inline-flex items-center justify-center px-4 py-2 text-xs no-underline"
                href="/registro"
              >
                Registrarme
              </Link>
            </div>
          )}
        </nav>
      </header>

      <nav
        aria-label="Bottom navigation"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#111111]/94 px-2 pb-[max(0.55rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-18px_50px_rgba(0,0,0,0.42)] backdrop-blur-xl md:hidden"
      >
        <div className="mx-auto grid max-w-md grid-cols-5 items-end gap-1">
          {bottomLinks.map((link) => {
            const hasHash = link.href.includes("#");
            const active = !hasHash && pathname === link.href;
            const isCenter = link.href === "/concursos";

            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={
                  isCenter
                    ? "grid -translate-y-4 place-items-center gap-1 text-center text-[0.62rem] font-black uppercase tracking-[0.05em] text-[#FFD700] no-underline"
                    : "grid place-items-center gap-1 text-center text-[0.62rem] font-black uppercase tracking-[0.04em] text-white/66 no-underline"
                }
                href={link.href}
                key={link.href}
              >
                <span
                  className={
                    isCenter
                      ? "grid h-14 w-14 place-items-center rounded-full border border-[#FFECA0]/70 bg-[#FFD700] text-3xl text-[#111111] shadow-[0_0_28px_rgba(255,215,0,0.42)]"
                      : `grid h-8 w-8 place-items-center rounded-full border text-base ${
                          active
                            ? "border-[#FFD700]/60 bg-[#FFD700]/12 text-[#FFD700]"
                            : "border-white/10 bg-white/[0.04] text-white/72"
                        }`
                  }
                >
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
