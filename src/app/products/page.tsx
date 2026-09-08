import Link from "next/link";
import { createClient } from "../lib/supabase/server";

export default async function ProductsPage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      sku,
      category,
      manufacturer,
      supplier,
      wholesale_cost,
      retail_price,
      additional_engraving_fee,
      availability,
      active
    `)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Could not load products: ${error.message}`);
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Product Catalog
            </h1>
            <p className="mt-1 text-slate-500">
              Internal product, cost and pricing information
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700"
            >
              Dashboard
            </Link>

            <Link
              href="/products/new"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            >
              + Add Product
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-100 text-sm text-slate-600">
              <tr>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">SKU</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Wholesale</th>
                <th className="px-5 py-3">Retail</th>
                <th className="px-5 py-3">Engraving</th>
                <th className="px-5 py-3">Availability</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {(products ?? []).map((product) => (
                <tr key={product.id} className="text-sm text-slate-700">
                  <td className="px-5 py-4 font-medium">
                    <Link
                      href={`/products/${product.id}`}
                      className="text-slate-900 hover:underline"
                    >
                      {product.name}
                    </Link>
                  </td>
                  <td className="px-5 py-4">{product.sku || "—"}</td>
                  <td className="px-5 py-4">{product.category || "—"}</td>
                  <td className="px-5 py-4">
                    {product.wholesale_cost != null
                      ? `$${Number(product.wholesale_cost).toFixed(2)}`
                      : "—"}
                  </td>
                  <td className="px-5 py-4">
                    {product.retail_price != null
                      ? `$${Number(product.retail_price).toFixed(2)}`
                      : "—"}
                  </td>
                  <td className="px-5 py-4">
                    {product.additional_engraving_fee != null
                      ? `$${Number(product.additional_engraving_fee).toFixed(2)}`
                      : "—"}
                  </td>
                  <td className="px-5 py-4">{product.availability || "—"}</td>
                  <td className="px-5 py-4">
                    {product.active ? "Active" : "Inactive"}
                  </td>
                </tr>
              ))}

              {(products ?? []).length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    No products in the catalog yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
