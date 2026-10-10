
"use client";

import { useState } from "react";
import { updateMarketingCost } from "./actions";

type Business = {
  id: string;
  name: string;
};

type Props = {
  id: string;
  businessId: string | null;
  description: string;
  category: string;
  amount: number;
  incurredDate: string;
  businesses: Business[];
};

export default function EditMarketingCostButton({
  id,
  businessId,
  description,
  category,
  amount,
  incurredDate,
  businesses,
}: Props) {
  const [editing, setEditing] = useState(false);

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-slate-100"
      >
        Edit
      </button>
    );
  }

  return (
    <form
      action={updateMarketingCost.bind(null, id)}
      className="flex min-w-64 flex-col gap-2 rounded-lg border bg-white p-3 text-left shadow-sm"
    >
      <label className="text-xs font-semibold">Business</label>
      <select
        name="business_id"
        defaultValue={businessId ?? ""}
        className="rounded border p-2 text-sm"
      >
        <option value="">General</option>
        {businesses.map((business) => (
          <option key={business.id} value={business.id}>
            {business.name}
          </option>
        ))}
      </select>

      <label className="text-xs font-semibold">Description</label>
      <input
        name="description"
        defaultValue={description}
        required
        className="rounded border p-2 text-sm"
      />

      <label className="text-xs font-semibold">Category</label>
      <input
        name="category"
        defaultValue={category}
        required
        className="rounded border p-2 text-sm"
      />

      <label className="text-xs font-semibold">Date</label>
      <input
        type="date"
        name="incurred_date"
        defaultValue={incurredDate}
        required
        className="rounded border p-2 text-sm"
      />

      <label className="text-xs font-semibold">Amount ($)</label>
      <input
        type="number"
        name="amount"
        step="0.01"
        min="0.01"
        defaultValue={amount}
        required
        className="rounded border p-2 text-sm"
      />

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
