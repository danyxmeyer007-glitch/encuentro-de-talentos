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
    <main className="et-showcase-section min-h-screen px-4 py-28 text-white">
      <section className="mx-auto grid min-h-[calc(100vh-9rem)] max-w-6xl items-center gap-8 md:grid-cols-[0.95fr_1.05fr]">
        <div className="order-2 md:order-1">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-yellow-300">
            Escenario exclusivo de la app
          </p>
          <h1 className="mt-4 text-5xl font-black uppercase leading-[0.9] text-white sm:text-7xl">
            Instala para abrir el escenario en vivo
          </h1>
          <p className="mt-5 max-w-xl text-lg font-bold leading-8 text-white/75">
            El sitio público mantiene disponibles descubrimiento, registro, legal,
            mentores y rankings. El escenario en vivo aparece dentro de la app
            instalada, donde se piden cámara y micrófono cuando corresponde.
          </p>

          <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
            {installPrompt ? (
              <button
                className="rounded-full border border-[#FFECA0]/60 bg-[#FFD700] px-6 py-3 text-center text-sm font-black uppercase tracking-widest text-[#111111] shadow-[0_0_34px_rgba(255,215,0,0.24),inset_0_1px_0_rgba(255,255,255,0.45)] transition hover:scale-105"
                type="button"
                onClick={installApp}
              >
                Descargar APK
              </button>
            ) : (
              <a
                className="rounded-full border border-[#FFECA0]/60 bg-[#FFD700] px-6 py-3 text-center text-sm font-black uppercase tracking-widest text-[#111111] no-underline shadow-[0_0_34px_rgba(255,215,0,0.24),inset_0_1px_0_rgba(255,255,255,0.45)] transition hover:scale-105"
                href={androidPackageUrl}
                download={androidPackageUrl.startsWith("/") ? true : undefined}
              >
                Descargar APK
              </a>
            )}
            <a
              className="rounded-full border border-white/15 bg-white/[0.06] px-6 py-3 text-center text-sm font-black uppercase tracking-widest text-white no-underline transition hover:border-[#FFD700]/55"
              href={iosPackageUrl}
            >
              Agregar a iOS
            </a>
          </div>

          <div
            id="ios-install"
            className="mt-5 max-w-xl rounded-[20px] border border-white/15 bg-white/[0.045] p-4 text-sm font-bold leading-7 text-white/70"
          >
            <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-200">
              iPhone / iPad
            </p>
            <p className="mt-2">
              Abre esta página en Safari, toca Compartir y elige Agregar a pantalla
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
