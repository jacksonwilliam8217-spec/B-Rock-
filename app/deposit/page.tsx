import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DepositPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: investments, error: investmentsError } = await supabase
    .from("user_investments")
    .select(`
      id,
      user_id,
      plan_id,
      amount,
      status,
      created_at,
      investment_plans (
        id,
        name
      )
    `)
    .eq("user_id", user.id)
    .in("status", ["pending", "active"])
    .order("created_at", { ascending: false });

  async function createDeposit(formData: FormData) {
    "use server";

    const client = await createClient();

    const {
      data: { user: currentUser },
    } = await client.auth.getUser();

    if (!currentUser) {
      redirect("/login");
    }

    const investmentId = String(
      formData.get("investment_id") || ""
    );

    const amount = Number(formData.get("amount"));

    if (!investmentId) {
      throw new Error("Please select an investment.");
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Please enter a valid deposit amount.");
    }

    const { data: investment, error: investmentError } =
      await client
        .from("user_investments")
        .select("id, user_id, status")
        .eq("id", investmentId)
        .eq("user_id", currentUser.id)
        .in("status", ["pending", "active"])
        .maybeSingle();

    if (investmentError) {
      throw new Error(investmentError.message);
    }

    if (!investment) {
      throw new Error(
        "The selected investment could not be found."
      );
    }

    const { error: insertError } = await client
      .from("deposits")
      .insert({
        user_id: currentUser.id,
        investment_id: investmentId,
        amount,
        status: "pending",
      });

    if (insertError) {
      throw new Error(insertError.message);
    }

    redirect("/dashboard");
  }

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
              Investment Plans
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

      <section className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-sm text-white/50">
          Account Funding
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Make a Deposit
        </h1>

        <p className="mt-2 text-white/50">
          Submit a deposit request for an eligible investment.
        </p>

        {investmentsError && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
            Unable to load your investments. Please try again.
          </div>
        )}

        {!investmentsError &&
          (!investments || investments.length === 0) && (
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold">
                No eligible investments
              </h2>

              <p className="mt-2 text-sm text-white/50">
                You currently have no pending or active investment
                available for a deposit request.
              </p>

              <a
                href="/investments"
                className="mt-5 inline-block rounded-xl bg-yellow-400 px-5 py-3 font-bold text-slate-950 hover:bg-yellow-300"
              >
                View Investment Plans
              </a>
            </div>
          )}

        {investments && investments.length > 0 && (
          <form
            action={createDeposit}
            className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <div>
              <label
                htmlFor="investment_id"
                className="mb-2 block text-sm text-white/60"
              >
                Investment
              </label>

              <select
                id="investment_id"
                name="investment_id"
                required
                defaultValue=""
                className="w-full rounded-xl bg-slate-900 p-3 text-white ring-1 ring-white/10"
              >
                <option value="" disabled>
                  Select an investment
                </option>

                {investments.map((investment) => {
                  const plan = Array.isArray(
                    investment.investment_plans
                  )
                    ? investment.investment_plans[0]
                    : investment.investment_plans;

                  return (
                    <option
                      key={investment.id}
                      value={investment.id}
                    >
                      {plan?.name || "Investment"} — $
                      {Number(investment.amount).toLocaleString()} —{" "}
                      {investment.status}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="mt-5">
              <label
                htmlFor="amount"
                className="mb-2 block text-sm text-white/60"
              >
                Deposit Amount
              </label>

              <input
                id="amount"
                name="amount"
                type="number"
                min="1"
                step="0.01"
                placeholder="100"
                required
                className="w-full rounded-xl bg-slate-900 p-3 text-white placeholder:text-white/30 ring-1 ring-white/10"
              />
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-xl bg-yellow-400 px-5 py-3 font-bold text-slate-950 hover:bg-yellow-300"
            >
              Submit Deposit Request
            </button>
          </form>
        )}

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/50">
          Deposit requests are submitted for review. Your account
          should not be credited until the applicable deposit and
          approval process has been completed.
        </div>
      </section>
    </main>
  );
}
