export default function HowItWorksPage() {
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

          <div className="flex flex-wrap items-center gap-5 text-sm">
            <a
              href="/about"
              className="text-white/70 hover:text-yellow-400"
            >
              About
            </a>

            <a
              href="/how-it-works"
              className="text-yellow-400"
            >
              How It Works
            </a>

            <a
              href="/investments"
              className="text-white/70 hover:text-yellow-400"
            >
              Opportunities
            </a>

            <a
              href="/faq"
              className="text-white/70 hover:text-yellow-400"
            >
              FAQ
            </a>

            <a
              href="/login"
              className="rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-slate-950 hover:bg-yellow-300"
            >
              Login
            </a>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-400">
            How B-Rock Works
          </p>

          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">
            A straightforward way to manage your investment journey.
          </h1>

          <p className="mt-6 text-lg leading-8 text-white/60">
            B-Rock brings account management, investment opportunities,
            portfolio information, transactions, and communications together
            in one digital experience.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
            <p className="text-sm font-semibold text-yellow-400">01</p>
            <h2 className="mt-4 text-2xl font-bold">
              Create your account
            </h2>
            <p className="mt-3 leading-7 text-white/60">
              Register for a B-Rock account and provide the information
              required to establish your profile.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
            <p className="text-sm font-semibold text-yellow-400">02</p>
            <h2 className="mt-4 text-2xl font-bold">
              Verify your identity
            </h2>
            <p className="mt-3 leading-7 text-white/60">
              Where required, identity and account information can be
              reviewed through appropriate verification procedures.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
            <p className="text-sm font-semibold text-yellow-400">03</p>
            <h2 className="mt-4 text-2xl font-bold">
              Review opportunities
            </h2>
            <p className="mt-3 leading-7 text-white/60">
              Explore available investment categories and review their
              stated terms, fees, risks, and eligibility requirements.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
            <p className="text-sm font-semibold text-yellow-400">04</p>
            <h2 className="mt-4 text-2xl font-bold">
              Fund your account
            </h2>
            <p className="mt-3 leading-7 text-white/60">
              Where funding is available, deposits are recorded against
              your account and associated with the applicable transaction.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
            <p className="text-sm font-semibold text-yellow-400">05</p>
            <h2 className="mt-4 text-2xl font-bold">
              Monitor your portfolio
            </h2>
            <p className="mt-3 leading-7 text-white/60">
              Use your dashboard to review investment activity, balances,
              transactions, account information, and portfolio performance.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
            <p className="text-sm font-semibold text-yellow-400">06</p>
            <h2 className="mt-4 text-2xl font-bold">
              Manage your account
            </h2>
            <p className="mt-3 leading-7 text-white/60">
              Manage your profile, security settings, communications,
              deposits, withdrawals, and other available account services.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-yellow-400">
              Portfolio Management
            </p>

            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Everything in one account.
            </h2>

            <p className="mt-4 leading-7 text-white/60">
              Your B-Rock account is designed to provide a centralized view
              of your investment activity and account information.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-4">
            <div className="rounded-xl border border-white/10 bg-slate-900 p-5">
              <h3 className="font-semibold">Portfolio</h3>
              <p className="mt-2 text-sm text-white/50">
                Review portfolio information and investment activity.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-slate-900 p-5">
              <h3 className="font-semibold">Transactions</h3>
              <p className="mt-2 text-sm text-white/50">
                Review deposits, withdrawals, and transaction history.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-slate-900 p-5">
              <h3 className="font-semibold">Messages</h3>
              <p className="mt-2 text-sm text-white/50">
                Keep account communications in one central location.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-slate-900 p-5">
              <h3 className="font-semibold">Security</h3>
              <p className="mt-2 text-sm text-white/50">
                Manage authentication and available account-security
                controls.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h2 className="text-3xl font-bold">
          Start exploring B-Rock
        </h2>

        <p className="mt-4 leading-7 text-white/60">
          Explore the available opportunities or create an account to
          access the platform's account features.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <a
            href="/investments"
            className="rounded-xl bg-yellow-400 px-6 py-3 font-bold text-slate-950 hover:bg-yellow-300"
          >
            Explore Opportunities
          </a>

          <a
            href="/register"
            className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold hover:bg-white/10"
          >
            Create Account
          </a>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-white/40">
        <p>
          © 2026 B-Rock. All rights reserved.
        </p>

        <div className="mt-4 flex flex-wrap justify-center gap-5">
          <a href="/about" className="hover:text-white">
            About
          </a>

          <a href="/source-of-funds" className="hover:text-white">
            Source of Funds
          </a>

          <a href="/faq" className="hover:text-white">
            FAQ
          </a>
        </div>

        <p className="mx-auto mt-6 max-w-3xl leading-6">
          Before offering real-money financial services, B-Rock should
          accurately disclose its legal entity, regulatory status,
          jurisdictions, fees, risks, custody arrangements, and applicable
          investor protections.
        </p>
      </footer>
    </main>
  );
}
