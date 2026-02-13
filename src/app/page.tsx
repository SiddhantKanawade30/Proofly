import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import DashboardPreviewSection from "@/components/landing/DashboardPreviewSection";
import UseCasesSection from "@/components/landing/UseCasesSection";
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
        <UseCasesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
