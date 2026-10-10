
"use client";

import { useState } from "react";
import { deleteAttributedRevenue } from "./actions";

export default function DeleteRevenueButton({
  id,
}: {
  id: string;
}) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
      >
        Delete
      </button>
    );
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="rounded-lg border px-3 py-1.5 text-sm"
      >
        Cancel
      </button>

      <form action={deleteAttributedRevenue.bind(null, id)}>
        <button
          type="submit"
          className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
        >
          Confirm Delete
        </button>
      </form>
    </div>
  );
}
