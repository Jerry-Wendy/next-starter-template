import Link from "next/link";
import { createClient } from "../../../lib/supabase/server";
import { updateSample } from "./actions";
type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditSamplePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: sample, error } = await supabase
    .from("samples")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !sample) {
    throw new Error("Could not load sample.");
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-2xl">
        <Link href="/samples" className="text-blue-600 hover:underline">
          ← Back to Samples
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-slate-900">
          Edit Sample
        </h1>

        <p className="mt-2 text-slate-600">
          Update an existing sample record.
        </p>
        <form action={updateSample} className="mt-6 space-y-6">
  <input type="hidden" name="id" value={id} />
                <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <label
            htmlFor="sample_description"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Sample Notes
          </label>
          <textarea
            id="sample_description"
            name="sample_description"
            defaultValue={sample.sample_description ?? ""}
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
        <button
  type="submit"
  className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
>
  Save Changes
</button>
</form>
      </div>
    </main>
  );
}