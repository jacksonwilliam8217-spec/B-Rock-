"use client";

import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

  function RegisterForm() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const urlReferralCode =
    searchParams.get("ref")?.trim().toUpperCase() || "";

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    const form = new FormData(event.currentTarget);

    const username = String(form.get("username") || "").trim();
    const fullName = String(form.get("fullName") || "").trim();
    const contact = String(form.get("contact") || "").trim();
    const email = String(form.get("email") || "").trim();
    const country = String(form.get("country") || "").trim();
    const dateOfBirth = String(form.get("dateOfBirth") || "");
    const password = String(form.get("password") || "");
    const confirmPassword = String(form.get("confirmPassword") || "");
    const referralCode =
      String(form.get("referralCode") || "").trim().toUpperCase() ||
      urlReferralCode;

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    let referredBy: string | null = null;

    if (referralCode) {
      const { data: referrerId, error: referralError } =
        await supabase.rpc("get_referrer_id", {
          p_referral_code: referralCode,
        });

      if (referralError) {
        setMessage("Unable to validate the referral code.");
        setLoading(false);
        return;
      }

      if (!referrerId) {
        setMessage("Invalid referral code.");
        setLoading(false);
        return;
      }

      referredBy = referrerId;
    }

    if (username.length < 3) {
      setMessage("Username must be at least 3 characters.");
      setLoading(false);
      return;
    }

    const { data: existingUsername, error: usernameCheckError } =
      await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .maybeSingle();

    if (usernameCheckError) {
      setMessage("Unable to check username availability.");
      setLoading(false);
      return;
    }

    if (existingUsername) {
      setMessage("That username is already taken.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name: fullName,
          contact,
          country,
          date_of_birth: dateOfBirth,
        },
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const generatedReferralCode = `BR${data.user.id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: data.user.id,
            username,
            full_name: fullName,
            email,
            contact,
            country,
            date_of_birth: dateOfBirth || null,
            referral_code: generatedReferralCode,
            referred_by: referredBy,
          },
          { onConflict: "id" }
        );

      if (profileError) {
        setMessage(
          "Account was created, but your profile could not be completed."
        );
        setLoading(false);
        return;
      }
    }

    setLoading(false);

    setMessage(
      "Account created successfully. Check your email if email confirmation is enabled."
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-md">
        <div className="mb-10 text-center">
          <a href="/" className="text-3xl font-bold text-yellow-400">
            B-Rock
          </a>

          <h1 className="mt-8 text-3xl font-bold">
            Create your account
          </h1>

          <p className="mt-3 text-white/60">
            Get started with your B-Rock account.
          </p>
        </div>

        <form
          onSubmit={handleRegister}
          className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl"
        >
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium text-white/80"
            >
              Username
            </label>

            <input
              id="username"
              name="username"
              type="text"
              required
              minLength={3}
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-yellow-400"
            />
          </div>

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
              required
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label
              htmlFor="contact"
              className="mb-2 block text-sm font-medium text-white/80"
            >
              Contact
            </label>

            <input
              id="contact"
              name="contact"
              type="tel"
              required
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-yellow-400"
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
              required
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label
              htmlFor="country"
              className="mb-2 block text-sm font-medium text-white/80"
            >
              Country
            </label>

            <input
              id="country"
              name="country"
              type="text"
              required
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label
              htmlFor="dateOfBirth"
              className="mb-2 block text-sm font-medium text-white/80"
            >
              Date of birth
            </label>

            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              required
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label
              htmlFor="referralCode"
              className="mb-2 block text-sm font-medium text-white/80"
            >
              Referral Code (Optional)
            </label>

            <input
              id="referralCode"
              name="referralCode"
              type="text"
              placeholder="Enter referral code"
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-white uppercase outline-none focus:border-yellow-400"
            />

            <p className="mt-2 text-xs text-white/40">
              If someone referred you, enter their referral code here.
            </p>
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
              required
              minLength={8}
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-yellow-400"
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
              required
              minLength={8}
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-yellow-400"
            />
          </div>

          <label className="flex items-start gap-3 text-sm text-white/60">
            <input type="checkbox" required className="mt-1" />
            <span>
              I agree to the B-Rock terms and conditions and privacy policy.
            </span>
          </label>

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
            {loading ? "Creating account..." : "Create Account"}
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

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
          <div className="mx-auto max-w-md text-center">
            <p className="text-white/60">Loading registration...</p>
          </div>
        </main>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
