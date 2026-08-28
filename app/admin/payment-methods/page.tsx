import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function PaymentMethodsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  const { data: paymentMethods, error } = await supabase
    .from("payment_methods")
    .select(`
      id,
      name,
      type,
      asset,
      network,
      wallet_address,
      payment_details,
      instructions,
      min_amount,
      max_amount,
      confirmation_required,
      is_active,
      display_order
    `)
    .order("display_order", { ascending: true });

  async function updatePaymentMethod(formData: FormData) {
    "use server";

    const client = await createClient();

    const {
      data: { user: adminUser },
    } = await client.auth.getUser();

    if (!adminUser) {
      redirect("/login");
    }

    const { data: adminProfile } = await client
      .from("profiles")
      .select("role")
      .eq("id", adminUser.id)
      .maybeSingle();

    if (!adminProfile || adminProfile.role !== "admin") {
      throw new Error("Administrator access required.");
    }

    const id = String(formData.get("id") || "");
    const name = String(formData.get("name") || "").trim();
    const type = String(formData.get("type") || "").trim();
    const asset = String(formData.get("asset") || "").trim() || null;
    const network = String(formData.get("network") || "").trim() || null;
    const walletAddress =
      String(formData.get("wallet_address") || "").trim() || null;
    const paymentDetails =
      String(formData.get("payment_details") || "").trim() || null;
    const instructions =
      String(formData.get("instructions") || "").trim() || null;

    const minAmountRaw = String(formData.get("min_amount") || "").trim();
    const maxAmountRaw = String(formData.get("max_amount") || "").trim();

    const minAmount =
      minAmountRaw === "" ? 1 : Number(minAmountRaw);

    const maxAmount =
      maxAmountRaw === "" ? null : Number(maxAmountRaw);

    const isActive = formData.get("is_active") === "on";
    const confirmationRequired =
      formData.get("confirmation_required") === "on";

    if (!id || !name) {
      throw new Error("Payment method name is required.");
    }

    if (
      !["crypto", "bank_transfer", "gift_card"].includes(type)
    ) {
      throw new Error("Invalid payment method type.");
    }

    if (!Number.isFinite(minAmount) || minAmount <= 0) {
      throw new Error("Minimum amount must be greater than zero.");
    }

    if (
      maxAmount !== null &&
      (!Number.isFinite(maxAmount) || maxAmount <= 0)
    ) {
      throw new Error("Maximum amount must be valid.");
    }

    if (
      maxAmount !== null &&
      maxAmount < minAmount
    ) {
      throw new Error(
        "Maximum amount cannot be lower than minimum amount."
      );
    }

    const { error: updateError } = await client
      .from("payment_methods")
      .update({
        name,
        type,
        asset,
        network,
        wallet_address: walletAddress,
        payment_details: paymentDetails,
        instructions,
        min_amount: minAmount,
        max_amount: maxAmount,
        is_active: isActive,
        confirmation_required: confirmationRequired,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    redirect("/admin/payment-methods");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-white/10 bg-slate-900 px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
          <a
            href="/admin"
            className="text-2xl font-bold text-yellow-400"
          >
            B-Rock Admin
          </a>

          <div className="flex flex-wrap gap-5 text-sm">
            <a
              href="/admin"
              className="text-white/70 hover:text-yellow-400"
            >
              Overview
            </a>

            <a
              href="/admin/deposits"
              className="text-white/70 hover:text-yellow-400"
            >
              Deposits
            </a>

            <a
              href="/admin/investments"
              className="text-white/70 hover:text-yellow-400"
            >
              Investments
            </a>

            <a
              href="/admin/messages"
              className="text-white/70 hover:text-yellow-400"
            >
              Messages
            </a>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm text-yellow-400">
            Finance Configuration
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Payment Methods
          </h1>

          <p className="mt-2 max-w-3xl text-white/50">
            Configure the payment methods available to users.
            You can activate or deactivate methods and update
            receiving addresses, instructions, limits and other
            payment information.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
            Unable to load payment methods: {error.message}
          </div>
        )}

        <div className="space-y-6">
          {paymentMethods?.map((method) => (
            <form
              key={method.id}
              action={updatePaymentMethod}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <input
                type="hidden"
                name="id"
                value={method.id}
              />

              <div className="flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-semibold">
                      {method.name}
                    </h2>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        method.is_active
                          ? "bg-green-500/10 text-green-300"
                          : "bg-white/10 text-white/50"
                      }`}
                    >
                      {method.is_active
                        ? "ACTIVE"
                        : "OFF"}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-white/40">
                    {method.type}
                    {method.asset
                      ? ` • ${method.asset}`
                      : ""}
                    {method.network
                      ? ` • ${method.network}`
                      : ""}
                  </p>
                </div>

                <label className="flex cursor-pointer items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    name="is_active"
                    defaultChecked={method.is_active}
                    className="h-5 w-5 accent-yellow-400"
                  />
                  Enable payment method
                </label>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-white/60">
                    Payment Method Name
                  </label>

                  <input
                    name="name"
                    defaultValue={method.name}
                    className="w-full rounded-xl bg-slate-900 p-3 text-white ring-1 ring-white/10"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/60">
                    Type
                  </label>

                  <select
                    name="type"
                    defaultValue={method.type}
                    className="w-full rounded-xl bg-slate-900 p-3 text-white ring-1 ring-white/10"
                  >
                    <option value="crypto">
                      Cryptocurrency
                    </option>

                    <option value="bank_transfer">
                      Bank Transfer
                    </option>

                    <option value="gift_card">
                      Gift Card
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/60">
                    Asset / Currency
                  </label>

                  <input
                    name="asset"
                    defaultValue={method.asset ?? ""}
                    placeholder="USDT, BTC, ETH, GBP..."
                    className="w-full rounded-xl bg-slate-900 p-3 text-white placeholder:text-white/30 ring-1 ring-white/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/60">
                    Network
                  </label>

                  <input
                    name="network"
                    defaultValue={method.network ?? ""}
                    placeholder="TRC20, ERC20, Bitcoin..."
                    className="w-full rounded-xl bg-slate-900 p-3 text-white placeholder:text-white/30 ring-1 ring-white/10"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm text-white/60">
                    Company Receiving Wallet Address
                  </label>

                  <input
                    name="wallet_address"
                    defaultValue={method.wallet_address ?? ""}
                    placeholder="Enter the public receiving wallet address"
                    className="w-full rounded-xl bg-slate-900 p-3 text-white placeholder:text-white/30 ring-1 ring-white/10"
                  />

                  <p className="mt-2 text-xs text-white/40">
                    Never enter a private key or seed phrase here.
                    Only use the public receiving address.
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm text-white/60">
                    Payment Details
                  </label>

                  <textarea
                    name="payment_details"
                    defaultValue={
                      method.payment_details ?? ""
                    }
                    rows={4}
                    placeholder="Bank details, payment information, or other instructions..."
                    className="w-full rounded-xl bg-slate-900 p-3 text-white placeholder:text-white/30 ring-1 ring-white/10"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm text-white/60">
                    User Instructions
                  </label>

                  <textarea
                    name="instructions"
                    defaultValue={
                      method.instructions ?? ""
                    }
                    rows={4}
                    placeholder="Instructions displayed to users..."
                    className="w-full rounded-xl bg-slate-900 p-3 text-white placeholder:text-white/30 ring-1 ring-white/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/60">
                    Minimum Amount
                  </label>

                  <input
                    name="min_amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    defaultValue={method.min_amount ?? 1}
                    className="w-full rounded-xl bg-slate-900 p-3 text-white ring-1 ring-white/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/60">
                    Maximum Amount
                  </label>

                  <input
                    name="max_amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    defaultValue={method.max_amount ?? ""}
                    placeholder="No maximum"
                    className="w-full rounded-xl bg-slate-900 p-3 text-white placeholder:text-white/30 ring-1 ring-white/10"
                  />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
                <label className="flex cursor-pointer items-center gap-3 text-sm text-white/60">
                  <input
                    type="checkbox"
                    name="confirmation_required"
                    defaultChecked={
                      method.confirmation_required
                    }
                    className="h-5 w-5 accent-yellow-400"
                  />
                  Require finance review
                </label>

                <button
                  type="submit"
                  className="rounded-xl bg-yellow-400 px-5 py-3 font-bold text-slate-950 hover:bg-yellow-300"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ))}
        </div>

        {!paymentMethods?.length && !error && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/50">
            No payment methods configured.
          </div>
        )}
      </section>
    </main>
  );
}
