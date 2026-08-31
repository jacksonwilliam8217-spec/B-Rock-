import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function WithdrawalsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, email")
    .eq("id", user.id)
    .maybeSingle();

  const { data: methods, error: methodsError } = await supabase
    .from("withdrawal_methods")
    .select(
      "id, name, type, asset, network, is_active, connect_wallet_enabled, min_amount, max_amount, fee, processing_time, instructions"
    )
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  async function submitWithdrawal(formData: FormData) {
    "use server";

    const client = await createClient();

    const {
      data: { user: currentUser },
    } = await client.auth.getUser();

    if (!currentUser) {
      redirect("/login");
    }

    const methodId = String(formData.get("method_id") || "");
    const amount = Number(formData.get("amount"));
    const walletAddress = String(
      formData.get("wallet_address") || ""
    ).trim();
    const paymentDetails = String(
      formData.get("payment_details") || ""
    ).trim();

    const { data: kycEnabled, error: kycSettingError } =
      await client.rpc("get_kyc_enabled");

    if (kycSettingError) {
      throw new Error(kycSettingError.message);
    }

    if (kycEnabled) {
      const { data: kycProfile, error: kycProfileError } =
        await client
          .from("profiles")
          .select("kyc_status")
                    .eq("id", currentUser.id)
          .maybeSingle();

      if (kycProfileError) {
        throw new Error(kycProfileError.message);
      }

      if (kycProfile?.kyc_status !== "verified") {
        throw new Error(
          "KYC verification is required before you can submit a withdrawal."
        );
      }
    }

    if (!methodId) {
      throw new Error("Please select a withdrawal method.");
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Please enter a valid withdrawal amount.");
    }

    const { data: method, error: methodError } = await client
      .from("withdrawal_methods")
      .select(
        "id, name, type, min_amount, max_amount, is_active, connect_wallet_enabled"
      )
      .eq("id", methodId)
      .eq("is_active", true)
      .maybeSingle();

    if (methodError) {
      throw new Error(methodError.message);
    }

    if (!method) {
      throw new Error("This withdrawal method is not available.");
    }

    if (amount < Number(method.min_amount)) {
      throw new Error(
        `The minimum withdrawal is ${Number(
          method.min_amount
        ).toLocaleString()}.`
      );
    }

    if (
      method.max_amount !== null &&
      amount > Number(method.max_amount)
    ) {
      throw new Error(
        `The maximum withdrawal is ${Number(
          method.max_amount
        ).toLocaleString()}.`
      );
    }

    if (method.type === "crypto" && !walletAddress) {
      throw new Error(
        "Please connect a wallet or enter a public receiving address."
      );
    }

    if (method.type !== "crypto" && !paymentDetails) {
      throw new Error(
        "Please enter the required payment details."
      );
    }

    const { error: insertError } = await client
      .from("withdrawals")
      .insert({
        user_id: currentUser.id,
        withdrawal_method_id: methodId,
        amount,
        wallet_address:
          method.type === "crypto" ? walletAddress : null,
        payment_details:
          method.type !== "crypto" ? paymentDetails : null,
        status: "pending",
      });

    if (insertError) {
      throw new Error(insertError.message);
    }

    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-white/10 bg-slate-900 px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <a
            href="/"
            className="text-2xl font-bold text-yellow-400"
          >
            B-Rock
          </a>

          <div className="flex flex-wrap gap-5 text-sm">
            <a
              href="/dashboard"
              className="text-white/70 hover:text-white"
            >
              Dashboard
            </a>

            <a
              href="/investments"
              className="text-white/70 hover:text-white"
            >
              Investment Plans
            </a>

            <a
              href="/messages"
              className="text-white/70 hover:text-white"
            >
              Messages
            </a>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-sm uppercase tracking-widest text-yellow-400">
          Account
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Withdraw Funds
        </h1>

        <p className="mt-3 text-white/50">
          Welcome, {profile?.username || "User"}. Select an
          available withdrawal method and submit your request
          for review.
        </p>

        {methodsError && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
            Unable to load withdrawal methods:{" "}
            {methodsError.message}
          </div>
        )}

        {!methods || methods.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold">
              No withdrawal methods available
            </h2>

            <p className="mt-2 text-sm text-white/50">
              The finance team has not enabled a withdrawal
              method yet.
            </p>
          </div>
        ) : (
          <form
            action={submitWithdrawal}
            className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <label
              htmlFor="method_id"
              className="mb-2 block text-sm text-white/60"
            >
              Withdrawal Method
            </label>

            <select
              id="method_id"
              name="method_id"
              required
              className="w-full rounded-xl bg-slate-900 p-3 text-white ring-1 ring-white/10"
            >
              <option value="">
                Select withdrawal method
              </option>

              {methods.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.name}
                  {method.network
                    ? ` — ${method.network}`
                    : ""}
                </option>
              ))}
            </select>

            <div className="mt-5">
              <label
                htmlFor="amount"
                className="mb-2 block text-sm text-white/60"
              >
                Withdrawal Amount
              </label>

              <input
                id="amount"
                name="amount"
                type="number"
                min="1"
                step="0.01"
                placeholder="100"
                required
                className="w-full rounded-xl bg-slate-900 p-3 text-white placeholder:text-white/30 ring-1 ring-white/10"
              />
            </div>

            <div className="mt-5">
              <label
                htmlFor="wallet_address"
                className="mb-2 block text-sm text-white/60"
              >
                Crypto Receiving Address
              </label>

              <input
                id="wallet_address"
                name="wallet_address"
                type="text"
                placeholder="Enter your public wallet address"
                className="w-full rounded-xl bg-slate-900 p-3 text-white placeholder:text-white/30 ring-1 ring-white/10"
              />

              <button
                type="button"
                className="mt-3 rounded-xl border border-yellow-400/40 px-4 py-2 text-sm font-semibold text-yellow-400 hover:bg-yellow-400/10"
              >
                Connect Wallet
              </button>

              <p className="mt-2 text-xs text-white/40">
                Crypto withdrawals use a public receiving
                address. Never enter a private key or seed phrase.
              </p>
            </div>

            <div className="mt-5">
              <label
                htmlFor="payment_details"
                className="mb-2 block text-sm text-white/60"
              >
                Bank / Gift Card Details
              </label>

              <textarea
                id="payment_details"
                name="payment_details"
                rows={4}
                placeholder="Enter the payment details required for this method."
                className="w-full rounded-xl bg-slate-900 p-3 text-white placeholder:text-white/30 ring-1 ring-white/10"
              />
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-xl bg-yellow-400 px-5 py-3 font-bold text-slate-950 hover:bg-yellow-300"
            >
              Submit Withdrawal Request
            </button>

            <p className="mt-4 text-center text-xs text-white/40">
              Your request will remain pending until reviewed by
              the finance team.
            </p>
          </form>
        )}
      </section>
    </main>
  );
}
