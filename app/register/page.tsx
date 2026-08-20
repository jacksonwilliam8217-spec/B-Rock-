export default function RegisterPage() {
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
            Create your account
          </h1>

          <p className="mt-3 text-white/60">
            Get started with your B-Rock account.
          </p>
        </div>

        <form className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl">
          <div>
            <label
              htmlFor="fullName"
              className="mb-2 block text-sm font-medium text-white/80"
            >
              Full name
            </label>

            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              required
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-yellow-400"
            />
          </div>

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
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-white/80"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
              required
              minLength={8}
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-yellow-400"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-white/80"
            >
              Confirm password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              required
              minLength={8}
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-yellow-400"
            />
          </div>

          <label className="flex items-start gap-3 text-sm text-white/60">
            <input
              type="checkbox"
              required
              className="mt-1"
            />

            <span>
              I agree to the B-Rock terms and conditions and privacy policy.
            </span>
          </label>

          <button
            type="submit"
            className="w-full rounded-lg bg-yellow-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-yellow-300"
          >
            Create Account
          </button>

          <p className="text-center text-sm text-white/60">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-semibold text-yellow-400 hover:text-yellow-300"
            >
              Login
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
