import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminWithdrawalsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const { data: withdrawals, error } = await supabase
    .from("withdrawals")
    .select(
      "id, user_id, amount, status, wallet_address, payment_details, created_at"
    )
    .order("created_at", { ascending: false });

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
              href="/admin"
              className="text-white/70 hover:text-yellow-400"
            >
              Admin
            </a>

            <a
              href="/admin/deposits"
              className="text-white/70 hover:text-yellow-400"
            >
              Deposits
            </a>

            <a
              href="/admin/investments"
              className="text-white/70 hover:text-yellow-400"
            >
              Investments
            </a>

            <a
              href="/dashboard"
              className="text-white/70 hover:text-yellow-400"
            >
              Dashboard
            </a>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div>
          <p className="text-sm text-white/50">
            Administration
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Withdrawal Requests
          </h1>

          <p className="mt-2 text-white/50">
            Review customer withdrawal requests.
          </p>
        </div>

        {error && (
          <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-300">
            <p className="font-semibold">
              Unable to load withdrawals
            </p>

            <p className="mt-2 text-sm">
              {error.message}
            </p>
          </div>
        )}

        {!error && (!withdrawals || withdrawals.length === 0) && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/50">
              No withdrawal requests found.
            </p>
          </div>
        )}

        {!error && withdrawals && withdrawals.length > 0 && (
          <div className="mt-8 space-y-4">
            {withdrawals.map((withdrawal) => (
              <div
                key={withdrawal.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/40">
                      Withdrawal Request
                    </p>

                    <h2 className="mt-1 text-xl font-bold">
                      ${Number(withdrawal.amount).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </h2>

                    <p className="mt-2 text-xs text-white/40">
                      Request ID: {withdrawal.id}
                    </p>

                    <p className="mt-1 text-xs text-white/40">
                      User ID: {withdrawal.user_id}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-yellow-400/10 px-3 py-1 text-sm font-semibold capitalize text-yellow-400">
                    {withdrawal.status}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs text-white/40">
                      Submitted
                    </p>

                    <p className="mt-1 text-sm text-white/70">
                      {new Date(
                        withdrawal.created_at
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-white/40">
                      Wallet / Payment Details
                    </p>

                    <p className="mt-1 break-all text-sm text-white/70">
                      {withdrawal.wallet_address ||
                        withdrawal.payment_details ||
                        "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-white/10 bg-slate-900 p-4">
                  <p className="text-sm font-semibold">
                    Internal Review Notes
                  </p>

                  <textarea
                    placeholder="Enter internal notes..."
                    className="mt-3 min-h-24 w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-yellow-400"
                    readOnly
                  />

                  <p className="mt-2 text-xs text-white/40">
                    Notes are currently display-only and are not saved.
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
