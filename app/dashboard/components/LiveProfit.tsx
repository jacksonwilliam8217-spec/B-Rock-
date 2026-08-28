"use client";

import { useEffect, useState } from "react";

type LiveProfitProps = {
  amount: number;
  dailyRoi: number;
  durationDays: number;
  startedAt: string;
};

function money(value: number) {
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function calculate(
  amount: number,
  dailyRoi: number,
  durationDays: number,
  startedAt: string
) {
  const start = new Date(startedAt).getTime();
  const now = Date.now();

  const elapsedMilliseconds = Math.max(0, now - start);

  const durationMilliseconds =
    durationDays * 24 * 60 * 60 * 1000;

  const effectiveElapsedMilliseconds = Math.min(
    elapsedMilliseconds,
    durationMilliseconds
  );

  const elapsedDays =
    effectiveElapsedMilliseconds /
    (24 * 60 * 60 * 1000);

  const dailyProfit = amount * (dailyRoi / 100);

  const accruedProfit = dailyProfit * elapsedDays;

  const totalValue = amount + accruedProfit;

  return {
    dailyProfit,
    accruedProfit,
    totalValue,
  };
}

export default function LiveProfit({
  amount,
  dailyRoi,
  durationDays,
  startedAt,
}: LiveProfitProps) {
  const [values, setValues] = useState(() =>
    calculate(
      amount,
      dailyRoi,
      durationDays,
      startedAt
    )
  );

  useEffect(() => {
    const update = () => {
      setValues(
        calculate(
          amount,
          dailyRoi,
          durationDays,
          startedAt
        )
      );
    };

    update();

    const timer = setInterval(update, 1000);

    return () => clearInterval(timer);
  }, [
    amount,
    dailyRoi,
    durationDays,
    startedAt,
  ]);

  return (
    <div className="mt-6 rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-4">
      <div className="mb-4">
        <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-semibold text-yellow-400">
          SIMULATED PERFORMANCE
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-sm text-white/50">
            Daily Profit
          </p>

          <p className="mt-1 font-semibold">
            {money(values.dailyProfit)}
          </p>
        </div>

        <div>
          <p className="text-sm text-white/50">
            Simulated Accrued Profit
          </p>

          <p className="mt-1 font-semibold text-green-400">
            {money(values.accruedProfit)}
          </p>
        </div>

        <div>
          <p className="text-sm text-white/50">
            Simulated Total Value
          </p>

          <p className="mt-1 font-semibold">
            {money(values.totalValue)}
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs leading-5 text-white/40">
        This is a simulated performance calculation based on
        the configured ROI and elapsed time. It does not
        represent a credited or guaranteed financial return.
      </p>
    </div>
  );
}

