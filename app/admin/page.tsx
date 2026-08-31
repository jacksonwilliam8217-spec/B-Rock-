import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: isAdmin, error: adminError } =
    await supabase.rpc("is_admin");

  if (adminError || !isAdmin) {
    redirect("/dashboard");
  }

  const { data: investments, error } = await supabase
    .from("user_investments")
    .select("id, amount, status");

  const safeInvestments = investments ?? [];

  const totalInvestments = safeInvestments.length;

  const activeInvestments = safeInvestments.filter(
    (investment) => investment.status === "active"
  ).length;

  const completedInvestments = safeInvestments.filter(
    (investment) => investment.status === "completed"
  ).length;

  const cancelledInvestments = safeInvestments.filter(
    (investment) => investment.status === "cancelled"
  ).length;

  const totalInvested = safeInvestments.reduce(
    (total, investment) =>
      total + Number(investment.amount || 0),
    0
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full border-b border-white/10 bg-slate-900 lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
          <div className="p-6">
            <a
              href="/"
              className="text-2xl font-bold text-yellow-400"
            >
              B-Rock
            </a>

            <p className="mt-1 text-xs text-white/40">
              Administration
            </p>
          </div>

          <nav className="px-4 pb-6">
            <a
              href="/admin"
              className="mb-2 flex items-center rounded-xl bg-yellow-400/10 px-4 py-3 text-sm font-semibold text-yellow-400"
            >
              Dashboard
            </a>

            <a
              href="/admin/front-page"
              className="mb-2 flex items-center rounded-xl px-4 py-3 text-sm text-white/70 hover:bg-white/5 hover:text-white"
            >
              Front Page Editor
            </a>

            <a
              href="/admin/users"
              className="mb-2 flex items-center rounded-xl px-4 py-3 text-sm text-white/70 hover:bg-white/5 hover:text-white"
            >
              Users
            </a>

            <a
              href="/admin/deposits"
              className="mb-2 flex items-center rounded-xl px-4 py-3 text-sm text-white/70 hover:bg-white/5 hover:text-white"
            >
              Deposits
            </a>

            <a
              href="/admin/investments"
              className="mb-2 flex items-center rounded-xl px-4 py-3 text-sm text-white/70 hover:bg-white/5 hover:text-white"
            >
              Investments
            </a>

            <a
              href="/admin/withdrawals"
              className="mb-2 flex items-center rounded-xl px-4 py-3 text-sm text-white/70 hover:bg-white/5 hover:text-white"
            >
              Withdrawals
            </a>

            <a
              href="/admin/payment-methods"
              className="mb-2 flex items-center rounded-xl px-4 py-3 text-sm text-white/70 hover:bg-white/5 hover:text-white"
            >
              Payment Methods
            </a>

            <a
              href="/admin/plans"
              className="mb-2 flex items-center rounded-xl px-4 py-3 text-sm text-white/70 hover:bg-white/5 hover:text-white"
            >
              Investment Plans
            </a>

            <a
              href="/admin/messages"
              className="mb-2 flex items-center rounded-xl px-4 py-3 text-sm text-white/70 hover:bg-white/5 hover:text-white"
            >
              Messages
            </a>

            <a
              href="/admin/notifications"
              className="flex items-center rounded-xl px-4 py-3 text-sm text-white/70 hover:bg-white/5 hover:text-white"
            >
              Notifications
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <section className="flex-1">
          {/* Header */}
          <header className="border-b border-white/10 bg-slate-950/80 px-6 py-6 lg:px-10">
            <p className="text-sm text-white/40">
              Administration
            </p>

            <div className="mt-1 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-3xl font-bold">
                  B-Rock Admin Dashboard
                </h1>

                <p className="mt-2 text-sm text-white/50">
                  Monitor investments and manage the platform.
                </p>
              </div>

              <a
                href="/dashboard"
                className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 hover:border-yellow-400/40 hover:text-yellow-400"
              >
                View Client Dashboard
              </a>
            </div>
          </header>

          <div className="px-6 py-8 lg:px-10">
            {/* Database Error */}
            {error && (
              <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-300">
                <p className="font-semibold">
                  Database Error
                </p>

                <p className="mt-2 text-sm">
                  {error.message}
                </p>
              </div>
            )}

            {/* Analytics */}
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-sm text-white/50">
                  Total Investments
                </p>

                <p className="mt-3 text-3xl font-bold">
                  {totalInvestments}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-sm text-white/50">
                  Active
                </p>

                <p className="mt-3 text-3xl font-bold text-green-400">
                  {activeInvestments}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-sm text-white/50">
                  Completed
                </p>

                <p className="mt-3 text-3xl font-bold">
                  {completedInvestments}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-sm text-white/50">
                  Cancelled
                </p>

                <p className="mt-3 text-3xl font-bold text-red-400">
                  {cancelledInvestments}
                </p>
              </div>

              <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-5">
                <p className="text-sm text-white/50">
                  Total Invested
                </p>

                <p className="mt-3 text-3xl font-bold text-yellow-400">
                  $
                  {totalInvested.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>

            {/* Management */}
            <div className="mt-8">
              <div className="mb-5">
                <h2 className="text-xl font-bold">
                  Platform Management
                </h2>

                <p className="mt-1 text-sm text-white/40">
                  Manage users, investments and platform operations.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <a
                href="/admin/front-page"
                className="group rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-6 transition hover:border-yellow-400/50 hover:bg-yellow-400/10"
              >
                <h3 className="text-lg font-bold text-yellow-400">
                  Front Page Editor
                </h3>

                <p className="mt-2 text-sm text-white/50">
                  Edit the public B-Rock homepage, hero section, market
                  section and calls to action.
                </p>
              </a>
                <a
                  href="/admin/users"
                  className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-yellow-400/40 hover:bg-white/[0.06]"
                >
                  <h3 className="text-lg font-bold group-hover:text-yellow-400">
                    User Accounts
                  </h3>

                  <p className="mt-2 text-sm text-white/50">
                    View registered users and manage account status.
                  </p>
                </a>

                <a
                  href="/admin/investments"
                  className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-yellow-400/40 hover:bg-white/[0.06]"
                >
                  <h3 className="text-lg font-bold group-hover:text-yellow-400">
                    Investment Management
                  </h3>

                  <p className="mt-2 text-sm text-white/50">
                    View and manage investor records.
                  </p>
                </a>

                <a
                  href="/admin/plans"
                  className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-yellow-400/40 hover:bg-white/[0.06]"
                >
                  <h3 className="text-lg font-bold group-hover:text-yellow-400">
                    Investment Plans
                  </h3>

                  <p className="mt-2 text-sm text-white/50">
                    Manage available investment plans.
                  </p>
                </a>

                <a
                  href="/admin/deposits"
                  className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-yellow-400/40 hover:bg-white/[0.06]"
                >
                  <h3 className="text-lg font-bold group-hover:text-yellow-400">
                    Deposits
                  </h3>

                  <p className="mt-2 text-sm text-white/50">
                    Review and manage deposits.
                  </p>
                </a>

                <a
                  href="/admin/withdrawals"
                  className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-yellow-400/40 hover:bg-white/[0.06]"
                >
                  <h3 className="text-lg font-bold group-hover:text-yellow-400">
                    Withdrawals
                  </h3>

                  <p className="mt-2 text-sm text-white/50">
                    Review withdrawal requests and transactions.
                  </p>
                </a>

                <a
                  href="/admin/messages"
                  className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-yellow-400/40 hover:bg-white/[0.06]"
                >
                  <h3 className="text-lg font-bold group-hover:text-yellow-400">
                    Messages
                  </h3>

                  <p className="mt-2 text-sm text-white/50">
                    Manage user communications and support messages.
                  </p>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
