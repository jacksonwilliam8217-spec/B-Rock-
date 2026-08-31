import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type Investment = {
  id: string;
  plan_id: string;
  amount: number;
  status: string;
  daily_roi: number | null;
  duration_days: number | null;
  started_at: string | null;
  created_at: string;
};

type Plan = {
  id: string;
  name: string;
};

type Deposit = {
  id: string;
  amount: number;
  status: string;
  transaction_reference: string | null;
  created_at: string;
};

type Withdrawal = {
  id: string;
  amount: number;
  status: string;
  wallet_address: string | null;
  created_at: string;
};

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

function date(value: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function statusClass(status: string | null) {
  if (status === "approved" || status === "active" || status === "verified") {
    return "bg-green-400/10 text-green-400";
  }

  if (status === "rejected" || status === "deactivated") {
    return "bg-red-400/10 text-red-400";
  }

  return "bg-yellow-400/10 text-yellow-400";
}

export default async function EditUserPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (
    adminProfile?.role !== "admin" &&
    adminProfile?.role !== "super_admin"
  ) {
    redirect("/dashboard");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(
      "id, username, full_name, email, contact, country, date_of_birth, role, account_status, kyc_status, created_at"
    )
    .eq("id", id)
    .maybeSingle();

  if (profileError || !profile) {
    redirect("/admin/users");
  }

const [
  { data: investments },
  { data: deposits },
  { data: withdrawals },
  { data: downlines },
] = await Promise.all([
    supabase
      .from("user_investments")
      .select(
        "id, plan_id, amount, status, daily_roi, duration_days, started_at, created_at"
      )
      .eq("user_id", id)
      .order("created_at", { ascending: false }),

    supabase
      .from("deposits")
      .select(
        "id, amount, status, transaction_reference, created_at"
      )
      .eq("user_id", id)
      .order("created_at", { ascending: false }),

    supabase
      .from("withdrawals")
      .select(
        "id, amount, status, wallet_address, created_at"
      )
      .eq("user_id", id)
      .order("created_at", { ascending: false }),

    supabase
      .from("profiles")
      .select(
        "id, username, full_name, email, account_status, kyc_status, created_at"
      )
      .eq("referred_by", id)
      .order("created_at", { ascending: false }),
  ]);

  const userInvestments = (investments ?? []) as Investment[];
  const userDeposits = (deposits ?? []) as Deposit[];
  const userWithdrawals = (withdrawals ?? []) as Withdrawal[];
  const userDownlines = downlines ?? [];

  const planIds = [
    ...new Set(userInvestments.map((investment) => investment.plan_id)),
  ];

  let plans: Plan[] = [];

  if (planIds.length > 0) {
    const { data: planData } = await supabase
      .from("investment_plans")
      .select("id, name")
      .in("id", planIds);

    plans = (planData ?? []) as Plan[];
  }

  const planMap = new Map(
    plans.map((plan) => [plan.id, plan.name])
  );

  const approvedDeposits = userDeposits.filter(
    (deposit) => deposit.status === "approved"
  );

  const pendingWithdrawals = userWithdrawals.filter(
    (withdrawal) => withdrawal.status === "pending"
  );

  const activeInvestments = userInvestments.filter(
    (investment) => investment.status === "active"
  );

  const completedInvestments = userInvestments.filter(
    (investment) => investment.status === "completed"
  );

  const totalDeposits = approvedDeposits.reduce(
    (total, deposit) => total + Number(deposit.amount || 0),
    0
  );

  const totalInvested = userInvestments
    .filter(
      (investment) =>
        investment.status === "active" ||
        investment.status === "completed"
    )
    .reduce(
      (total, investment) => total + Number(investment.amount || 0),
      0
    );

  const pendingWithdrawalAmount = pendingWithdrawals.reduce(
    (total, withdrawal) => total + Number(withdrawal.amount || 0),
    0
  );

  const estimatedProfit = userInvestments
    .filter(
      (investment) =>
        investment.status === "active" ||
        investment.status === "completed"
    )
    .reduce((total, investment) => {
      const amount = Number(investment.amount || 0);
      const dailyRoi = Number(investment.daily_roi || 0);
      const duration = Number(investment.duration_days || 0);

      if (amount <= 0 || dailyRoi <= 0 || duration <= 0) {
        return total;
      }

      const startDate = new Date(
        investment.started_at || investment.created_at
      );

      const now = new Date();

      const elapsedMilliseconds =
        now.getTime() - startDate.getTime();

      const elapsedDays = Math.max(
        0,
        Math.floor(
          elapsedMilliseconds / (1000 * 60 * 60 * 24)
        )
      );

      const daysEarned =
        investment.status === "completed"
          ? duration
          : Math.min(elapsedDays, duration);

      const profit =
        amount * (dailyRoi / 100) * daysEarned;

      return total + profit;
    }, 0);

  const estimatedInvestmentValue =
    totalInvested + estimatedProfit;

  async function updateUser(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/admin/login");
    }

    const { data: adminProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (
      adminProfile?.role !== "admin" &&
      adminProfile?.role !== "super_admin"
    ) {
      redirect("/dashboard");
    }

    const username = String(
      formData.get("username") || ""
    ).trim();

    const full_name = String(
      formData.get("full_name") || ""
    ).trim();

    const email = String(
      formData.get("email") || ""
    ).trim();

    const contact = String(
      formData.get("contact") || ""
    ).trim();

    const country = String(
      formData.get("country") || ""
    ).trim();

    const date_of_birth = String(
      formData.get("date_of_birth") || ""
    ).trim();

    const kyc_status = String(
      formData.get("kyc_status") || "pending"
    );

    const account_status = String(
      formData.get("account_status") || "active"
    );

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        username: username || null,
        full_name: full_name || null,
        email: email || null,
        contact: contact || null,
        country: country || null,
        date_of_birth: date_of_birth || null,
        kyc_status,
        account_status,
      })
      .eq("id", id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    redirect(`/admin/users/${id}`);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-white/10 bg-slate-900 px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/admin/users"
            className="text-2xl font-bold text-yellow-400"
          >
            B-Rock
          </Link>

          <Link
            href="/admin/users"
            className="text-sm text-white/70 hover:text-yellow-400"
          >
            ← Back to Users
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-sm text-white/50">
          Administration
        </p>

        <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              User Account
            </h1>

            <p className="mt-2 text-white/50">
              View and manage this user's complete account.
            </p>
          </div>

          <div className="flex gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClass(
                profile.account_status
              )}`}
            >
              {profile.account_status || "active"}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClass(
                profile.kyc_status
              )}`}
            >
              KYC: {profile.kyc_status || "pending"}
            </span>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/50">
              Approved Deposits
            </p>

            <p className="mt-2 text-2xl font-bold text-white">
              {money(totalDeposits)}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/50">
              Total Invested
            </p>

            <p className="mt-2 text-2xl font-bold text-white">
              {money(totalInvested)}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/50">
              Estimated Profit
            </p>

            <p className="mt-2 text-2xl font-bold text-green-400">
              {money(estimatedProfit)}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/50">
              Pending Withdrawals
            </p>

            <p className="mt-2 text-2xl font-bold text-yellow-400">
              {money(pendingWithdrawalAmount)}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-5">
          <p className="text-sm text-white/50">
            Estimated Investment Value
          </p>

          <p className="mt-2 text-3xl font-bold text-yellow-400">
            {money(estimatedInvestmentValue)}
          </p>

          <p className="mt-2 text-xs text-white/40">
            Calculated from invested capital plus estimated ROI.
            This is not a stored wallet balance.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/50">
              Active Investments
            </p>

            <p className="mt-2 text-2xl font-bold">
              {activeInvestments.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/50">
              Completed Investments
            </p>

            <p className="mt-2 text-2xl font-bold">
              {completedInvestments.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/50">
              Account Created
            </p>

            <p className="mt-2 text-xl font-bold">
              {date(profile.created_at)}
            </p>
          </div>
        </div>

        <form
          action={updateUser}
          className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <div className="mb-6">
            <h2 className="text-xl font-bold">
              Edit Profile
            </h2>

            <p className="mt-1 text-sm text-white/50">
              Update the user's account information and verification status.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm text-white/60">
                Username
              </label>

              <input
                name="username"
                type="text"
                defaultValue={profile.username || ""}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-yellow-400/50"
              />
            </div>

            <div>
              <label className="text-sm text-white/60">
                Full Name
              </label>

              <input
                name="full_name"
                type="text"
                defaultValue={profile.full_name || ""}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-yellow-400/50"
              />
            </div>

            <div>
              <label className="text-sm text-white/60">
                Email
              </label>

              <input
                name="email"
                type="email"
                defaultValue={profile.email || ""}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-yellow-400/50"
              />
            </div>

            <div>
              <label className="text-sm text-white/60">
                Contact
              </label>

              <input
                name="contact"
                type="text"
                defaultValue={profile.contact || ""}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-yellow-400/50"
              />
            </div>

            <div>
              <label className="text-sm text-white/60">
                Country
              </label>

              <input
                name="country"
                type="text"
                defaultValue={profile.country || ""}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-yellow-400/50"
              />
            </div>

            <div>
              <label className="text-sm text-white/60">
                Date of Birth
              </label>

              <input
                name="date_of_birth"
                type="date"
                defaultValue={profile.date_of_birth || ""}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-yellow-400/50"
              />
            </div>

            <div>
              <label className="text-sm text-white/60">
                KYC Status
              </label>

              <select
                name="kyc_status"
                defaultValue={profile.kyc_status || "pending"}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-yellow-400/50"
              >
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-white/60">
                Account Status
              </label>

              <select
                name="account_status"
                defaultValue={profile.account_status || "active"}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-yellow-400/50"
              >
                <option value="active">Active</option>
                <option value="deactivated">Deactivated</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/10 pt-6">
            <Link
              href="/admin/users"
              className="rounded-xl border border-white/10 px-5 py-3 text-sm text-white/60 hover:bg-white/5 hover:text-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-xl bg-yellow-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-yellow-300"
            >
              Save Changes
            </button>
          </div>
        </form>

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold">
              Investments
            </h2>

            <p className="mt-1 text-sm text-white/50">
              All investments belonging to this user.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b border-white/10 bg-slate-900">
                  <tr>
                    <th className="px-5 py-4">Plan</th>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Daily ROI</th>
                    <th className="px-5 py-4">Duration</th>
                    <th className="px-5 py-4">Started</th>
                    <th className="px-5 py-4">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {userInvestments.map((investment) => (
                    <tr
                      key={investment.id}
                      className="border-b border-white/5 last:border-0"
                    >
                      <td className="px-5 py-4 font-semibold">
                        {planMap.get(investment.plan_id) || "Unknown plan"}
                      </td>

                      <td className="px-5 py-4">
                        {money(Number(investment.amount || 0))}
                      </td>

                      <td className="px-5 py-4 text-yellow-400">
                        {Number(investment.daily_roi || 0)}%
                      </td>

                      <td className="px-5 py-4 text-white/60">
                        {investment.duration_days || 0} days
                      </td>

                      <td className="px-5 py-4 text-white/50">
                        {date(
                          investment.started_at ||
                            investment.created_at
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClass(
                            investment.status
                          )}`}
                        >
                          {investment.status}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {userInvestments.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-10 text-center text-white/40"
                      >
                        No investments found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold">
              Deposits
            </h2>

            <p className="mt-1 text-sm text-white/50">
              Deposit history for this user.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="border-b border-white/10 bg-slate-900">
                  <tr>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Reference</th>
                    <th className="px-5 py-4">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {userDeposits.map((deposit) => (
                    <tr
                      key={deposit.id}
                      className="border-b border-white/5 last:border-0"
                    >
                      <td className="px-5 py-4 font-semibold">
                        {money(Number(deposit.amount || 0))}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClass(
                            deposit.status
                          )}`}
                        >
                          {deposit.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-white/50">
                        {deposit.transaction_reference || "—"}
                      </td>

                      <td className="px-5 py-4 text-white/50">
                        {date(deposit.created_at)}
                      </td>
                    </tr>
                  ))}

                  {userDeposits.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-5 py-10 text-center text-white/40"
                      >
                        No deposits found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold">
              Withdrawals
            </h2>

            <p className="mt-1 text-sm text-white/50">
              Withdrawal history for this user.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b border-white/10 bg-slate-900">
                  <tr>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Wallet</th>
                    <th className="px-5 py-4">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {userWithdrawals.map((withdrawal) => (
                    <tr
                      key={withdrawal.id}
                      className="border-b border-white/5 last:border-0"
                    >
                      <td className="px-5 py-4 font-semibold">
                        {money(Number(withdrawal.amount || 0))}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClass(
                            withdrawal.status
                          )}`}
                        >
                          {withdrawal.status}
                        </span>
                      </td>

                      <td className="max-w-[300px] truncate px-5 py-4 text-white/50">
                        {withdrawal.wallet_address || "—"}
                      </td>

                      <td className="px-5 py-4 text-white/50">
                        {date(withdrawal.created_at)}
                      </td>
                    </tr>
                  ))}

                  {userWithdrawals.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-5 py-10 text-center text-white/40"
                      >
                        No withdrawals found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
