import { ProofHeader } from "@/components/ProofOfWork/ProofHeader";
import { ProjectList } from "@/components/ProofOfWork/ProjectList";
import { FadeIn } from "@/components/FadeIn";

export default function ProofOfWorkPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <FadeIn delay={0.1}>
        <ProofHeader />
      </FadeIn>
      <FadeIn delay={0.1}>
        <ProjectList />
      </FadeIn>
    </main>
  );
}
