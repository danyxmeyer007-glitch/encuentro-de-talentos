import type { Metadata } from "next";
import Escenario from "@/components/escenario";

export const metadata: Metadata = {
  title: "Proximamente Voces Debut | Encuentro de Talentos",
  description:
    "Julio 15: escenario live de Encuentro de Talentos con performers y listeners en vivo.",
  alternates: {
    canonical: "/escenario",
  },
};

export default function EscenarioPage() {
  return <Escenario />;
}
