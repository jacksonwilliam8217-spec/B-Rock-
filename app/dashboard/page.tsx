import { createClient } from "@/lib/supabase/server";
import LiveProfit from "./components/LiveProfit";

function money(value: number) {
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function calculateAccruedProfit(
  amount: number,
  dailyRoi: number,
  durationDays: number,
  startedAt: string
) {
  const startTime = new Date(startedAt).getTime();
  const now = Date.now();

  const elapsedMilliseconds = Math.max(
    0,
    now - startTime
  );

  const durationMilliseconds =
    durationDays * 24 * 60 * 60 * 1000;

  const effectiveElapsedMilliseconds = Math.min(
    elapsedMilliseconds,
    durationMilliseconds
  );

  const elapsedDays =
    effectiveElapsedMilliseconds /
    (24 * 60 * 60 * 1000);

  return amount * (dailyRoi / 100) * elapsedDays;
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        <h1 className="text-3xl font-bold text-red-400">
          Not Logged In
        </h1>

        <p className="mt-4 text-white/60">
          Please log in first.
        </p>
      </main>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, email, role")
    .eq("id", user.id)
    .maybeSingle();

  const {
    data: investments,
    error: investmentsError,
  } = await supabase
    .from("user_investments")
    .select(`
      id,
      user_id,
      plan_id,
      amount,
      status,
      created_at,
      daily_roi,
      duration_days,
      started_at,
      investment_plans (
        id,
        name,
        description,
        min_amount,
        max_amount,
        duration_days,
        daily_roi,
        status
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  /*
   * Automatically complete expired active investments.
   *
   * We only consider investments with:
   * - status = active
   * - a valid started_at
   * - duration_days >= 1
   *
   * The update is restricted to the logged-in user's investment.
   */
  const now = Date.now();

  for (const investment of investments ?? []) {
    if (
      investment.status !== "active" ||
      !investment.started_at ||
      Number(investment.duration_days || 0) < 1
    ) {
      continue;
    }

    const startedAt = new Date(
      investment.started_at
    ).getTime();

    const durationMilliseconds =
      Number(investment.duration_days) *
      24 *
      60 *
      60 *
      1000;

    const endTime =
      startedAt + durationMilliseconds;

    if (now >= endTime) {
      await supabase
        .from("user_investments")
        .update({
          status: "completed",
        })
        .eq("id", investment.id)
        .eq("user_id", user.id)
        .eq("status", "active");
    }
  }

  /*
   * Re-fetch investments after automatic completion.
   */
  const {
    data: refreshedInvestments,
    error: refreshedInvestmentsError,
  } = await supabase
    .from("user_investments")
    .select(`
      id,
      user_id,
      plan_id,
      amount,
      status,
      created_at,
      daily_roi,
      duration_days,
      started_at,
      investment_plans (
        id,
        name,
        description,
        min_amount,
        max_amount,
        duration_days,
        daily_roi,
        status
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  const finalInvestments =
    refreshedInvestments ?? investments ?? [];

  const { count: unreadMessages } = await supabase
    .from("messages")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("recipient_id", user.id)
    .eq("is_read", false);

  const {
    data: deposits,
    error: depositsError,
  } = await supabase
    .from("deposits")
    .select(
      "id, amount, status, created_at, investment_id"
    )
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  const safeInvestments = finalInvestments;

  const activeInvestments =
    safeInvestments.filter(
      (investment) =>
        investment.status === "active"
    );

  const completedInvestments =
  safeInvestments.filter(
    (investment) =>
      investment.status === "completed"
  );const pendingInvestments =
    safeInvestments.filter(
      (investment) =>
        investment.status === "pending"
    );

  const activePortfolio =
    activeInvestments.reduce(
      (total, investment) =>
        total +
        Number(investment.amount || 0),
      0
    );

  const pendingAmount =
    pendingInvestments.reduce(
      (total, investment) =>
        total +
        Number(investment.amount || 0),
      0
    );

  const totalSimulatedProfit =
    activeInvestments.reduce(
      (total, investment) => {
        const amount = Number(
          investment.amount || 0
        );

        const dailyRoi = Number(
          investment.daily_roi || 0
        );

        const durationDays = Number(
          investment.duration_days || 0
        );

        const startedAt =
          investment.started_at ??
          investment.created_at;

        return (
          total +
          calculateAccruedProfit(
            amount,
            dailyRoi,
            durationDays,
            startedAt
          )
        );
      },
      0
    );

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

          <div className="flex flex-wrap items-center gap-5 text-sm">
            <a
              href="/dashboard"
              className="text-yellow-400"
            >
              Dashboard
            </a>

            <a
              href="/investments"
              className="text-white/70 hover:text-yellow-400"
            >
              Investment Plans
            </a>

            <a
              href="/deposit"
              className="text-white/70 hover:text-yellow-400"
            >
              Deposit
            </a>
<a
  href="/withdrawals"
  className="text-white/70 hover:text-yellow-400"
>
  Withdrawals
</a>

            <a
              href="/messages"
              className="text-white/70 hover:text-yellow-400"
            >
              Messages

              {Number(unreadMessages || 0) > 0 && (
                <span className="ml-2 rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-bold text-slate-950">
                  {unreadMessages}
                </span>
              )}
            </a>

            {profile?.role === "admin" && (
              <a
                href="/admin"
                className="text-white/70 hover:text-yellow-400"
              >
                Admin
              </a>
            )}
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div>
          <p className="text-sm text-white/50">
            Welcome
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            {profile?.username || "User"}
          </h1>

          <p className="mt-1 text-white/50">
            {profile?.email || user.email}
          </p>
        </div>

        {Number(unreadMessages || 0) > 0 && (
          <a
            href="/messages"
            className="mt-8 block rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-5 transition hover:bg-yellow-400/15"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-yellow-400">
                  Unread Messages
                </p>

                <p className="mt-1 text-white/70">
                  You have{" "}
                  {unreadMessages}{" "}
                  unread{" "}
                  {Number(unreadMessages) === 1
                    ? "message"
                    : "messages"}{" "}
                  from the B-Rock administration.
                </p>
              </div>

              <span className="rounded-full bg-yellow-400 px-3 py-1 text-sm font-bold text-slate-950">
                View
              </span>
            </div>
          </a>
        )}

        {(investmentsError ||
          refreshedInvestmentsError) && (
          <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-300">
            <p className="font-semibold">
              Unable to load investments.
            </p>

            <p className="mt-2 text-sm">
              {(
                refreshedInvestmentsError ??
                investmentsError
              )?.message}
            </p>
          </div>
        )}

        <div className="mt-10 grid gap-5 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/50">
              Active Portfolio
            </p>

            <p className="mt-2 text-2xl font-bold">
              {money(activePortfolio)}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/50">
              Pending
            </p>

            <p className="mt-2 text-2xl font-bold">
              {money(pendingAmount)}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/50">
              Simulated Profit
            </p>

            <p className="mt-2 text-2xl font-bold text-yellow-400">
              {money(totalSimulatedProfit)}
            </p>
          </div>

          <a
            href="/messages"
            className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
          >
            <p className="text-sm text-white/50">
              Messages
            </p>

            <p className="mt-2 text-2xl font-bold">
              {unreadMessages || 0}
            </p>

            <p className="mt-1 text-xs text-white/40">
              Unread
            </p>
          </a>
        </div>

        {activeInvestments.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold">
              Active Investments
            </h2>

            <div className="mt-5 space-y-5">
              {activeInvestments.map(
                (investment) => (
                  <div
                    key={investment.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-6"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-white/40">
                          Investment
                        </p>

                        <h3 className="mt-1 text-lg font-bold">
                          {investment
                            .investment_plans?.[0]
                            ?.name ||
                            "Investment"}
                        </h3>
                      </div>

                      <span className="rounded-full bg-green-400/10 px-3 py-1 text-xs font-semibold text-green-400">
                        Active
                      </span>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-3">
                      <div>
                        <p className="text-xs text-white/40">
                          Amount
                        </p>

                        <p className="mt-1 font-semibold">
                          {money(
                            Number(
                              investment.amount || 0
                            )
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-white/40">
                          Daily ROI
                        </p>

                        <p className="mt-1 font-semibold">
                          {Number(
                            investment.daily_roi || 0
                          ).toFixed(2)}
                          %
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-white/40">
                          Duration
                        </p>

                        <p className="mt-1 font-semibold">
                          {investment.duration_days} days
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <LiveProfit
                        amount={Number(
                          investment.amount || 0
                        )}
                        dailyRoi={Number(
                          investment.daily_roi || 0
                        )}
                        durationDays={Number(
                          investment.duration_days || 0
                        )}
                        startedAt={
                          investment.started_at ??
                          investment.created_at
                        }
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        <section className="mt-10">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold">
              Deposit History
            </h2>

            <p className="mt-2 text-sm text-white/50">
              View your recent deposit requests and their status.
            </p>

            {depositsError && (
              <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                Unable to load deposit history.
              </div>
            )}

            {!depositsError &&
              (!deposits ||
                deposits.length === 0) && (
                <div className="mt-5 rounded-xl border border-white/10 bg-slate-900 p-5 text-sm text-white/50">
                  No deposits found.
                </div>
              )}

            {!depositsError &&
              deposits &&
              deposits.length > 0 && (
                <div className="mt-5 space-y-3">
                  {deposits.map((deposit) => (
                    <div
                      key={deposit.id}
                      className="flex flex-col gap-3 rounded-xl border border-white/10 bg-slate-900 p-4 md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <p className="text-lg font-semibold">
                          $
                          {Number(
                            deposit.amount
                          ).toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </p>

                        <p className="mt-1 text-sm text-white/40">
                          {new Date(
                            deposit.created_at
                          ).toLocaleString()}
                        </p>
                      </div>

                      <span
                        className={`w-fit rounded-full px-3 py-1 text-sm font-semibold capitalize ${
                          deposit.status ===
                          "approved"
                            ? "bg-green-500/10 text-green-400"
                            : deposit.status ===
                                "pending"
                              ? "bg-yellow-400/10 text-yellow-400"
                              : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {deposit.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </section>
      </section>
    </main>
  );
}

