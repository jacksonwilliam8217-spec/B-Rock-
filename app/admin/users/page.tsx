import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import UserAccountsTable from "./UserAccountsTable";

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin" && profile?.role !== "super_admin") {
    redirect("/dashboard");
  }

  const { data: users, error } = await supabase
    .from("profiles")
    .select(
      "id, username, full_name, email, contact, country, date_of_birth, role, account_status, kyc_status, is_verified, created_at"
    )
    .order("created_at", { ascending: false });

  const totalUsers =
    users?.filter((u) => u.role === "user").length ?? 0;

  const activeUsers =
    users?.filter(
      (u) =>
        u.role === "user" &&
        u.account_status === "active"
    ).length ?? 0;

  const deactivatedUsers =
    users?.filter(
      (u) =>
        u.role === "user" &&
        u.account_status === "deactivated"
    ).length ?? 0;

  const pendingKyc =
    users?.filter(
      (u) =>
        u.role === "user" &&
        u.kyc_status === "pending"
    ).length ?? 0;

  const userRows =
    users?.filter((u) => u.role === "user") ?? [];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-white/10 bg-slate-900 px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
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
              Admin
            </a>

            <a
              href="/admin/users"
              className="font-semibold text-yellow-400"
            >
              Users
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

            <a
              href="/admin/withdrawals"
              className="text-white/70 hover:text-yellow-400"
            >
              Withdrawals
            </a>

            <a
              href="/dashboard"
              className="text-white/70 hover:text-yellow-400"
            >
              Dashboard
            </a>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div>
          <p className="text-sm text-white/50">
            Administration
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            User Accounts
          </h1>

          <p className="mt-2 text-white/50">
            View and manage registered B-Rock users.
          </p>
        </div>

        {error && (
          <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-300">
            Unable to load users: {error.message}
          </div>
        )}

        {!error && (
          <UserAccountsTable
            users={userRows}
            totalUsers={totalUsers}
            activeUsers={activeUsers}
            deactivatedUsers={deactivatedUsers}
            pendingKyc={pendingKyc}
          />
        )}
      </section>
    </main>
  );
}
