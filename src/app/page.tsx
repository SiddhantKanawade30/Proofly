import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import SocialProofSection from "@/components/landing/SocialProofSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import DashboardPreviewSection from "@/components/landing/DashboardPreviewSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import UseCasesSection from "@/components/landing/UseCasesSection";
import PricingSection from "@/components/landing/PricingSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="bg-background-light text-text-main antialiased selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <main className="flex flex-col">
        <HeroSection />
        <HowItWorksSection />
        <DashboardPreviewSection />
        <FeaturesSection />
        <UseCasesSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
