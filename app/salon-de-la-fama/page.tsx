import { Suspense } from "react";
import CommunityET from "@/components/CommunityET";
import MemberOnly from "@/components/MemberOnly";
import StarProject from "@/components/StarProject";

export default function SalonDeLaFamaPage() {
  return (
    <main className="page-shell">
      <MemberOnly title="Salón de la Fama">
        <StarProject />
        <Suspense
          fallback={
            <section className="et-showcase-section px-4 py-12 text-white">
              <div className="mx-auto max-w-7xl rounded-[24px] border border-white/15 bg-white/[0.035] p-5 text-sm font-black uppercase tracking-[0.18em] text-cyan-300">
                Cargando comunidad ET...
              </div>
            </section>
          }
        >
          <CommunityET />
        </Suspense>
      </MemberOnly>
    </main>
  );
}
