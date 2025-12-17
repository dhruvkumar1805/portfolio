export function Hero() {
  return (
    <div className="relative mt-6 overflow-hidden rounded-xl">
      <img
        src="https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=876&auto=format&fit=crop"
        alt="Hero"
        className="
      h-40 sm:h-55 w-full object-cover
      brightness-95 dark:brightness-100
    "
      />

      <div
        className="
      absolute inset-0
      bg-gradient-to-t
      from-white/60 via-white/20 to-transparent
      dark:from-black/50 dark:via-black/20
    "
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="
    text-base sm:text-xl
    font-serif tracking-wide
    text-neutral-900 dark:text-white
    drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]
    dark:drop-shadow
  "
        >
          Build • Ship • Learn • Repeat
        </span>
      </div>
    </div>
  );
}
