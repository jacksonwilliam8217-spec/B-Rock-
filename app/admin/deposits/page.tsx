import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminDepositsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: isAdmin, error: adminError } =
    await supabase.rpc("is_admin");

  if (adminError || isAdmin !== true) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        <h1 className="text-2xl font-bold text-red-400">
          Access Denied
        </h1>

        <p className="mt-3 text-white/60">
          Admin access is required.
        </p>
      </main>
    );
  }

  const { data: deposits, error } = await supabase
    .from("deposits")
    .select(
      "id, user_id, investment_id, amount, status, created_at"
    )
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        <h1 className="text-2xl font-bold text-red-400">
          Database Error
        </h1>

        <p className="mt-3">
          {error.message}
        </p>
      </main>
    );
  }

  async function reviewDeposit(formData: FormData) {
    "use server";

    const client = await createClient();

    const {
      data: { user: currentUser },
    } = await client.auth.getUser();

    if (!currentUser) {
      redirect("/login");
    }

    const { data: admin } =
      await client.rpc("is_admin");

    if (!admin) {
      throw new Error("Admin access required.");
    }

    const depositId = String(
      formData.get("deposit_id") || ""
    );

    const action = String(
      formData.get("action") || ""
    );

    if (!depositId) {
      throw new Error("Deposit ID is required.");
    }

    if (
      action !== "approve" &&
      action !== "reject"
    ) {
      throw new Error("Invalid deposit action.");
    }

    const { error: reviewError } =
      await client.rpc("admin_review_deposit", {
        p_deposit_id: depositId,
        p_action: action,
      });

    if (reviewError) {
      throw new Error(reviewError.message);
    }

    redirect("/admin/deposits");
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
              href="/admin"
              className="text-white/70 hover:text-yellow-400"
            >
              Admin Dashboard
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
              className="text-yellow-400"
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
        <p className="text-sm text-white/50">
          Administration
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Deposit Management
        </h1>

        <p className="mt-2 text-white/50">
          Review simulated deposit requests.
        </p>

        <div className="mt-8 space-y-5">
          {deposits?.map((deposit) => (
            <div
              key={deposit.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-white/40">
                    Deposit Amount
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    $
                    {Number(
                      deposit.amount
                    ).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-sm capitalize text-yellow-400">
                  {deposit.status}
                </span>
              </div>

              <div className="mt-5 space-y-2 text-sm text-white/60">
                <p>
                  User ID: {deposit.user_id}
                </p>

                <p>
                  Investment ID:{" "}
                  {deposit.investment_id}
                </p>

                <p>
                  Requested:{" "}
                  {new Date(
                    deposit.created_at
                  ).toLocaleString()}
                </p>
              </div>

              {deposit.status === "pending" && (
                <form
                  action={reviewDeposit}
                  className="mt-6 flex gap-3"
                >
                  <input
                    type="hidden"
                    name="deposit_id"
                    value={deposit.id}
                  />

                  <button
                    type="submit"
                    name="action"
                    value="approve"
                    className="rounded-xl bg-green-500 px-5 py-3 font-bold text-white hover:bg-green-400"
                  >
                    Approve
                  </button>

                  <button
                    type="submit"
                    name="action"
                    value="reject"
                    className="rounded-xl bg-red-500 px-5 py-3 font-bold text-white hover:bg-red-400"
                  >
                    Reject
                  </button>
                </form>
              )}
            </div>
          ))}

          {(!deposits ||
            deposits.length === 0) && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white/60">
              No deposits found.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
