export default async function BillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Bill {id.toUpperCase()}</h2>
      <div className="rounded-xl border border-slate-800 p-4">
        <p className="text-slate-300">Official summary and source links appear here.</p>
        <p className="mt-2 text-xs text-slate-500">AI explanation must be explicitly labeled and separate from official source text.</p>
      </div>
    </div>
  );
}
