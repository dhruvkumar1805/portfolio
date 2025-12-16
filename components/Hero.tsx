export function Hero() {
  return (
    <div className="relative mt-6 overflow-hidden rounded-xl">
      <img
        src="https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=876&auto=format&fit=crop"
        alt="Hero"
        className="h-55 w-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-serif tracking-wide text-white drop-shadow-sm">
          Build • Ship • Learn • Repeat
        </span>
      </div>
    </div>
  );
}
