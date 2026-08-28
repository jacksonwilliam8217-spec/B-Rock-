import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function InvestmentHistoryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: investments, error } = await supabase
    .from("user_investments")
    .select(`
      id,
      amount,
      status,
      daily_roi,
      duration_days,
      started_at,
      created_at,
      investment_plans (
        name
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-white/10 bg-slate-900 px-6 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <a
            href="/"
            className="text-2xl font-bold text-yellow-400"
          >
            B-Rock
          </a>

          <div className="flex flex-wrap gap-5 text-sm">
            <a
              href="/dashboard"
              className="text-white/70 hover:text-yellow-400"
            >
              Dashboard
            </a>

            <a
              href="/investments"
              className="text-white/70 hover:text-yellow-400"
            >
              Plans
            </a>

            <a
              href="/profile"
              className="text-white/70 hover:text-yellow-400"
            >
              Profile
            </a>

            <a
              href="/messages"
              className="text-white/70 hover:text-yellow-400"
            >
              Messages
            </a>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <p className="text-sm text-white/50">
          Portfolio
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Investment History
        </h1>

        <p className="mt-2 text-white/50">
          View your investment records and simulated performance settings.
        </p>

        {error && (
          <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-300">
            Unable to load investment history.
          </div>
        )}

        {!error &&
          (!investments || investments.length === 0) && (
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/60">
              No investments found.
            </div>
          )}

        <div className="mt-8 space-y-5">
          {investments?.map((investment) => {
            const plan = Array.isArray(
              investment.investment_plans
            )
              ? investment.investment_plans[0]
              : investment.investment_plans;

            return (
              <div
                key={investment.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-white/40">
                      Investment
                    </p>

                    <h2 className="mt-1 text-xl font-bold">
                      {plan?.name ?? "Investment"}
                    </h2>
                  </div>

                  <span className="w-fit rounded-full bg-yellow-400/10 px-3 py-1 text-sm capitalize text-yellow-400">
                    {investment.status}
                  </span>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-sm text-white/40">
                      Amount
                    </p>
                    <p className="mt-1 font-semibold">
                      ${Number(investment.amount).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-white/40">
                      Daily ROI
                    </p>
                    <p className="mt-1 font-semibold">
                      {Number(investment.daily_roi).toFixed(2)}%
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-white/40">
                      Duration
                    </p>
                    <p className="mt-1 font-semibold">
                      {investment.duration_days} days
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-white/40">
                      Created
                    </p>
                    <p className="mt-1 text-sm">
                      {new Date(
                        investment.created_at
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
