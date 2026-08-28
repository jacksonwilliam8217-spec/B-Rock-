import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type Investment = {
  id: string;
  user_id: string;
  plan_id: string;
  amount: number;
  status: string;
  daily_roi: number;
  duration_days: number;
  started_at: string | null;
  created_at: string;
  profiles?: { full_name: string | null; email: string | null; username: string | null }[] | null;
  investment_plans?: { name: string; description: string | null; daily_roi: number; duration_days: number | null }[] | null;
};

export default async function AdminInvestmentsPage() {
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

  const { data: isAdmin, error: adminError } =
    await supabase.rpc("is_admin");

  if (adminError || !isAdmin) {

    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        <h1 className="text-3xl font-bold text-red-400">
          Admin Access Denied
        </h1>
        <p className="mt-4 text-white/60">
          This account is not an administrator.
        </p>
      </main>
    );
  }

  async function updateInvestment(formData: FormData) {
    "use server";

    const client = await createClient();

    const {
      data: { user: currentUser },
    } = await client.auth.getUser();

    if (!currentUser) {
      redirect("/login");
    }

    const { data: admin, error: adminError } =
      await client.rpc("is_admin");

    if (adminError || !admin) {
      throw new Error("Admin access required.");
    }

    const id = String(formData.get("id") || "");
    const status = String(formData.get("status") || "");
    const dailyRoi = Number(formData.get("daily_roi"));
    const durationDays = Number(
      formData.get("duration_days")
    );

    if (!id) {
      throw new Error("Investment ID is required.");
    }
    if (
      status !== "pending" &&
      status !== "active" &&
      status !== "completed" &&
      status !== "cancelled"
    ) {
      throw new Error("Invalid investment status.");
    }

    if (!Number.isFinite(dailyRoi) || dailyRoi < 0) {
      throw new Error("Invalid simulated daily ROI.");
    }

    if (
      !Number.isFinite(durationDays) ||
      durationDays < 1
    ) {
      throw new Error("Duration must be at least 1 day.");
    }

    const { data: existingInvestment, error: existingInvestmentError } =
  await client
    .from("user_investments")
    .select("status, started_at")
    .eq("id", id)
    .maybeSingle();

if (existingInvestmentError) {
  throw new Error(existingInvestmentError.message);
}

if (!existingInvestment) {
  throw new Error("Investment not found.");
}

const updateData: {
  status: string;
  daily_roi: number;
  duration_days: number;
  started_at?: string | null;
} = {
  status,
  daily_roi: dailyRoi,
  duration_days: durationDays,
};

if (status === "active") {
  if (
    existingInvestment.status !== "active" ||
    !existingInvestment.started_at
  ) {
    updateData.started_at = new Date().toISOString();
  }
} else if (status === "pending") {
  updateData.started_at = null;
}

    const { error } = await client
      .from("user_investments")
      .update(updateData)
      .eq("id", id);
    if (error) {
      throw new Error(error.message);
    }

    redirect("/admin/investments");
  }
  const { data: investments, error } = await supabase
    .from("user_investments")
    .select("id, user_id, plan_id, amount, status, daily_roi, duration_days, started_at, created_at")
    .order("created_at", { ascending: false });

  const userIds = [...new Set((investments || []).map((investment) => investment.user_id))];
  const planIds = [...new Set((investments || []).map((investment) => investment.plan_id))];

  const { data: profiles } = userIds.length
    ? await supabase.from("profiles").select("id, full_name, email, username").in("id", userIds)
    : { data: [] };

  const { data: investmentPlans } = planIds.length
    ? await supabase.from("investment_plans").select("id, name").in("id", planIds)
    : { data: [] };

  const profileMap = new Map((profiles || []).map((profile) => [profile.id, profile]));
  const planMap = new Map((investmentPlans || []).map((plan) => [plan.id, plan]));
  const totalInvestments = investments?.length || 0;
  const activeInvestments = (investments || []).filter((investment) => investment.status === "active").length;
  const completedInvestments = (investments || []).filter((investment) => investment.status === "completed").length;
  const cancelledInvestments = (investments || []).filter((investment) => investment.status === "cancelled").length;
  const totalInvested = (investments || []).reduce((sum, investment) => sum + Number(investment.amount || 0), 0);

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
              className="text-yellow-400"
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
              href="/admin/messages"
              className="text-white/70 hover:text-yellow-400"
            >
              Messages
            </a>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div>
          <h1 className="text-3xl font-bold">
            Investment Management
          </h1>

          <p className="mt-2 text-white/50">
            Manage investor records and simulated performance
            settings.
          </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/50">Total Investments</p>
            <p className="mt-2 text-2xl font-bold">{totalInvestments}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/50">Active</p>
            <p className="mt-2 text-2xl font-bold">{activeInvestments}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/50">Completed</p>
            <p className="mt-2 text-2xl font-bold">{completedInvestments}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/50">Cancelled</p>
            <p className="mt-2 text-2xl font-bold">{cancelledInvestments}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/50">Total Invested</p>
            <p className="mt-2 text-2xl font-bold">${totalInvested.toLocaleString()}</p>
          </div>
        </div>
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

        {!error &&
          (!investments || investments.length === 0) && (
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/60">
              No investments found.
            </div>
          )}

        <div className="mt-8 space-y-6">
          {investments?.map((investment) => {
            const item = investment as Investment;

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm text-white/40">
                      Investment ID
                    </p>

                    <p className="mt-1 break-all text-sm">
                      {item.id}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-yellow-400/10 px-3 py-1 text-sm font-semibold capitalize text-yellow-400">
                    {item.status}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-sm text-white/40">
                      Investment Amount
                    </p>

                    <p className="mt-1 text-xl font-bold">
                      $
                      {Number(
                        item.amount
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-white/40">
                      Simulated Daily ROI
                    </p>

                    <p className="mt-1 text-xl font-bold text-yellow-400">
                      {Number(
                        item.daily_roi
                      ).toFixed(2)}
                      %
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-white/40">
                      Duration
                    </p>

                    <p className="mt-1 text-xl font-bold">
                      {item.duration_days} days
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-white/40">
                      Started
                    </p>

                    <p className="mt-1 text-sm">
                      {item.started_at
                        ? new Date(
                            item.started_at
                          ).toLocaleString()
                        : "Not started"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 border-t border-white/10 pt-5 md:grid-cols-2">
                  <div className="rounded-xl bg-slate-900/70 p-4">
                    <p className="text-xs uppercase tracking-wide text-white/40">
                      Linked Client
                    </p>

                    <p className="mt-2 break-all text-sm">
                      {profileMap.get(item.user_id)?.full_name || profileMap.get(item.user_id)?.username || profileMap.get(item.user_id)?.email || item.user_id}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-900/70 p-4">
                    <p className="text-xs uppercase tracking-wide text-white/40">
                      Linked Investment Plan
                    </p>

                    <p className="mt-2 break-all text-sm">
                      {planMap.get(item.plan_id)?.name || item.plan_id}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-slate-900/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-white/40">
                    Created
                  </p>

                  <p className="mt-2 text-sm">
                    {new Date(
                      item.created_at
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="mt-6 border-t border-white/10 pt-6">
                  <h2 className="text-lg font-bold">
                    Manage Investment
                  </h2>

                  <p className="mt-1 text-sm text-white/50">
                    Changes here affect simulated performance
                    only. They do not represent guaranteed
                    financial returns.
                  </p>

                  <form
                    action={updateInvestment}
                    className="mt-5 space-y-4"
                  >
                    <input
                      type="hidden"
                      name="id"
                      value={item.id}
                    />

                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <label className="mb-2 block text-sm text-white/60">
                          Status
                        </label>

                        <select
                          name="status"
                          defaultValue={item.status}
                          className="w-full rounded-xl bg-slate-900 p-3 text-white ring-1 ring-white/10"
                        >
                          <option value="pending">
                            Pending
                          </option>

                          <option value="active">
                            Active
                          </option>

                          <option value="completed">
                            Completed
                          </option>

                          <option value="cancelled">
                            Cancelled
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm text-white/60">
                          Simulated Daily ROI (%)
                        </label>

                        <input
                          name="daily_roi"
                          type="number"
                          min="0"
                          step="0.01"
                          defaultValue={Number(
                            item.daily_roi
                          )}
                          className="w-full rounded-xl bg-slate-900 p-3 text-white ring-1 ring-white/10"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm text-white/60">
                          Duration (days)
                        </label>

                        <input
                          name="duration_days"
                          type="number"
                          min="1"
                          defaultValue={
                            item.duration_days
                          }
                          className="w-full rounded-xl bg-slate-900 p-3 text-white ring-1 ring-white/10"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-xl bg-yellow-400 px-5 py-3 font-bold text-slate-950 hover:bg-yellow-300"
                    >
                      Save Investment Changes
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
