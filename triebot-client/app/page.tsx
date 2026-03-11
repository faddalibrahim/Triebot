import { Hero } from "@/components/landing/hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-neo-bg selection:bg-neo-purple/30 text-foreground overflow-x-hidden">
      <main className="w-full">
        <Hero />
      </main>
    </div>
  );
}
