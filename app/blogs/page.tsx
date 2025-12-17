import { LetsConnect } from "@/components/LetConnect";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/FadeIn";

export default function BlogsPage() {
  return (
    <main>
      <FadeIn delay={0.1}>
        <section className="mt-16">
          <h1 className="text-4xl font-serif tracking-tight dark:text-neutral-300">
            Blogs
          </h1>

          <p className="mt-4 max-w-xl text-neutral-600 dark:text-neutral-400">
            Reflections on building software and learning along the way.
          </p>
        </section>

        <section className="mt-14">
          <div
            className="
          rounded-xl border border-dashed border-neutral-800
            px-8 py-10 text-center
            "
          >
            <blockquote className="font-serif tracking-wide text-lg text-neutral-700 dark:text-neutral-300 italic">
              “The best moment to begin has passed. The next best is now.”
            </blockquote>

            <p className="mt-4 text-sm text-neutral-500">
              Writing is in progress. Thoughtful posts coming soon.
            </p>
          </div>
        </section>

        <div className="mt-20 h-px w-full bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
        <LetsConnect />
        <Footer />
      </FadeIn>
    </main>
  );
}
