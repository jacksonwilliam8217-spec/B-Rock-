"use client";

type UserAnalyticsProps = {
  totalUsers: number;
  activeUsers: number;
  deactivatedUsers: number;
  pendingKyc: number;
  selected: string;
  onSelect: (id: string) => void;
};

export default function UserAnalytics({
  totalUsers,
  activeUsers,
  deactivatedUsers,
  pendingKyc,
  selected,
  onSelect,
}: UserAnalyticsProps) {
  const cards = [
    {
      id: "all",
      label: "Total Users",
      value: totalUsers,
      valueClass: "text-white",
    },
    {
      id: "active",
      label: "Active Users",
      value: activeUsers,
      valueClass: "text-green-400",
    },
    {
      id: "deactivated",
      label: "Deactivated",
      value: deactivatedUsers,
      valueClass: "text-red-400",
    },
    {
      id: "kyc",
      label: "KYC Pending",
      value: pendingKyc,
      valueClass: "text-yellow-400",
    },
  ];

  return (
    <div className="mt-8 grid gap-4 md:grid-cols-4">
      {cards.map((card) => (
        <button
          key={card.id}
          type="button"
          onClick={() => onSelect(card.id)}
          className={`rounded-2xl border p-5 text-left transition ${
            selected === card.id
              ? "border-yellow-400/50 bg-yellow-400/10"
              : "border-white/10 bg-white/5 hover:border-yellow-400/30 hover:bg-white/10"
          }`}
        >
          <p className="text-sm text-white/50">
            {card.label}
          </p>

          <p
            className={`mt-2 text-3xl font-bold ${card.valueClass}`}
          >
            {card.value}
          </p>

          <p className="mt-2 text-xs text-white/30">
            {selected === card.id
              ? "Selected"
              : "Click to filter"}
          </p>
        </button>
      ))}
    </div>
  );
}
