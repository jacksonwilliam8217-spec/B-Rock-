export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="flex items-center justify-between border-b border-white/10 px-6 py-5 md:px-12">
        <a href="/" className="text-2xl font-bold text-yellow-400">
          B-Rock
        </a>

        <a
          href="/login"
          className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/10"
        >
          Sign Out
        </a>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-10 md:px-12">
        <div>
          <p className="text-sm text-white/50">Account dashboard</p>

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            Welcome to B-Rock
          </h1>

          <p className="mt-3 text-white/60">
            Manage your account and review your portfolio information.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-white/50">Account Status</p>
            <p className="mt-3 text-2xl font-bold text-yellow-400">
              Active
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-white/50">Portfolio</p>
            <p className="mt-3 text-2xl font-bold">
              Demo Account
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-white/50">Last Activity</p>
            <p className="mt-3 text-2xl font-bold">
              Today
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-bold">Dashboard Overview</h2>

          <p className="mt-3 leading-7 text-white/60">
            This is a development dashboard. Real account balances,
            transactions, identity verification, deposits, withdrawals,
            and investment activity should only be connected after
            secure backend infrastructure and appropriate compliance
            requirements are in place.
          </p>
        </div>
      </section>
    </main>
  );
}
