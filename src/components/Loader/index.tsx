export default function LoaderPage() {
  const bars = Array.from({ length: 12 });

  return (
    <div className="flex flex-col items-center justify-center gap-4 min-h-screen bg-white/50 z-99">
      <div className="loading-bars">
        {bars.map((_, i) => (
          <span key={i} style={{ animationDelay: `${i * 0.1}s` }} />
        ))}
      </div>
      <p className="text-accent-primary font-medium uppercase tracking-widest">Loading ...</p>
    </div>
  );
}
