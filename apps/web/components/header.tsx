import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <h1 className="text-lg font-semibold">Informed Voter</h1>
        <div className="flex gap-4 text-sm text-slate-300">
          <Link href="/">Dashboard</Link>
          <Link href="/politicians/p1">Politician</Link>
          <Link href="/compare/arizona-2026-senate">Matchup</Link>
          <Link href="/bills/hr-1024">Bill</Link>
        </div>
      </nav>
    </header>
  );
}
