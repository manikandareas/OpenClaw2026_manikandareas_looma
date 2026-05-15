import { BottomCtaSection } from "@/features/marketing/components/bottom-cta-section";
import { IntegrationHarnessSection } from "@/features/marketing/components/integration-harness-section";
import { LandingDemoSection } from "@/features/marketing/components/landing-demo-section";
import { LandingFooter } from "@/features/marketing/components/landing-footer";
import { LandingHeader } from "@/features/marketing/components/landing-header";
import { LandingHeroSection } from "@/features/marketing/components/landing-hero-section";
import { WorkflowSection } from "@/features/marketing/components/workflow-section";

/**
 * Marketing home composition: route (`app/page.tsx`) stays thin; layout and
 * copy live in feature-scoped components under `features/marketing/components/`.
 */
export function LandingPage() {
  return (
    <main className="min-h-screen bg-[#FDFCFC] text-black">
      <LandingHeader />
      <LandingHeroSection />
      <IntegrationHarnessSection />
      <LandingDemoSection />
      <WorkflowSection />
      <BottomCtaSection />
      <LandingFooter />
    </main>
  );
}
