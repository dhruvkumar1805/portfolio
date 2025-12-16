import { ProofHeader } from "@/components/ProofOfWork/ProofHeader";
import { ProjectList } from "@/components/ProofOfWork/ProjectList";

export default function ProofOfWorkPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <ProofHeader />
      <ProjectList />
    </main>
  );
}
