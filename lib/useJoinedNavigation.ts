import { useEffect, useMemo, useState } from "react";
import {
  createSupabaseBrowserClient,
  hasSupabaseBrowserConfig,
} from "@/lib/supabase/client";

export type NavigationLink = {
  href: string;
  label: string;
  orbitClass?: string;
  toneClass?: string;
};

export const publicNavigationLinks: NavigationLink[] = [
  { href: "/", label: "Inicio", orbitClass: "orbit-one", toneClass: "orbit-home" },
  {
    href: "/concursos",
    label: "Concursos",
    orbitClass: "orbit-two",
    toneClass: "orbit-contests",
  },
  {
    href: "/categorias",
    label: "Categorías",
    orbitClass: "orbit-three",
    toneClass: "orbit-categories",
  },
  { href: "/about", label: "Acerca", orbitClass: "orbit-four", toneClass: "orbit-about" },
];

export const joinedNavigationLinks: NavigationLink[] = [
  {
    href: "/camerino",
    label: "Camerino",
    orbitClass: "orbit-one",
    toneClass: "orbit-home",
  },
  {
    href: "/concursos",
    label: "Concursos",
    orbitClass: "orbit-two",
    toneClass: "orbit-contests",
  },
  {
    href: "/categorias",
    label: "Categorías",
    orbitClass: "orbit-three",
    toneClass: "orbit-categories",
  },
  {
    href: "/escenario",
    label: "Escenario",
    orbitClass: "orbit-four",
    toneClass: "orbit-participate",
  },
  {
    href: "/mentores",
    label: "Mentores",
    orbitClass: "orbit-five",
    toneClass: "orbit-mentors",
  },
  {
    href: "/salon-de-la-fama",
    label: "Salón",
    orbitClass: "orbit-six",
    toneClass: "orbit-categories",
  },
  {
    href: "/concursos#como-funciona",
    label: "Cómo funciona",
    orbitClass: "orbit-seven",
    toneClass: "orbit-about",
  },
  {
    href: "/about",
    label: "Acerca",
    orbitClass: "orbit-eight",
    toneClass: "orbit-about",
  },
];

export function useJoinedNavigation() {
  const supabase = useMemo(
    () => (hasSupabaseBrowserConfig() ? createSupabaseBrowserClient() : null),
    [],
  );
  const [isJoined, setIsJoined] = useState(false);

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

  return {
    isJoined,
    links: isJoined ? joinedNavigationLinks : publicNavigationLinks,
  };
}
