export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between border-b border-white/10 px-6 py-5 md:px-12">
        <div className="text-2xl font-bold tracking-wide text-yellow-400">
          B-Rock
        </div>

        <a
          href="/login"
          className="rounded-lg border border-yellow-400 px-5 py-2 font-semibold text-yellow-400 transition hover:bg-yellow-400 hover:text-slate-950"
        >
          Login
        </a>
      </nav>

      {/* Hero */}
      <section className="mx-auto flex min-h-[75vh] max-w-6xl items-center px-6 py-20 md:px-12">
        <div className="max-w-3xl">
          <div className="mb-6 inline-block rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-sm text-yellow-300">
            Smart tools. Clear goals. Better decisions.
          </div>

          <h1 className="text-5xl font-extrabold leading-tight md:text-7xl">
            Invest Smarter
            <span className="block text-yellow-400">with B-Rock</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65 md:text-xl">
            Explore modern investment tools and portfolio insights designed
            to help you understand your financial goals and make informed
            decisions.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="/register"
              className="rounded-lg bg-yellow-400 px-7 py-3 text-center font-bold text-slate-950 transition hover:bg-yellow-300"
            >
              Get Started
            </a>

            <a
              href="/login"
              className="rounded-lg border border-white/20 px-7 py-3 text-center font-semibold transition hover:bg-white/10"
            >
              Sign In
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-white/10 bg-slate-900/50 px-6 py-16 md:px-12">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold text-yellow-400">
              Portfolio Insights
            </h2>
            <p className="mt-3 text-white/60">
              Keep your financial information organized and easier to
              understand.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold text-yellow-400">
              Modern Dashboard
            </h2>
            <p className="mt-3 text-white/60">
              Access your account and track your portfolio from one place.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold text-yellow-400">
              Built for Clarity
            </h2>
            <p className="mt-3 text-white/60">
              Simple tools and a clean interface designed around your goals.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-white/40">
        © 2026 B-Rock. All rights reserved.
      </footer>
    </main>
  );
}

