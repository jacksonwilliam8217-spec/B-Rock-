import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DepositHistoryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: deposits, error } = await supabase
    .from("deposits")
    .select(`
      id,
      investment_id,
      amount,
      status,
      created_at
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
          Account Funding
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Deposit History
        </h1>

        <p className="mt-2 text-white/50">
          View your deposit requests and their current status.
        </p>

        {error && (
          <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-300">
            Unable to load deposit history.
          </div>
        )}

        {!error &&
          (!deposits || deposits.length === 0) && (
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/60">
              No deposits found.
            </div>
          )}

        <div className="mt-8 space-y-4">
          {deposits?.map((deposit) => (
            <div
              key={deposit.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-white/40">
                    Deposit Amount
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    ${Number(deposit.amount).toLocaleString()}
                  </p>
                </div>

                <span className="w-fit rounded-full bg-yellow-400/10 px-3 py-1 text-sm capitalize text-yellow-400">
                  {deposit.status}
                </span>
              </div>

              <div className="mt-5 border-t border-white/10 pt-4 text-sm text-white/50">
                <p>
                  Requested:{" "}
                  {new Date(
                    deposit.created_at
                  ).toLocaleString()}
                </p>

                <p className="mt-2 break-all">
                  Investment ID: {deposit.investment_id}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
