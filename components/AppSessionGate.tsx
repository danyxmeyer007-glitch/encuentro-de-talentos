"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  createSupabaseBrowserClient,
  hasSupabaseBrowserConfig,
} from "@/lib/supabase/client";

const publicAppPaths = new Set(["/", "/registro", "/legal"]);

function isAndroidApp() {
  if (typeof navigator === "undefined") {
    return false;
  }

  return navigator.userAgent.includes("EncuentroTalentosAndroid");
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
  const [isReady, setIsReady] = useState(() => !isAndroidApp());

  useEffect(() => {
    if (!isAndroidApp() || !supabase) {
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

  if (!isReady && isAndroidApp()) {
    return (
      <div className="fixed inset-0 z-[80] grid place-items-center bg-[#020617] px-6 text-center text-white">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
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
