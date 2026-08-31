"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type WalletProvider = {
  request: (args: {
    method: string;
    params?: unknown[];
  }) => Promise<unknown>;
};

type Eip6963ProviderDetail = {
  info: {
    uuid: string;
    name: string;
    icon: string;
    rdns: string;
  };
  provider: WalletProvider;
};

declare global {
  interface Window {
    ethereum?: WalletProvider;
  }
}

type PaymentMethod = {
  id: string;
  name: string;
  type: string;
  asset: string | null;
  network: string | null;
  wallet_address: string | null;
  payment_details: string | null;
  instructions: string | null;
  min_amount: number | null;
  max_amount: number | null;
  confirmation_required: boolean;
  is_active: boolean;
  display_order: number;
};

export default function WalletDepositSection() {
  const supabase = createClient();

  const [walletAddress, setWalletAddress] = useState("");
  const [walletNetwork, setWalletNetwork] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] =
    useState<PaymentMethod | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [loadingMethods, setLoadingMethods] = useState(true);
  const [message, setMessage] = useState("");
  const [provider, setProvider] = useState<WalletProvider | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoadingMethods(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("wallet_address, wallet_network")
          .eq("id", user.id)
          .maybeSingle();

        if (profile?.wallet_address) {
          setWalletAddress(profile.wallet_address);
        }

        if (profile?.wallet_network) {
          setWalletNetwork(profile.wallet_network);
        }
      }

      const { data: methods, error } = await supabase
        .from("payment_methods")
        .select(
          "id, name, type, asset, network, wallet_address, payment_details, instructions, min_amount, max_amount, confirmation_required, is_active, display_order"
        )
        .eq("is_active", true)
        .eq("type", "crypto")
        .order("display_order", { ascending: true });

      if (!error && methods) {
        const usableMethods = methods.filter(
          (method) => method.wallet_address
        ) as PaymentMethod[];

        setPaymentMethods(usableMethods);

        if (usableMethods.length > 0) {
          setSelectedMethod(usableMethods[0]);
        }
      }

      setLoadingMethods(false);
    }

    loadData();
  }, []);

  useEffect(() => {
    function handleProvider(event: Event) {
      const detail = (event as CustomEvent<Eip6963ProviderDetail>).detail;

      if (!detail?.provider) return;

      const name = detail.info?.name?.toLowerCase() || "";
      const rdns = detail.info?.rdns?.toLowerCase() || "";

      if (
        name.includes("metamask") ||
        rdns.includes("metamask")
      ) {
        setProvider(detail.provider);
      } else {
        setProvider((current) => current || detail.provider);
      }
    }

    window.addEventListener(
      "eip6963:announceProvider",
      handleProvider
    );

    window.dispatchEvent(new Event("eip6963:requestProvider"));

    if (window.ethereum) {
      setProvider(window.ethereum);
    }

    return () => {
      window.removeEventListener(
        "eip6963:announceProvider",
        handleProvider
      );
    };
  }, []);

  async function connectWallet() {
    setMessage("");

    const activeProvider = provider || window.ethereum;

    if (!activeProvider) {
      setMessage(
        "MetaMask was not detected. Open B-Rock in the MetaMask mobile browser, or open the site in a browser with MetaMask installed."
      );
      return;
    }

    try {
      setConnecting(true);

      const accounts = (await activeProvider.request({
        method: "eth_requestAccounts",
      })) as string[];

      const address = accounts?.[0];

      if (!address) {
        throw new Error("No wallet address was returned.");
      }

      const chainId = (await activeProvider.request({
        method: "eth_chainId",
      })) as string;

      let network = "EVM Network";

      if (chainId === "0x2105") {
        network = "Base";
      } else if (chainId === "0x1") {
        network = "Ethereum";
      } else if (chainId === "0x89") {
        network = "Polygon";
      } else if (chainId === "0x38") {
        network = "BNB Smart Chain";
      } else if (chainId === "0xa4b1") {
        network = "Arbitrum";
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Please sign in before connecting a wallet.");
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          wallet_address: address,
          wallet_network: network,
          wallet_connected_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        throw new Error(error.message);
      }

      setWalletAddress(address);
      setWalletNetwork(network);
      setMessage("Wallet connected successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to connect wallet."
      );
    } finally {
      setConnecting(false);
    }
  }

  async function disconnectWallet() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        wallet_address: null,
        wallet_network: null,
        wallet_connected_at: null,
      })
      .eq("id", user.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setWalletAddress("");
    setWalletNetwork("");
    setMessage("Wallet disconnected.");
  }

  async function copyAddress() {
    if (!selectedMethod?.wallet_address) return;

    await navigator.clipboard.writeText(
      selectedMethod.wallet_address
    );

    setMessage("B-Rock receiving address copied.");
  }

  return (
    <section className="mt-10 space-y-6">
      <div className="rounded-3xl border border-yellow-400/20 bg-gradient-to-br from-yellow-400/10 via-white/5 to-transparent p-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-yellow-400">
          On-chain wallet
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          Connect Your Wallet
        </h2>

        <p className="mt-2 text-sm text-white/50">
          Connect your own crypto wallet to B-Rock. Your wallet
          remains your wallet; B-Rock uses the connected address
          as the sending wallet for supported on-chain deposits.
        </p>

        {walletAddress ? (
          <div className="mt-6 rounded-2xl border border-green-400/20 bg-green-400/5 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-green-400">
                  Wallet Connected
                </p>

                <p className="mt-1 break-all font-mono text-sm text-white">
                  {walletAddress}
                </p>

                <p className="mt-1 text-xs text-white/40">
                  Network: {walletNetwork || "Unknown"}
                </p>
              </div>

              <button
                type="button"
                onClick={disconnectWallet}
                className="rounded-lg border border-white/10 px-3 py-2 text-xs text-white/60 hover:text-white"
              >
                Disconnect
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={connectWallet}
            disabled={connecting}
            className="mt-6 w-full rounded-xl bg-yellow-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-yellow-300 disabled:opacity-50"
          >
            {connecting ? "Connecting..." : "Connect Wallet"}
          </button>
        )}

        {message && (
          <p className="mt-4 text-sm text-white/60">
            {message}
          </p>
        )}
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-yellow-400">
          Deposit crypto
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          Select Asset
        </h2>

        <p className="mt-2 text-sm text-white/50">
          Select the cryptocurrency and network you intend to use.
        </p>

        {loadingMethods && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/50 p-5 text-sm text-white/50">
            Loading available crypto deposit methods...
          </div>
        )}

        {!loadingMethods && paymentMethods.length === 0 && (
          <div className="mt-6 rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-5 text-sm text-yellow-300">
            No cryptocurrency deposit method is currently available.
            Please contact support.
          </div>
        )}

        {paymentMethods.length > 0 && (
          <>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setSelectedMethod(method)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    selectedMethod?.id === method.id
                      ? "border-yellow-400 bg-yellow-400/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <p className="font-semibold">
                    {method.name}
                  </p>

                  <p className="mt-1 text-xs text-white/40">
                    {method.asset || "Crypto"}
                    {method.network
                      ? ` · ${method.network}`
                      : ""}
                  </p>
                </button>
              ))}
            </div>

            {selectedMethod && (
              <div className="mt-6 rounded-2xl border border-yellow-400/20 bg-slate-950/70 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">
                      B-Rock Receiving Address
                    </p>

                    <p className="mt-1 text-xs text-white/40">
                      {selectedMethod.asset || "Crypto"}
                      {selectedMethod.network
                        ? ` · ${selectedMethod.network}`
                        : ""}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={copyAddress}
                    className="rounded-lg border border-yellow-400/30 px-3 py-2 text-xs font-semibold text-yellow-400 hover:bg-yellow-400/10"
                  >
                    Copy
                  </button>
                </div>

                <p className="mt-4 break-all rounded-xl bg-white/5 p-4 font-mono text-xs leading-6 text-white/80">
                  {selectedMethod.wallet_address}
                </p>

                {selectedMethod.instructions && (
                  <div className="mt-4 rounded-xl bg-white/5 p-4 text-sm leading-6 text-white/60">
                    {selectedMethod.instructions}
                  </div>
                )}

                <p className="mt-4 text-xs leading-5 text-yellow-400/80">
                  Send only the selected asset using the selected
                  network to this B-Rock receiving address. Sending
                  an unsupported asset or network may result in
                  permanent loss of funds.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-yellow-400">
          Note
        </p>

        <h2 className="mt-2 text-xl font-bold">
          Important information
        </h2>

        <div className="mt-4 min-h-20 rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-sm text-white/40">
          Your connected wallet is your personal sending wallet.
          The receiving address shown above is controlled by B-Rock
          through the active payment method configured by an
          administrator.
        </div>
      </div>
    </section>
  );
}
