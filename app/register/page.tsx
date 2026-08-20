export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="text-3xl font-bold text-yellow-400">
            B-Rock
          </div>

          <h1 className="mt-6 text-3xl font-bold">
            Create Account
          </h1>

          <p className="mt-2 text-white/60">
            Create your B-Rock account
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-xl">
          <form className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-yellow-400"
              />
            </div>

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
                placeholder="Create a password"
                className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-yellow-400"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-yellow-400"
              />
            </div>

            <label className="flex items-start gap-3 text-sm text-white/70">
              <input
                type="checkbox"
                className="mt-1 accent-yellow-400"
              />

              <span>
                I agree to the B-Rock terms and privacy policy.
              </span>
            </label>

            <button
              type="submit"
              className="w-full rounded-lg bg-yellow-400 px-5 py-3 font-bold text-slate-950 hover:bg-yellow-300"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-white/60">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-semibold text-yellow-400 hover:text-yellow-300"
            >
              Login
            </a>
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

