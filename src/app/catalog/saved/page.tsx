import { deleteCatalog } from "./actions";
import { createClient } from "../../lib/supabase/server";

export default async function SavedCatalogsPage() {
  const supabase = await createClient();

  const { data: catalogs, error } = await supabase
    .from("saved_catalogs")
    .select(`
      id,
      catalog_name,
      product_ids,
      created_at,
      businesses (
        name
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Could not load saved catalogs: ${error.message}`);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <a
            href="/"
            className="text-sm font-medium text-slate-600 underline"
          >
            ← Back to Dashboard
          </a>

          <h1 className="mt-4 text-3xl font-bold text-slate-900">
            Saved Catalogs
          </h1>

          <p className="mt-2 text-slate-600">
            Reopen previously created prospect catalogs.
          </p>
        </div>

        {!catalogs || catalogs.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-slate-600">No saved catalogs yet.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-sm text-slate-700">
                <tr>
                  <th className="px-5 py-3">Catalog</th>
                  <th className="px-5 py-3">Business</th>
                  <th className="px-5 py-3">Products</th>
                  <th className="px-5 py-3">Created</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {catalogs.map((catalog: any) => {
                  const business = Array.isArray(catalog.businesses)
                    ? catalog.businesses[0]
                    : catalog.businesses;

                  const productIds = catalog.product_ids ?? [];

                  const params = new URLSearchParams();

                  if (business) {
                    params.set("business", catalog.business_id ?? "");
                  }

                  productIds.forEach((id: string) =>
                    params.append("products", id)
                  );

                  return (
                    <tr key={catalog.id}>
                      <td className="px-5 py-4 font-semibold text-slate-900">
                        {catalog.catalog_name}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {business?.name ?? "—"}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {productIds.length}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {new Date(catalog.created_at).toLocaleDateString()}
                      </td>

                      <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/catalog/prospect?${params.toString()}`}
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                      >
                        Open / Print
                      </a>

                      <form action={deleteCatalog}>
                        <input type="hidden" name="catalog_id" value={catalog.id} />
                        <button
                          type="submit"
                          className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
