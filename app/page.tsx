import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Intro } from "@/components/Intro";
import { TechStackMarquee } from "@/components/TechStackMarquee";
import { GithubSection } from "@/components/GithubSection";
import { CallToAction } from "@/components/CallToAction";
import { LetsConnect } from "@/components/LetConnect";
import { Footer } from "@/components/Footer";
import { SectionDivider } from "@/components/SectionDivider";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Intro />
      <SectionDivider />
      <TechStackMarquee />
      <SectionDivider />
      <GithubSection />
      <SectionDivider />
      <CallToAction />
      <SectionDivider />
      <LetsConnect />
      <Footer />
    </main>
  );
}
