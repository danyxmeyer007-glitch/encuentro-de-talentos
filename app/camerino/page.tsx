import { Suspense } from "react";
import SignupSection from "@/components/SignupSection";

export default function CamerinoPage() {
  return (
    <main className="page-shell">
      <Suspense fallback={<AuthFallback label="Cargando camerino..." />}>
        <SignupSection mode="camerino" />
      </Suspense>
    </main>
  );
}

function AuthFallback({ label }: { label: string }) {
  return (
    <section className="et-showcase-section px-4 py-16 text-white">
      <div className="mx-auto max-w-3xl rounded-[24px] border border-white/[0.16] bg-white/[0.035] p-6 text-center text-sm font-black uppercase tracking-[0.18em] text-cyan-300">
        {label}
      </div>
    </section>
  );
}
