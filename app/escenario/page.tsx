import type { Metadata } from "next";
import AppOnlyEscenario from "@/components/AppOnlyEscenario";

export const metadata: Metadata = {
  title: "Escenario | Encuentro de Talentos",
  description:
    "Instala Encuentro de Talentos para ver audiciones, concursos, rankings y escenario en vivo.",
  alternates: {
    canonical: "/escenario",
  },
};

export default function EscenarioPage() {
  return <AppOnlyEscenario />;
}
