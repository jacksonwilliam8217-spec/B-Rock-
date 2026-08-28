import { createClient } from "@/lib/supabase/server";
import PlanEditor from "./PlanEditor";
import { redirect } from "next/navigation";

export default async function AdminPlansPage() {
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

  async function createPlan(formData: FormData) {
    "use server";

    const client = await createClient();

    const {
      data: { user: currentUser },
    } = await client.auth.getUser();

    if (!currentUser) {
      redirect("/login");
    }

    const { data: admin } = await client.rpc("is_admin");

    if (!admin) {
      throw new Error("Admin access required");
    }

    const name = String(formData.get("name") || "").trim();
    const description = String(
      formData.get("description") || ""
    ).trim();

    const minAmount = Number(formData.get("min_amount"));
    const maxAmount = Number(formData.get("max_amount"));
    const durationDays = Number(
      formData.get("duration_days")
    );
    const dailyRoi = Number(formData.get("daily_roi"));
    const status = String(formData.get("status") || "active");

    if (!name) {
      throw new Error("Plan name is required.");
    }

    if (
      !Number.isFinite(minAmount) ||
      minAmount < 0
    ) {
      throw new Error("Invalid minimum amount.");
    }

    if (
      !Number.isFinite(maxAmount) ||
      maxAmount < minAmount
    ) {
      throw new Error(
        "Maximum amount must be greater than or equal to minimum amount."
      );
    }

    if (
      !Number.isFinite(durationDays) ||
      durationDays < 1
    ) {
      throw new Error("Duration must be at least 1 day.");
    }

    if (
      !Number.isFinite(dailyRoi) ||
      dailyRoi < 0
    ) {
      throw new Error("Invalid simulated ROI.");
    }

    if (
      status !== "active" &&
      status !== "inactive"
    ) {
      throw new Error("Invalid plan status.");
    }

    const { error } = await client
      .from("investment_plans")
      .insert({
        name,
        description,
        min_amount: minAmount,
        max_amount: maxAmount,
        duration_days: durationDays,
        daily_roi: dailyRoi,
        status,
      });

    if (error) {
      throw new Error(error.message);
    }

    redirect("/admin/plans");
  }

  const { data: plans, error: plansError } =
    await supabase
      .from("investment_plans")
      .select(
        "id, name, description, min_amount, max_amount, duration_days, daily_roi, status, created_at"
      )
      .order("created_at", {
        ascending: true,
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

          <div className="flex gap-5 text-sm">
            <a
              href="/dashboard"
              className="text-white/70 hover:text-yellow-400"
            >
              Dashboard
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
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div>
          <h1 className="text-3xl font-bold">
            Investment Plans
          </h1>

          <p className="mt-2 text-white/50">
            Create and manage simulated investment plans.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-6">
          <h2 className="text-xl font-bold text-yellow-400">
            Create New Plan
          </h2>

          <p className="mt-2 text-sm text-white/50">
            Configure a new simulated investment plan.
          </p>

          <form
            action={createPlan}
            className="mt-6 space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm text-white/60">
                Plan Name
              </label>

              <input
                name="name"
                type="text"
                placeholder="e.g. Growth Plan"
                required
                className="w-full rounded-xl bg-slate-900 p-3 text-white outline-none ring-1 ring-white/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/60">
                Description
              </label>

              <textarea
                name="description"
                placeholder="Describe the simulated plan"
                rows={3}
                className="w-full rounded-xl bg-slate-900 p-3 text-white outline-none ring-1 ring-white/10"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-white/60">
                  Minimum Amount
                </label>

                <input
                  name="min_amount"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  className="w-full rounded-xl bg-slate-900 p-3 text-white outline-none ring-1 ring-white/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/60">
                  Maximum Amount
                </label>

                <input
                  name="max_amount"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  className="w-full rounded-xl bg-slate-900 p-3 text-white outline-none ring-1 ring-white/10"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-white/60">
                  Duration (days)
                </label>

                <input
                  name="duration_days"
                  type="number"
                  min="1"
                  required
                  className="w-full rounded-xl bg-slate-900 p-3 text-white outline-none ring-1 ring-white/10"
                />
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
                  required
                  className="w-full rounded-xl bg-slate-900 p-3 text-white outline-none ring-1 ring-white/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/60">
                Status
              </label>

              <select
                name="status"
                defaultValue="active"
                className="w-full rounded-xl bg-slate-900 p-3 text-white outline-none ring-1 ring-white/10"
              >
                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-yellow-400 px-5 py-3 font-bold text-slate-950 hover:bg-yellow-300"
            >
              Create Plan
            </button>
          </form>
        </div>

        {plansError && (
          <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-300">
            <p className="font-semibold">
              Unable to load investment plans.
            </p>

            <p className="mt-2 text-sm">
              {plansError.message}
            </p>
          </div>
        )}

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans?.map((plan) => (

            <div
              key={plan.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">
                    {plan.name}
                  </h2>

                  <p className="mt-2 text-sm text-white/50">
                    {plan.description || "Investment plan"}
                  </p>
                </div>

                <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-semibold capitalize text-yellow-400">
                  {plan.status}
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-sm text-white/50">
                    Minimum
                  </span>

                  <span className="font-semibold">
                    ${Number(plan.min_amount).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-sm text-white/50">
                    Maximum
                  </span>

                  <span className="font-semibold">
                    ${Number(plan.max_amount).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-sm text-white/50">
                    Duration
                  </span>

                  <span className="font-semibold">
                    {plan.duration_days} days
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-white/50">
                    Simulated Daily ROI
                  </span>

                  <span className="font-semibold text-yellow-400">
                    {Number(plan.daily_roi).toFixed(2)}%
                  </span>
                </div>
              </div>

              <PlanEditor
                plan={{
                  id: plan.id,
                  name: plan.name,
                  description: plan.description,
                  min_amount: Number(plan.min_amount),
                  max_amount: Number(plan.max_amount),
                  duration_days: Number(plan.duration_days),
                  daily_roi: Number(plan.daily_roi),
                  status: plan.status,
                }}
              />
            </div>
          ))}
        </div>

        {!plansError &&
          (!plans || plans.length === 0) && (
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-white/60">
                No investment plans found.
              </p>
            </div>
          )}
      </section>
    </main>
  );
}
