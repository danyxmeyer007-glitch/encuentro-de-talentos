import type { Metadata } from "next";
import AppOnlyEscenario from "@/components/AppOnlyEscenario";

export const metadata: Metadata = {
  title: "Download App | Escenario Live ET",
  description:
    "Instala la app Encuentro de Talentos para entrar al escenario live.",
  alternates: {
    canonical: "/escenario",
  },
};

export default function EscenarioPage() {
  return <AppOnlyEscenario />;
}
