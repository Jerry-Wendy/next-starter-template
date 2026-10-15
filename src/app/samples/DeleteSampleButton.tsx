"use client";
import { deleteSample } from "./actions";
type Props = {
  sampleId: string;
};

export default function DeleteSampleButton({ sampleId }: Props) {
  return (
    <form
      action={deleteSample}
      onSubmit={(event) => {
        if (
          !window.confirm(
            "Are you sure you want to delete this sample? This cannot be undone."
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={sampleId} />
      <button
        type="submit"
        className="font-medium text-red-600 hover:underline"
      >
        Delete
      </button>
    </form>
  );
}