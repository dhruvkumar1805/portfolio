import { GithubGraphClient } from "@/components/GithubGraphClient";

export function GithubSection() {
  return (
    <section className="mt-20">
      <h1 className="text-xl text-center text-neutral-700 dark:text-neutral-300">
        GitHub Contributions
      </h1>
      <p className="mb-12 text-center text-sm text-neutral-600 dark:text-neutral-400">
        Daily activity across open-source and personal projects
      </p>

      <GithubGraphClient
        username="dhruvkumar1805"
        blockMargin={2}
        lightColorPalette={[
          "#e5e7eb",
          "#cbd5e1",
          "#94a3b8",
          "#5f9fb0",
          "#3b8298",
        ]}
        darkColorPalette={[
          "#0f172a",
          "#1e293b",
          "#334155",
          "#4f7c8a",
          "#7fb6c8",
        ]}
      />
    </section>
  );
}
