export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-md">
        <div className="mb-10 text-center">
          <a
            href="/"
            className="text-3xl font-bold text-yellow-400"
          >
            B-Rock
          </a>

          <h1 className="mt-8 text-3xl font-bold">
            Welcome back
          </h1>

          <p className="mt-3 text-white/60">
            Sign in to access your B-Rock account.
          </p>
        </div>

        <form className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-white/80"
            >
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-yellow-400"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white/80"
              >
                Password
              </label>

              <a
                href="#"
                className="text-sm text-yellow-400 hover:text-yellow-300"
              >
                Forgot password?
              </a>
            </div>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              required
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-yellow-400"
            />
          </div>

          <label className="flex items-center gap-3 text-sm text-white/60">
            <input
              type="checkbox"
              className="h-4 w-4"
            />
            Remember me
          </label>

          <button
            type="submit"
            className="w-full rounded-lg bg-yellow-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-yellow-300"
          >
            Login
          </button>

          <p className="text-center text-sm text-white/60">
            Don't have an account?{" "}
            <a
              href="/register"
              className="font-semibold text-yellow-400 hover:text-yellow-300"
            >
              Create an account
            </a>
          </p>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-white/40 hover:text-white/70"
          >
            ← Back to B-Rock
          </a>
        </div>
      </div>
    </main>
  );
}
