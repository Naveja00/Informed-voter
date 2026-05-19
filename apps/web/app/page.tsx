import { KpiCard } from "@/components/kpi-card";
import { matchup, politicians } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold">National Transparency Dashboard</h2>
        <p className="text-slate-400">Verified public records. Neutral analysis. Source-first views.</p>
      </section>
      <section className="grid gap-4 md:grid-cols-4">
        <KpiCard label="Tracked Politicians" value={politicians.length} />
        <KpiCard label="Active Matchups" value={1} hint={matchup.race} />
        <KpiCard label="Bills Indexed" value={15432} />
        <KpiCard label="Donor Records" value={2819012} />
      </section>
    </div>
  );
}
