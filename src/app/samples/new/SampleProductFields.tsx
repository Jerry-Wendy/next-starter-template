"use client";

import { useState } from "react";

type Product = {
  id: string;
  name: string;
  wholesale_cost: number | null;
  product_colors: {
    color_id: string;
    colors: {
      id: string;
      name: string;
    }[] | null;
  }[];
};

export default function SampleProductFields({
  products,
}: {
  products: Product[];
}) {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [internalCost, setInternalCost] = useState("");
const [selectedColorId, setSelectedColorId] = useState("");
const selectedProduct = products.find(
  (product) => product.id === selectedProductId
);
const availableColors = selectedProduct?.product_colors ?? [];
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
setSelectedColorId("");
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
    Color
  </label>
  <select
    name="color_id"
    value={selectedColorId}
    onChange={(event) => setSelectedColorId(event.target.value)}
    className="w-full rounded-lg border border-slate-300 px-3 py-2"
  >
    <option value="">Select color</option>
    {availableColors.map((item) =>
      item.colors ? (
        <option key={item.color_id} value={item.color_id}>
          {(item.colors as unknown as { name: string })?.name ?? "Unknown Color"}
        </option>
      ) : null
    )}
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