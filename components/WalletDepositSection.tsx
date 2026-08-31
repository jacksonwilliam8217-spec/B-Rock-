"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type WalletProvider = {
  request: (args: {
    method: string;
    params?: unknown[];
  }) => Promise<unknown>;
};

declare global {
  interface Window {
    ethereum?: WalletProvider;
  }
}

type CryptoOption = {
  id: string;
  name: string;
  network: string;
  symbol: string;
  address: string;
};

const cryptoOptions: CryptoOption[] = [
  {
    id: "btc",
    name: "Bitcoin",
    network: "Bitcoin",
    symbol: "BTC",
    address:
      "bc1qwnjx26qkxpd6zcmmc6y3yaxu00l7kdtjd3z8pr",
  },
  {
    id: "lightning",
    name: "Bitcoin Lightning",
    network: "Lightning",
    symbol: "BTC",
    address:
      "femininesociology9268@cake.cash",
  },
  {
    id: "xmr",
    name: "Monero",
    network: "Monero",
    symbol: "XMR",
    address:
      "8BqqN66J1ejBhDtzawYPFuNZbj7Fn9XHs7jsJ9NsSYbfhjxkubwnjuPEjXT1j1bDPcDXasF1VTMQdJsNT9RFsfxgQ49X3QS",
  },
  {
    id: "zec",
    name: "Zcash",
    network: "Zcash",
    symbol: "ZEC",
    address:
      "u1fcz8m2qk45fh09jgczdq7k52v4myv5d7mg2wjsn9gutmajpdcvyth8333waqhls0zkzwm6cl36as4w0yt4fzfdmm0wn44uq6xv6rfgus",
  },
  {
    id: "base-eth",
    name: "Ethereum",
    network: "Base",
    symbol: "ETH",
    address:
      "0xD9961287d13De45B2F32c73d2925D5286de2332C",
  },
  {
    id: "base-usdc",
    name: "USD Coin",
    network: "Base",
    symbol: "USDC",
    address:
      "0xD9961287d13De45B2F32c73d2925D5286de2332C",
  },
  {
    id: "base-usdt",
    name: "Tether USD",
    network: "Base",
    symbol: "USDT",
    address:
      "0xD9961287d13De45B2F32c73d2925D5286de2332C",
  },
  {
    id: "tron-trx",
    name: "TRON",
    network: "TRON",
    symbol: "TRX",
    address:
      "TUqSumPbK1ENbzMmqs7CxH1TWrBYuc8fQk",
  },
  {
    id: "tron-usdt",
    name: "Tether USD",
    network: "TRON",
    symbol: "USDT",
    address:
      "TUqSumPbK1ENbzMmqs7CxH1TWrBYuc8fQk",
  },
];

const wallets = [
  "MetaMask",
  "Bitget Wallet",
  "Trust Wallet",
  "Coinbase Wallet",
  "Phantom",
  "OKX Wallet",
  "Exodus",
  "WalletConnect",
];

export default function WalletDepositSection() {
  const supabase = createClient();

  const [walletAddress, setWalletAddress] = useState("");
  const [walletNetwork, setWalletNetwork] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState(
    cryptoOptions[0]
  );
  const [connecting, setConnecting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadWallet() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("wallet_address, wallet_network")
        .eq("id", user.id)
        .maybeSingle();

      if (data?.wallet_address) {
        setWalletAddress(data.wallet_address);
      }

      if (data?.wallet_network) {
        setWalletNetwork(data.wallet_network);
      }
    }

    loadWallet();
  }, []);

  async function connectWallet() {
    setMessage("");

    if (!window.ethereum) {
      setMessage(
        "No compatible browser wallet was detected. Open B-Rock inside your wallet app or install a compatible wallet."
      );
      return;
    }

    try {
      setConnecting(true);

      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];

      const address = accounts?.[0];

      if (!address) {
        throw new Error("No wallet address was returned.");
      }

      const chainId = (await window.ethereum.request({
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
    await navigator.clipboard.writeText(selectedCrypto.address);
    setMessage("Receiving address copied.");
  }

  return (
    <section className="mt-10 space-y-6">
      <div className="rounded-3xl border border-yellow-400/20 bg-gradient-to-br from-yellow-400/10 via-white/5 to-transparent p-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-yellow-400">
            On-chain wallet
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Connect Wallet
          </h2>

          <p className="mt-2 text-sm text-white/50">
            Connect a compatible crypto wallet to use your wallet
            with B-Rock.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {wallets.map((wallet) => (
            <button
              key={wallet}
              type="button"
              onClick={connectWallet}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-yellow-400/40 hover:bg-white/10"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-sm font-bold text-yellow-400">
                {wallet
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2)}
              </div>

              <p className="mt-3 text-sm font-semibold">
                {wallet}
              </p>

              <p className="mt-1 text-xs text-white/40">
                Connect
              </p>
            </button>
          ))}
        </div>

        {walletAddress && (
          <div className="mt-6 rounded-2xl border border-green-400/20 bg-green-400/5 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-green-400">
                  Connected
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
        )}

        {message && (
          <p className="mt-4 text-sm text-white/60">
            {message}
          </p>
        )}

        {!walletAddress && (
          <button
            type="button"
            onClick={connectWallet}
            disabled={connecting}
            className="mt-6 w-full rounded-xl bg-yellow-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-yellow-300 disabled:opacity-50"
          >
            {connecting ? "Connecting..." : "Connect Wallet"}
          </button>
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

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cryptoOptions.map((crypto) => (
            <button
              key={crypto.id}
              type="button"
              onClick={() => setSelectedCrypto(crypto)}
              className={`rounded-2xl border p-4 text-left transition ${
                selectedCrypto.id === crypto.id
                  ? "border-yellow-400 bg-yellow-400/10"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              <p className="font-semibold">
                {crypto.name}
              </p>

              <p className="mt-1 text-xs text-white/40">
                {crypto.symbol} · {crypto.network}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/70 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">
                Receiving address
              </p>

              <p className="mt-1 text-xs text-white/40">
                {selectedCrypto.name} · {selectedCrypto.network}
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
            {selectedCrypto.address}
          </p>

          <p className="mt-4 text-xs leading-5 text-yellow-400/80">
            Send only {selectedCrypto.symbol} using the
            {selectedCrypto.network} network to this address.
            Sending an unsupported asset or network may result in
            permanent loss of funds.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-yellow-400">
          Note
        </p>

        <h2 className="mt-2 text-xl font-bold">
          Important information
        </h2>

        <div className="mt-4 min-h-20 rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-sm text-white/40">
          Your account note will appear here.
        </div>
      </div>
    </section>
  );
}
