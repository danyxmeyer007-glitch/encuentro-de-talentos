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
            Experiencia live
          </p>
          <h1 className="mt-4 text-5xl font-black uppercase leading-[0.9] text-white sm:text-7xl">
            Download para entrar live
          </h1>

          <div className="mt-8 grid max-w-xl gap-3">
            {installPrompt ? (
              <button
                className="gold-button px-6 py-3 text-center text-sm"
                type="button"
                onClick={installApp}
              >
                Bajar APK Android
              </button>
            ) : (
              <a
                className="gold-button px-6 py-3 text-center text-sm no-underline"
                href={androidPackageUrl}
                download={androidPackageUrl.startsWith("/") ? true : undefined}
              >
                Bajar APK Android
              </a>
            )}
            <span
              className="secondary-button cursor-not-allowed px-6 py-3 text-center text-sm opacity-70"
              aria-disabled="true"
            >
              Apple próximamente
            </span>
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
