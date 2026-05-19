import { notFound } from "next/navigation";
import { politicians } from "@/lib/mock-data";

export default async function PoliticianProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = politicians.find((x) => x.id === id);
  if (!p) return notFound();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">{p.fullName}</h2>
      <p className="text-slate-400">{p.party} · {p.office} · {p.state}-{p.district}</p>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 p-4">Voting Participation: {p.votingParticipation}%</div>
        <div className="rounded-xl border border-slate-800 p-4">Missed Votes: {p.missedVotes}</div>
        <div className="rounded-xl border border-slate-800 p-4">Bills Sponsored: {p.billsSponsored}</div>
      </div>
      <div className="rounded-xl border border-slate-800 p-4">
        <h3 className="font-medium">Top Funding Industries</h3>
        <ul className="mt-2 list-disc pl-5 text-slate-300">{p.topIndustries.map((i) => <li key={i}>{i}</li>)}</ul>
      </div>
    </div>
  );
}
