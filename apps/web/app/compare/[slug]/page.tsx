import { matchup } from "@/lib/mock-data";

export default function MatchupPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">{matchup.race}</h2>
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900">
            <tr><th className="p-3">Candidate</th><th>Party</th><th>Fundraising</th><th>Attendance %</th></tr>
          </thead>
          <tbody>
            {matchup.candidates.map((c) => (
              <tr key={c.name} className="border-t border-slate-800">
                <td className="p-3">{c.name}</td><td>{c.party}</td><td>${c.raised.toLocaleString()}</td><td>{c.attendance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
