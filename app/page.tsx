import { Hero, Features, HowItWorks, CTASection } from "@/components/landing";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Features />
      <HowItWorks />
      <CTASection />
    </div>
  );
}
