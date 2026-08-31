"use client";
import CoinTicker from "../components/CoinTicker";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

console.log("LOGIN ERROR:", error);

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-md">
        <div className="mb-10 text-center">
          <a href="/" className="text-3xl font-bold text-yellow-400">
            B-Rock
          </a>

          <h1 className="mt-8 text-3xl font-bold">
            Welcome back
          </h1>

          <p className="mt-3 text-white/60">
            Sign in to your B-Rock account.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl"
        >
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
              placeholder="Your password"
              required
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-yellow-400"
            />
          </div>

          {message && (
            <p className="rounded-lg border border-white/10 bg-slate-900 p-3 text-sm text-white/70">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-yellow-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-sm text-white/60">
            Don't have an account?{" "}
            <a
              href="/register"
              className="font-semibold text-yellow-400 hover:text-yellow-300"
            >
              Create Account
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
