import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function MT5Page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: mt5Account, error } = await supabase
    .from("mt5_accounts")
    .select(
      "id, mt5_login, broker_server, connection_status, account_balance, account_equity, free_margin, total_profit, last_synced_at"
    )
    .eq("user_id", user.id)
    .maybeSingle();

  async function connectMT5(formData: FormData) {
    "use server";

    const client = await createClient();

    const {
      data: { user: currentUser },
    } = await client.auth.getUser();

    if (!currentUser) {
      redirect("/login");
    }

    const mt5Login = String(formData.get("mt5_login") || "").trim();
    const brokerServer = String(formData.get("broker_server") || "").trim();

    if (!mt5Login || !brokerServer) {
      throw new Error("MT5 login and broker/server are required.");
    }

    const { error: saveError } = await client
      .from("mt5_accounts")
      .upsert(
        {
          user_id: currentUser.id,
          mt5_login: mt5Login,
          broker_server: brokerServer,
          connection_status: "pending",
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        }
      );

    if (saveError) {
      throw new Error(saveError.message);
    }

    redirect("/mt5");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-white/10 bg-slate-900 px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <a
            href="/dashboard"
            className="text-2xl font-bold text-yellow-400"
          >
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

      <section className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-yellow-400">
          Forex Trading
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          MT5 Connection
        </h1>

        <p className="mt-4 max-w-2xl text-white/60">
          Connect your MetaTrader 5 account to your B-Rock dashboard.
        </p>

        {error && (
          <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            Unable to load your MT5 account information.
          </div>
        )}

        {!mt5Account && !error && (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">
              Connect your MT5 account
            </h2>

            <p className="mt-2 text-sm text-white/50">
              Enter your MT5 account number and broker/server. Never enter
              your MT5 master or trading password into B-Rock.
            </p>

            <form action={connectMT5} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm text-white/70">
                  MT5 Login
                </label>

                <input
                  name="mt5_login"
                  type="text"
                  inputMode="numeric"
                  required
                  placeholder="MT5 account number"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Broker / Server
                </label>

                <input
                  name="broker_server"
                  type="text"
                  required
                  placeholder="Example: Broker-Server"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-yellow-400"
                />
              </div>

              <button
                type="submit"
                className="rounded-xl bg-yellow-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-yellow-300"
              >
                Request MT5 Connection
              </button>
            </form>
          </div>
        )}

        {mt5Account && (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm text-white/50">
                  MT5 Account
                </p>

                <p className="mt-1 text-xl font-semibold">
                  {mt5Account.mt5_login}
                </p>

                <p className="mt-1 text-sm text-white/50">
                  {mt5Account.broker_server}
                </p>
              </div>

              <span className="rounded-full bg-yellow-400/10 px-4 py-2 text-sm font-semibold capitalize text-yellow-400">
                {mt5Account.connection_status}
              </span>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-4">
              <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
                <p className="text-xs text-white/40">Balance</p>
                <p className="mt-2 text-lg font-semibold">
                  ${Number(mt5Account.account_balance).toFixed(2)}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
                <p className="text-xs text-white/40">Equity</p>
                <p className="mt-2 text-lg font-semibold">
                  ${Number(mt5Account.account_equity).toFixed(2)}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
                <p className="text-xs text-white/40">Free Margin</p>
                <p className="mt-2 text-lg font-semibold">
                  ${Number(mt5Account.free_margin).toFixed(2)}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
                <p className="text-xs text-white/40">Total Profit</p>
                <p className="mt-2 text-lg font-semibold">
                  ${Number(mt5Account.total_profit).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-white/10 pt-5 text-sm text-white/40">
              {mt5Account.last_synced_at
                ? `Last synced: ${new Date(
                    mt5Account.last_synced_at
                  ).toLocaleString()}`
                : "Awaiting MT5 integration and first account sync."}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
