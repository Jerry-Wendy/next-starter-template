import Link from "next/link";
import { createClient } from "../../../lib/supabase/server";
import { updateProductDetails } from "../actions";
type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) {
    return <p className="p-8">Product not found.</p>;
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href={`/products/${id}`}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Product
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-slate-900">
          Edit Product
        </h1>

        <p className="mt-2 text-slate-600">
          {product.name}
</p>
<form action={updateProductDetails} className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
  <input type="hidden" name="product_id" value={id} />
  <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6">
  <label
    htmlFor="product-name"
    className="mb-2 block text-sm font-semibold text-slate-700"
  >
    Product Name
  </label>
  <input
    id="product-name"
    name="name"
    type="text"
    defaultValue={product.name ?? ""}
    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
  />
</div>
<div className="mt-4 rounded-xl border border-slate-200 bg-white p-6">
  <label
    htmlFor="product-sku"
    className="mb-2 block text-sm font-semibold text-slate-700"
  >
    SKU
  </label>
  <input
    id="product-sku"
    name="sku"
    type="text"
    defaultValue={product.sku ?? ""}
    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
  />
</div>
<div className="mt-4 rounded-xl border border-slate-200 bg-white p-6">
  <label
    htmlFor="wholesale-cost"
    className="mb-2 block text-sm font-semibold text-slate-700"
  >
    Wholesale Cost ($)
  </label>
  <input
    id="wholesale-cost"
    name="wholesale_cost"
    type="number"
    step="0.01"
    min="0"
    defaultValue={product.wholesale_cost ?? ""}
    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
  />
</div>
<div className="mt-4 rounded-xl border border-slate-200 bg-white p-6">
  <label
    htmlFor="retail-price"
    className="mb-2 block text-sm font-semibold text-slate-700"
  >
    Retail Price ($)
  </label>
  <input
    id="retail-price"
    name="retail_price"
    type="number"
    step="0.01"
    min="0"
    defaultValue={product.retail_price ?? ""}
    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
  />
</div>
<div className="mt-4 rounded-xl border border-slate-200 bg-white p-6">
  <label
    htmlFor="engraving-fee"
    className="mb-2 block text-sm font-semibold text-slate-700"
  >
    Additional Engraving Fee ($)
  </label>
  <input
    id="engraving-fee"
    name="additional_engraving_fee"
    type="number"
    step="0.01"
    min="0"
    defaultValue={product.additional_engraving_fee ?? ""}
    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
  />
</div>
<div className="mt-4 rounded-xl border border-slate-200 bg-white p-6">
  <label
    htmlFor="product-description"
    className="mb-2 block text-sm font-semibold text-slate-700"
  >
    Product Description
  </label>
  <textarea
    id="product-description"
    name="description"
    rows={4}
    defaultValue={product.description ?? ""}
    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
  />
</div>
<div className="mt-4 rounded-xl border border-slate-200 bg-white p-6">
  <label
    htmlFor="internal-notes"
    className="mb-2 block text-sm font-semibold text-slate-700"
  >
    Internal Notes (Not Visible to Customers)
  </label>
  <textarea
    id="internal-notes"
    name="internal_notes"
    rows={4}
    defaultValue={product.internal_notes ?? ""}
    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
  />
</div>
   <button
  type="submit"
  className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
>
  Save Changes
</button>
</form>
 </div>     
     
    </main>
  );
}