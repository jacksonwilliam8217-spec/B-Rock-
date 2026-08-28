import { createClient } from "@/lib/supabase/server";

export default async function TransactionsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-4xl">
          <a href="/" className="text-2xl font-bold text-yellow-400">
            B-Rock
          </a>

          <h1 className="mt-10 text-4xl font-bold">Transactions</h1>

          <p className="mt-4 text-white/60">
            Please sign in to view your account transactions.
          </p>

          <a
            href="/login"
            className="mt-8 inline-block rounded-lg bg-yellow-400 px-6 py-3 font-bold text-slate-950"
          >
            Sign In
          </a>
        </div>
      </main>
    );
  }

  const { data: deposits } = await supabase
    .from("deposits")
    .select("id, amount, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-white/10 bg-slate-900 px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <a href="/" className="text-2xl font-bold text-yellow-400">
            B-Rock
          </a>

          <a
            href="/dashboard"
            className="rounded-lg border border-white/10 px-5 py-2.5 text-sm text-white/70 hover:text-white"
          >
            Dashboard
          </a>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-yellow-400">
          Account Activity
        </p>

        <h1 className="mt-3 text-4xl font-bold">Transactions</h1>

        <p className="mt-4 text-white/60">
          Review recorded account activity and transaction status.
        </p>

        <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div className="grid grid-cols-3 border-b border-white/10 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-white/40">
            <span>Type</span>
            <span>Status</span>
            <span className="text-right">Amount</span>
          </div>

          {(deposits ?? []).length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-white/40">
              No transactions have been recorded yet.
            </div>
          ) : (
            deposits?.map((deposit) => (
              <div
                key={deposit.id}
                className="grid grid-cols-3 border-b border-white/5 px-6 py-5 last:border-0"
              >
                <div>
                  <p className="font-medium">Deposit</p>
                  <p className="mt-1 text-xs text-white/40">
                    {new Date(deposit.created_at).toLocaleDateString("en-US")}
                  </p>
                </div>

                <div>
                  <span className="text-sm capitalize text-white/60">
                    {deposit.status}
                  </span>
                </div>

                <div className="text-right font-semibold">
                  ${Number(deposit.amount).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
