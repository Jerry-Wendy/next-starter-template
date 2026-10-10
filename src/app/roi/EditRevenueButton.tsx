"use client";

import { useState } from "react";
import { updateAttributedRevenue } from "./actions";

type Business = {
  id: string;
  name: string;
};

type Props = {
  id: string;
  businessId: string | null;
  amount: number;
  businesses: Business[];
};

export default function EditRevenueButton({
  id,
  businessId,
  amount,
  businesses,
}: Props) {
  const [editing, setEditing] = useState(false);

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="rounded-lg border px-3 py-2 text-sm"
      >
        Edit
      </button>
    );
  }

  return (
    <form
      action={async (formData) => {
        await updateAttributedRevenue(id, formData);
        setEditing(false);
      }}
      className="flex min-w-64 flex-col gap-2 rounded-lg border bg-white p-3 text-left shadow-sm"
    >
      <label className="text-xs font-semibold">Business</label>
      <select
        name="business_id"
        defaultValue={businessId ?? ""}
        required
        className="rounded border p-2 text-sm"
      >
        <option value="">Select business</option>
        {businesses.map((business) => (
          <option key={business.id} value={business.id}>
            {business.name}
          </option>
        ))}
      </select>

      <label className="text-xs font-semibold">Revenue Amount ($)</label>
      <input
        type="number"
        name="attributed_revenue"
        defaultValue={amount}
        min="0.01"
        step="0.01"
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