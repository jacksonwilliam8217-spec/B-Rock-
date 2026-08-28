export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-white/10 bg-slate-900 px-6 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <a href="/" className="text-2xl font-bold text-yellow-400">
            B-Rock
          </a>

          <div className="flex flex-wrap gap-5 text-sm">
            <a href="/" className="text-white/70 hover:text-yellow-400">Home</a>
            <a href="/about" className="text-yellow-400">About</a>
            <a href="/how-it-works" className="text-white/70 hover:text-yellow-400">How It Works</a>
            <a href="/investments" className="text-white/70 hover:text-yellow-400">Plans</a>
            <a href="/source-of-funds" className="text-white/70 hover:text-yellow-400">Source of Funds</a>
            <a href="/faq" className="text-white/70 hover:text-yellow-400">FAQ</a>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-wider text-yellow-400">
          About B-Rock
        </p>

        <h1 className="mt-3 max-w-4xl text-4xl font-bold sm:text-5xl">
          A clear and structured investment platform experience.
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-white/60">
          B-Rock is designed to provide a modern platform experience
          for exploring investment plans, reviewing investment activity,
          monitoring portfolio information, and managing an account.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
            <h2 className="text-xl font-bold">Our Mission</h2>
            <p className="mt-3 leading-7 text-white/60">
              Make investment information easier to understand through
              clear plans, account activity, and portfolio information.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
            <h2 className="text-xl font-bold">Transparency</h2>
            <p className="mt-3 leading-7 text-white/60">
              Users should understand what the platform displays and
              which information is simulated or illustrative.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
            <h2 className="text-xl font-bold">User Experience</h2>
            <p className="mt-3 leading-7 text-white/60">
              B-Rock brings plans, investments, deposits, messages,
              and account information together in one place.
            </p>
          </div>
        </div>

        <section className="mt-16">
          <h2 className="text-3xl font-bold">
            What you can do on B-Rock
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
              <h3 className="font-bold">Explore Plans</h3>
              <p className="mt-2 text-sm leading-6 text-white/50">
                Review available plans and their displayed terms.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
              <h3 className="font-bold">Track Investments</h3>
              <p className="mt-2 text-sm leading-6 text-white/50">
                Review investment amounts, statuses, and durations.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
              <h3 className="font-bold">Manage Deposits</h3>
              <p className="mt-2 text-sm leading-6 text-white/50">
                View deposit activity and its current status.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
              <h3 className="font-bold">Stay Informed</h3>
              <p className="mt-2 text-sm leading-6 text-white/50">
                Receive platform messages and account communications.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-16 rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-8">
          <h2 className="text-2xl font-bold text-yellow-400">
            Important Information
          </h2>

          <p className="mt-4 max-w-4xl leading-7 text-white/70">
            The current B-Rock environment contains simulated investment
            activity and performance information for platform development
            and demonstration. Simulated figures are not guaranteed
            financial returns.
          </p>

          <p className="mt-4 max-w-4xl leading-7 text-white/70">
            Any real-money investment service should accurately disclose
            its legal entity, regulatory status, jurisdictions, fees,
            risks, custody arrangements, and required disclosures.
          </p>
        </section>
      </section>
    </main>
  );
}
