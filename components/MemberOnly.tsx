"use client";

import Link from "next/link";
import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  createSupabaseBrowserClient,
  hasSupabaseBrowserConfig,
} from "@/lib/supabase/client";

export default function MemberOnly({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  const supabase = useMemo(
    () => (hasSupabaseBrowserConfig() ? createSupabaseBrowserClient() : null),
    [],
  );
  const [hasSession, setHasSession] = useState(false);
  const [isReady, setIsReady] = useState(() => !hasSupabaseBrowserConfig());

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let isActive = true;

    supabase.auth.getSession().then(({ data }) => {
      if (isActive) {
        setHasSession(Boolean(data.session));
        setIsReady(true);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setHasSession(Boolean(session));
      setIsReady(true);
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  if (!isReady) {
    return (
      <section className="et-showcase-section px-4 py-16 text-white">
        <div className="mx-auto max-w-3xl rounded-[24px] border border-white/[0.16] bg-white/[0.035] p-6 text-center">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
            Cargando {title}
          </p>
        </div>
      </section>
    );
  }

  if (!hasSession) {
    return (
      <section className="et-showcase-section px-4 py-16 text-white md:py-24">
        <div className="mx-auto max-w-3xl rounded-[24px] border border-white/[0.16] bg-white/[0.035] p-6 text-center shadow-[0_0_18px_rgba(250,204,21,0.11),inset_0_1px_0_rgba(255,255,255,0.18)] md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
            Encuentro de Talentos
          </p>
          <h1 className="mt-4 bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 bg-clip-text text-4xl font-black uppercase leading-none text-transparent md:text-6xl">
            {title}
          </h1>
          <p className="mt-5 text-lg font-bold leading-8 text-cyan-300">
            Esta área se activa cuando entras con tu cuenta.
          </p>
          <Link className="gold-button mt-7 w-full md:w-auto" href="/registro">
            Entrar o registrarme
          </Link>
        </div>
      </section>
    );
  }

  return <>{children}</>;
}
