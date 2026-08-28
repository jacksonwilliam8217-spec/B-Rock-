import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function InvestmentsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: plans, error } = await supabase
    .from("investment_plans")
    .select(
      "id, name, description, min_amount, max_amount, duration_days, daily_roi"
    )
    .eq("status", "active")
    .order("min_amount", { ascending: true });

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <a href="/" className="text-2xl font-bold text-yellow-400">
            B-Rock
          </a>

          <h1 className="mt-12 text-4xl font-bold">
            B-Rock Investment Plans
          </h1>

          <p className="mt-4 text-red-400">
            Unable to load the current investment plans.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-white/10 bg-slate-950 px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <a
            href="/"
            className="text-2xl font-bold text-yellow-400"
          >
            B-Rock
          </a>

          <div className="flex items-center gap-3">
            <a
              href="/dashboard"
              className="hidden rounded-lg border border-white/10 px-4 py-2 text-sm text-white/70 hover:text-white sm:block"
            >
              Dashboard
            </a>

            <a
              href={user ? "/dashboard" : "/login"}
              className="rounded-lg bg-yellow-400 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-yellow-300"
            >
              {user ? "Account" : "Sign In"}
            </a>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-400">
            B-Rock Investment Plans
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Choose Your Investment Plan
          </h1>

          <p className="mt-5 text-lg leading-8 text-white/60">
            Explore B-Rock's investment plans and select the level that
            matches your preferred investment amount and timeframe.
          </p>
        </div>

        {!user && (
          <div className="mt-10 rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-5">
            <p className="font-semibold text-yellow-400">
              Create an account to get started.
            </p>

            <p className="mt-1 text-sm text-white/60">
              You can explore the investment plans below without signing in.
              An account is required before submitting an investment request.
            </p>

            <a
              href="/register"
              className="mt-5 inline-block rounded-lg bg-yellow-400 px-5 py-2.5 font-bold text-slate-950 hover:bg-yellow-300"
            >
              Create Account
            </a>
          </div>
        )}

        {plans && plans.length > 0 ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.id}
                className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-7 shadow-xl"
              >
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-yellow-400">
                    Investment Plan
                  </span>

                  <h2 className="mt-3 text-2xl font-bold">
                    {plan.name}
                  </h2>

                  <p className="mt-3 min-h-20 text-sm leading-6 text-white/55">
                    {plan.description ||
                      "An investment plan designed to provide access to the B-Rock investment platform."}
                  </p>
                </div>

                <div className="mt-7 space-y-4 border-t border-white/10 pt-6">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/40">
                      Investment Range
                    </p>

                    <p className="mt-1 text-lg font-semibold">
                      ${Number(plan.min_amount).toLocaleString("en-US")}
                      {" – "}
                      {plan.max_amount
                        ? `$${Number(plan.max_amount).toLocaleString("en-US")}`
                        : "Unlimited"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/40">
                      Duration
                    </p>

                    <p className="mt-1 font-medium">
                      {plan.duration_days
                        ? `${plan.duration_days} days`
                        : "As stated by the plan"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/40">
                      Displayed Performance
                    </p>

                    <p className="mt-1 font-medium text-yellow-400">
                      {plan.daily_roi != null
                        ? `${Number(plan.daily_roi).toLocaleString("en-US")}% daily`
                        : "Not specified"}
                    </p>

                    <p className="mt-1 text-xs text-white/40">
                      Displayed figures are not guarantees of future results.
                    </p>
                  </div>
                </div>

                {user ? (
                  <form
                    action={async (formData) => {
                      "use server";

                      const client = await createClient();

                      const {
                        data: { user: currentUser },
                      } = await client.auth.getUser();

                      if (!currentUser) {
                        redirect("/login");
                      }

                      const amount = Number(formData.get("amount"));

                      if (
                        !Number.isFinite(amount) ||
                        amount <= 0 ||
                        amount < Number(plan.min_amount) ||
                        (plan.max_amount &&
                          amount > Number(plan.max_amount))
                      ) {
                        return;
                      }

                      const { error: requestError } =
                        await client.rpc("create_investment_request", {
                          p_plan_id: plan.id,
                          p_amount: amount,
                        });

                      if (requestError) {
                        throw new Error(requestError.message);
                      }

                      redirect("/dashboard");
                    }}
                    className="mt-7"
                  >
                    <label
                      htmlFor={`amount-${plan.id}`}
                      className="mb-2 block text-sm text-white/60"
                    >
                      Investment Amount
                    </label>

                    <input
                      id={`amount-${plan.id}`}
                      name="amount"
                      type="number"
                      min={plan.min_amount}
                      max={plan.max_amount ?? undefined}
                      step="0.01"
                      placeholder={String(plan.min_amount)}
                      required
                      className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-yellow-400"
                    />

                    <button
                      type="submit"
                      className="mt-4 w-full rounded-lg bg-yellow-400 px-5 py-3 font-bold text-slate-950 hover:bg-yellow-300"
                    >
                      Invest Now
                    </button>
                  </form>
                ) : (
                  <a
                    href="/login"
                    className="mt-7 block rounded-lg bg-yellow-400 px-5 py-3 text-center font-bold text-slate-950 hover:bg-yellow-300"
                  >
                    Sign In to Continue
                  </a>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.04] p-8">
            <h2 className="text-xl font-bold">
              Investment Plans Coming Soon
            </h2>

            <p className="mt-3 text-white/50">
              No active investment plans are currently displayed.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
