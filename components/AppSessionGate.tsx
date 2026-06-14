"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  createSupabaseBrowserClient,
  hasSupabaseBrowserConfig,
} from "@/lib/supabase/client";

const publicAppPaths = new Set(["/registro"]);

type StandaloneNavigator = Navigator & {
  standalone?: boolean;
};

function isInstalledApp() {
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

function isPublicAppPath(pathname: string) {
  return (
    publicAppPaths.has(pathname) ||
    pathname.startsWith("/manifest") ||
    pathname.startsWith("/downloads/")
  );
}

function isAuthCallback(pathname: string) {
  if (typeof window === "undefined") {
    return false;
  }

  return pathname === "/camerino" && window.location.search.includes("code=");
}

export default function AppSessionGate() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = useMemo(
    () => (hasSupabaseBrowserConfig() ? createSupabaseBrowserClient() : null),
    [],
  );
  const [isReady, setIsReady] = useState(() => !isInstalledApp());

  useEffect(() => {
    if (!isInstalledApp() || !supabase) {
      return;
    }

    let isActive = true;
    const client = supabase;

    async function protectRoute() {
      const { data } = await client.auth.getSession();

      if (!isActive) {
        return;
      }

      const hasSession = Boolean(data.session);

      if (!hasSession && !isPublicAppPath(pathname) && !isAuthCallback(pathname)) {
        router.replace("/registro?app=1");
        return;
      }

      setIsReady(true);
    }

    void protectRoute();

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      if (
        !session &&
        !isPublicAppPath(window.location.pathname) &&
        !isAuthCallback(window.location.pathname)
      ) {
        router.replace("/registro?app=1");
      }
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, [pathname, router, supabase]);

  if (!isReady && isInstalledApp()) {
    return (
      <div className="fixed inset-0 z-[80] grid place-items-center overflow-hidden bg-[#111111] px-6 text-center text-white">
        <video
          src="/videos/ETportada.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#FFD700]">
            Encuentro de Talentos
          </p>
          <p className="mt-3 text-lg font-black uppercase text-yellow-200">
            Preparando tu app
          </p>
        </div>
      </div>
    );
  }

  return null;
}
