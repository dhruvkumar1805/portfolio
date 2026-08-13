import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import Work from "@/components/sections/Work";
import Stack from "@/components/sections/Stack";
import GithubSection from "@/components/sections/GithubSection";
import Education from "@/components/sections/Education";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Projects />
      <Work />
      <Stack />
      <GithubSection />
      <Education />
      <span
        aria-hidden="true"
        className="my-2 block h-6.5"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, var(--line), var(--line) 1px, transparent 1px, transparent 8px)",
        }}
      />
      <Contact />
    </>
  );
}
