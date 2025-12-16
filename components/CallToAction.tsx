export function CallToAction() {
  return (
    <section className="mt-20 text-center">
      <p className="text-xl text-neutral-500 dark:text-neutral-400">
        If this aligns with what you’re looking for, let’s connect.
      </p>

      <div className="mt-6">
        <a
          href="https://calendly.com/your-link"
          target="_blank"
          rel="noreferrer"
          className="
            inline-flex items-center gap-2
            rounded-full
            bg-black px-6 py-3
            text-sm font-medium text-white
            transition
            hover:bg-neutral-800
            dark:bg-white dark:text-black dark:hover:bg-neutral-200
          "
        >
          Book a Free Call
        </a>
      </div>
    </section>
  );
}
