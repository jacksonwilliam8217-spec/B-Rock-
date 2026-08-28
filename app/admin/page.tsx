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

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
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
              href="/admin/plans"
              className="text-white/70 hover:text-yellow-400"
            >
              Plans
            </a>

            <a
              href="/admin/investments"
              className="text-white/70 hover:text-yellow-400"
            >
              Investments
            </a>

            <a
              href="/admin/deposits"
              className="text-white/70 hover:text-yellow-400"
            >
              Deposits
            </a>
<a
  href="/admin/payment-methods"
  className="text-white/70 hover:text-yellow-400"
>
  Payment Methods
</a>

<a
  href="/admin/withdrawals"
  className="text-white/70 hover:text-yellow-400"
>
  Withdrawals
</a>

<a
  href="/admin/messages"
  className="text-white/70 hover:text-yellow-400"
>
  Messages
</a>

<a
  href="/admin/notifications"
  className="text-white/70 hover:text-yellow-400"
>
  Notifications
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
            B-Rock Admin Dashboard
          </h1>

          <p className="mt-2 text-white/50">
            Monitor investments and manage the platform.
          </p>
        </div>

        {error && (
          <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-300">
            <p className="font-semibold">
              Database Error
            </p>

            <p className="mt-2 text-sm">
              {error.message}
            </p>
          </div>
        )}

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/50">
              Total Investments
            </p>

            <p className="mt-2 text-3xl font-bold">
              {totalInvestments}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/50">
              Active
            </p>

            <p className="mt-2 text-3xl font-bold">
              {activeInvestments}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/50">
              Completed
            </p>

            <p className="mt-2 text-3xl font-bold">
              {completedInvestments}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/50">
              Cancelled
            </p>

            <p className="mt-2 text-3xl font-bold">
              {cancelledInvestments}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/50">
              Total Invested
            </p>

            <p className="mt-2 text-3xl font-bold">
              ${totalInvested.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <a
            href="/admin/investments"
            className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-yellow-400/40"
          >
            <h2 className="text-lg font-bold">
              Investment Management
            </h2>

            <p className="mt-2 text-sm text-white/50">
              View and manage investor records.
            </p>
          </a>

          <a
            href="/admin/plans"
            className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-yellow-400/40"
          >
            <h2 className="text-lg font-bold">
              Investment Plans
            </h2>

            <p className="mt-2 text-sm text-white/50">
              Manage available investment plans.
            </p>
          </a>

          <a
            href="/admin/deposits"
            className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-yellow-400/40"
          >
            <h2 className="text-lg font-bold">
              Deposits
            </h2>

            <p className="mt-2 text-sm text-white/50">
              Review and manage deposits.
            </p>
          </a>
        </div>
      </section>
    </main>
  );
}
