"use client";

import { useEffect, useState } from "react";

type Activity = {
  type: string;
  asset: string;
  amount: string;
  from: string;
  to: string;
  transactionHash: string;
  blockNumber: number;
  timestamp: number | null;
  network: string;
};

function shorten(value: string) {
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

function timeAgo(timestamp: number | null) {
  if (!timestamp) return "Recently";

  const seconds = Math.max(
    0,
    Math.floor(Date.now() / 1000) - timestamp
  );

  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export default function LiveBlockchainActivity() {
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadActivity() {
    try {
      const response = await fetch("/api/live-market", {
        cache: "no-store",
      });

      const data = await response.json();

      if (response.ok) {
        setActivity(data.activity || []);
      }
    } catch {
      // Keep the existing feed visible if a refresh temporarily fails.
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadActivity();

    const timer = setInterval(loadActivity, 15000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="border-y border-white/10 bg-slate-900/60 py-16">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
                Live
              </span>
            </div>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Live Blockchain Activity
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/55">
              Real-time public Ethereum transfer activity for USDT, USDC and
              WETH. This feed is independent of B-Rock customer deposits and
              withdrawals.
            </p>
          </div>

          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/50">
            Ethereum Mainnet
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 shadow-2xl shadow-black/20">
          {loading && activity.length === 0 ? (
            <div className="p-8 text-center text-sm text-white/40">
              Loading live blockchain activity...
            </div>
          ) : activity.length === 0 ? (
            <div className="p-8 text-center text-sm text-white/40">
              No recent transfer activity available.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {activity.map((item) => (
                <div
                  key={`${item.transactionHash}-${item.blockNumber}`}
                  className="grid gap-4 px-5 py-5 transition hover:bg-white/[0.03] sm:grid-cols-[1.2fr_1fr_1fr_auto] sm:items-center lg:px-7"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
                        ↗
                      </span>

                      <div>
                        <p className="font-semibold text-white">
                          Token Transfer
                        </p>
                        <p className="text-xs text-white/35">
                          {shorten(item.from)} → {shorten(item.to)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/35">
                      Asset
                    </p>
                    <p className="mt-1 font-bold text-yellow-400">
                      {item.asset}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/35">
                      Amount
                    </p>
                    <p className="mt-1 font-semibold text-white">
                      {item.amount} {item.asset}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-xs text-white/35">
                      {timeAgo(item.timestamp)}
                    </p>
                    <p className="mt-1 text-xs text-emerald-400">
                      Confirmed on-chain
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
