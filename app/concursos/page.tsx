import FeaturedContests from "@/components/FeaturedContests";
import HowItWorks from "@/components/HowItWorks";

export default function ConcursosPage() {
  return (
    <main className="page-shell">
      <FeaturedContests fullPage />
      <HowItWorks />
    </main>
  );
}
