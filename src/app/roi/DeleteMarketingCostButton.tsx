"use client";

import { useState } from "react";
import { deleteMarketingCost } from "./actions";

export default function DeleteMarketingCostButton({
  id,
}: {
  id: string;
}) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="flex justify-end gap-2">
      {confirming ? (
        <>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="rounded-lg border px-3 py-1.5 text-sm"
          >
            Cancel
          </button>

          <form action={deleteMarketingCost.bind(null, id)}>
            <button
              type="submit"
              className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
            >
              Confirm Delete
            </button>
          </form>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700"
        >
          Delete
        </button>
      )}
    </div>
  );
}