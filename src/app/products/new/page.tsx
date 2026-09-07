import Link from "next/link";
import { addProduct } from "./actions";

export default function NewProductPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <Link
            href="/products"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Back to Products
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-slate-900">
            Add Product
          </h1>

          <p className="mt-1 text-slate-500">
            Add a product to the internal catalog
          </p>
        </div>

        <form
          action={addProduct}
          className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Product Name *
            </label>
            <input
              name="name"
              required
              placeholder="Example: 12oz Wine Tumbler"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                SKU
              </label>
              <input
                name="sku"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Category
              </label>
              <input
                name="category"
                placeholder="Tumblers, Bottles, Pet Bowls..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Manufacturer
              </label>
              <input
                name="manufacturer"
                placeholder="Example: Polar Camel"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Supplier
              </label>
              <input
                name="supplier"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Wholesale Cost
              </label>
              <input
                name="wholesale_cost"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Retail Price
              </label>
              <input
                name="retail_price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Engraving Fee
              </label>
              <input
                name="additional_engraving_fee"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Availability
            </label>
            <input
              name="availability"
              placeholder="In Stock, Special Order, Backordered..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Internal Notes
            </label>
            <textarea
              name="internal_notes"
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Link
              href="/products"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
