"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Escenario from "@/components/escenario";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

type StandaloneNavigator = Navigator & {
  standalone?: boolean;
};

const androidPackageUrl =
  process.env.NEXT_PUBLIC_ANDROID_PACKAGE_URL ||
  "/downloads/encuentro-de-talentos.apk";
const iosPackageUrl = process.env.NEXT_PUBLIC_IOS_PACKAGE_URL || "#ios-install";

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

export default function AppOnlyEscenario() {
  const [isApp, setIsApp] = useState(false);
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    function handleDisplayModeChange() {
      setIsApp(isStandaloneApp());
    }

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    }

    const standaloneQuery = window.matchMedia("(display-mode: standalone)");
    const animationFrame = window.requestAnimationFrame(handleDisplayModeChange);

    standaloneQuery.addEventListener("change", handleDisplayModeChange);
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      standaloneQuery.removeEventListener("change", handleDisplayModeChange);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  async function installApp() {
    if (androidPackageUrl) {
      window.location.href = androidPackageUrl;
      return;
    }

    if (!installPrompt) {
      return;
    }

    await installPrompt.prompt();
    await installPrompt.userChoice.catch(() => undefined);
    setInstallPrompt(null);
  }

  if (isApp) {
    return <Escenario />;
  }

  return (
    <main className="min-h-screen px-4 py-28 text-white">
      <section className="mx-auto grid min-h-[calc(100vh-9rem)] max-w-6xl items-center gap-8 md:grid-cols-[0.95fr_1.05fr]">
        <div className="order-2 md:order-1">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
            Escenario live ET
          </p>
          <h1 className="mt-4 text-5xl font-black uppercase leading-[0.9] text-white sm:text-7xl">
            Download app
          </h1>
          <p className="mt-5 max-w-xl text-lg font-bold leading-8 text-cyan-100">
            Para entrar al escenario live, instala Encuentro de Talentos en tu
            pantalla de inicio y abre esta seccion desde la app.
          </p>

          <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
            {installPrompt ? (
              <button
                className="rounded-full border border-white/25 bg-[linear-gradient(180deg,rgba(255,255,255,0.32),transparent_46%),linear-gradient(90deg,#22d3ee,#ec4899,#facc15)] px-6 py-3 text-center text-sm font-black uppercase tracking-widest text-white shadow-[0_0_34px_rgba(34,211,238,0.3),0_0_42px_rgba(250,204,21,0.22),inset_0_1px_0_rgba(255,255,255,0.45)] transition hover:scale-105"
                type="button"
                onClick={installApp}
              >
                Download Android
              </button>
            ) : (
              <a
                className="rounded-full border border-white/25 bg-[linear-gradient(180deg,rgba(255,255,255,0.32),transparent_46%),linear-gradient(90deg,#22d3ee,#ec4899,#facc15)] px-6 py-3 text-center text-sm font-black uppercase tracking-widest text-white no-underline shadow-[0_0_34px_rgba(34,211,238,0.3),0_0_42px_rgba(250,204,21,0.22),inset_0_1px_0_rgba(255,255,255,0.45)] transition hover:scale-105"
                href={androidPackageUrl}
                download={androidPackageUrl.startsWith("/") ? true : undefined}
              >
                Download Android
              </a>
            )}
            <a
              className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-6 py-3 text-center text-sm font-black uppercase tracking-widest text-cyan-100 no-underline transition hover:border-cyan-200/60 hover:bg-cyan-300/15"
              href={iosPackageUrl}
            >
              Download iOS
            </a>
          </div>

          <div
            id="ios-install"
            className="mt-5 max-w-xl rounded-[20px] border border-white/15 bg-white/[0.045] p-4 text-sm font-bold leading-7 text-cyan-100"
          >
            <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-200">
              iPhone / iPad
            </p>
            <p className="mt-2">
              Abre esta pagina en Safari, toca Compartir y elige Agregar a pantalla
              de inicio.
            </p>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <div className="relative mx-auto aspect-square w-full max-w-[520px] overflow-hidden rounded-[28px] border border-white/15 bg-black shadow-[0_0_60px_rgba(34,211,238,0.18),0_0_80px_rgba(236,72,153,0.16)]">
            <Image
              src="/et-portada.png"
              alt="Encuentro de Talentos app"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 92vw, 520px"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
