export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col">
      <nav className="flex items-center justify-between px-6 py-5 md:px-10">
        <div className="text-2xl font-bold text-yellow-400">
          B-Rock
        </div>

        <a
          href="/login"
          className="rounded-lg bg-yellow-400 px-5 py-2.5 font-semibold text-slate-950 hover:bg-yellow-300"
        >
          Login
        </a>
      </nav>

      <section className="flex flex-1 items-center justify-center px-6 text-center">
        <div className="max-w-4xl">
          <h1 className="text-5xl font-extrabold tracking-tight text-yellow-400 md:text-7xl">
            Invest Smarter with B-Rock
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/80 md:text-xl">
            Grow your wealth with cutting-edge tools and expert insights
            tailored to your financial goals.
          </p>

          <button
            type="button"
            className="mt-10 rounded-xl bg-yellow-400 px-8 py-4 text-lg font-bold text-slate-950 hover:bg-yellow-300"
          >
            Get Started
          </button>
        </div>
      </section>

      <footer className="px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-white">
          N
        </div>
      </footer>
    </main>
  );
}

