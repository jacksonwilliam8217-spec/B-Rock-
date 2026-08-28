"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Plan = {
  id: string;
  name: string;
  description: string | null;
  min_amount: number;
  max_amount: number;
  duration_days: number;
  daily_roi: number;
  status: string;
};

export default function PlanEditor({ plan }: { plan: Plan }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState(plan.name);
  const [description, setDescription] = useState(plan.description || "");
  const [minAmount, setMinAmount] = useState(String(plan.min_amount));
  const [maxAmount, setMaxAmount] = useState(String(plan.max_amount));
  const [duration, setDuration] = useState(String(plan.duration_days));
  const [dailyRoi, setDailyRoi] = useState(String(plan.daily_roi));
  const [status, setStatus] = useState(plan.status);

  async function savePlan() {
    setSaving(true);

    const supabase = createClient();

    const { error } = await supabase.rpc("update_investment_plan", {
      p_id: plan.id,
      p_name: name,
      p_description: description,
      p_min_amount: Number(minAmount),
      p_max_amount: Number(maxAmount),
      p_duration_days: Number(duration),
      p_daily_roi: Number(dailyRoi),
      p_status: status,
    });

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Investment plan updated successfully.");
    window.location.reload();
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="mt-6 w-full rounded-xl bg-yellow-400 px-4 py-3 font-semibold text-slate-950 hover:bg-yellow-300"
      >
        Edit Plan
      </button>
    );
  }

  return (
    <div className="mt-6 space-y-4 border-t border-white/10 pt-6">
      <h3 className="text-lg font-bold">Edit Plan</h3>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Plan name"
        className="w-full rounded-xl bg-slate-900 p-3 text-white outline-none ring-1 ring-white/10"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        rows={3}
        className="w-full rounded-xl bg-slate-900 p-3 text-white outline-none ring-1 ring-white/10"
      />

      <div className="grid grid-cols-2 gap-3">
        <input
          type="number"
          min="0"
          value={minAmount}
          onChange={(e) => setMinAmount(e.target.value)}
          placeholder="Minimum"
          className="w-full rounded-xl bg-slate-900 p-3 text-white outline-none ring-1 ring-white/10"
        />

        <input
          type="number"
          min="0"
          value={maxAmount}
          onChange={(e) => setMaxAmount(e.target.value)}
          placeholder="Maximum"
          className="w-full rounded-xl bg-slate-900 p-3 text-white outline-none ring-1 ring-white/10"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <input
          type="number"
          min="1"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Duration days"
          className="w-full rounded-xl bg-slate-900 p-3 text-white outline-none ring-1 ring-white/10"
        />

        <input
          type="number"
          min="0"
          step="0.01"
          value={dailyRoi}
          onChange={(e) => setDailyRoi(e.target.value)}
          placeholder="Daily ROI %"
          className="w-full rounded-xl bg-slate-900 p-3 text-white outline-none ring-1 ring-white/10"
        />
      </div>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full rounded-xl bg-slate-900 p-3 text-white outline-none ring-1 ring-white/10"
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={savePlan}
          disabled={saving}
          className="flex-1 rounded-xl bg-yellow-400 px-4 py-3 font-semibold text-slate-950 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        <button
          type="button"
          onClick={() => setEditing(false)}
          className="rounded-xl border border-white/10 px-4 py-3 text-white/70"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

