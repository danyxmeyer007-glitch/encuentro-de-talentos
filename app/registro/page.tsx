import HowItWorks from "@/components/HowItWorks";
import SignupSection from "@/components/SignupSection";

export default function RegistroPage() {
  return (
    <main className="page-shell">
      <SignupSection mode="registro" />
      <HowItWorks />
    </main>
  );
}
