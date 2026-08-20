export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="text-3xl font-bold text-yellow-400">
            B-Rock
          </div>

          <h1 className="mt-6 text-3xl font-bold">
            Welcome Back
          </h1>

          <p className="mt-2 text-white/60">
            Sign in to access your account
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-xl">
          <form className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-yellow-400"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-yellow-400"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-white/70">
                <input type="checkbox" className="accent-yellow-400" />
                Remember me
              </label>

              <button
                type="button"
                className="text-yellow-400 hover:text-yellow-300"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-yellow-400 px-5 py-3 font-bold text-slate-950 hover:bg-yellow-300"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-white/60">
            Don't have an account?{" "}
            <button className="font-semibold text-yellow-400 hover:text-yellow-300">
              Create Account
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-white/50 hover:text-yellow-400"
          >
            ← Back to B-Rock
          </a>
        </div>
      </div>
    </main>
  );
}

