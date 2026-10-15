"use client";

import { useState } from "react";

type Product = {
  id: string;
  name: string;
  wholesale_cost: number | null;
};

export default function SampleProductFields({
  products,
}: {
  products: Product[];
}) {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [internalCost, setInternalCost] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Product *
        </label>
        <select
          name="product_id"
          required
          value={selectedProductId}
          onChange={(event) => {
            const id = event.target.value;
            setSelectedProductId(id);

            const product = products.find((p) => p.id === id);
            setInternalCost(
              product?.wholesale_cost != null
                ? Number(product.wholesale_cost).toFixed(2)
                : ""
            );
          }}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        >
          <option value="">Select product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Internal Cost
        </label>
        <input
          name="internal_cost"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={internalCost}
          onChange={(event) => setInternalCost(event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>
    </div>
  );
}