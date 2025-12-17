import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Intro } from "@/components/Intro";
import { TechStackMarquee } from "@/components/TechStackMarquee";
import { GithubSection } from "@/components/GithubSection";
import { CallToAction } from "@/components/CallToAction";
import { LetsConnect } from "@/components/LetConnect";
import { Footer } from "@/components/Footer";
import { SectionDivider } from "@/components/SectionDivider";
import { FadeIn } from "@/components/FadeIn";

export default function Home() {
  return (
    <main>
      <FadeIn delay={0.1}>
        <Hero />
      </FadeIn>
      <FadeIn delay={0.1}>
        <Intro />
      </FadeIn>
      <FadeIn delay={0.1}>
        <SectionDivider />
      </FadeIn>
      <FadeIn delay={0.1}>
        <TechStackMarquee />
      </FadeIn>
      <FadeIn delay={0.1}>
        <SectionDivider />
      </FadeIn>
      <FadeIn delay={0.1}>
        <GithubSection />
      </FadeIn>
      <FadeIn delay={0.1}>
        <SectionDivider />
      </FadeIn>
      <FadeIn delay={0.1}>
        <CallToAction />
      </FadeIn>
      <FadeIn delay={0.1}>
        <SectionDivider />
      </FadeIn>
      <FadeIn delay={0.1}>
        <LetsConnect />
      </FadeIn>
        <Footer />
    </main>
  );
}
