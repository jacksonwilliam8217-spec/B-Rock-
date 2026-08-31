"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const { data, error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setError("Unable to sign in.");
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, account_status")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      await supabase.auth.signOut();
      setError("Unable to verify administrator access.");
      setLoading(false);
      return;
    }

    if (
      profile.role !== "super_admin" ||
      profile.account_status !== "active"
    ) {
      await supabase.auth.signOut();
      setError("Access denied. This account is not an active Super Admin.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 p-8 shadow-2xl border border-white/10">
        <div className="text-center mb-8">
          <div className="text-3xl font-bold text-yellow-400">
            B-Rock
          </div>

          <h1 className="mt-4 text-2xl font-bold text-white">
            Admin Login
          </h1>

          <p className="mt-2 text-sm text-white/60">
            Sign in to the B-Rock administration panel.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Admin Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-lg bg-slate-800 border border-white/10 px-4 py-3 text-white outline-none focus:border-yellow-400"
              placeholder="Enter admin email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-lg bg-slate-800 border border-white/10 px-4 py-3 text-white outline-none focus:border-yellow-400"
              placeholder="Enter admin password"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-yellow-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-yellow-300 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Admin Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-white/50">
          Authorized administrators only.
        </div>
      </div>
    </main>
  );
}
