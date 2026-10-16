
"use client";

import { deleteProduct } from "./delete-action";

type Props = {
  productId: string;
};

export default function DeleteProductButton({ productId }: Props) {
  return (
    <form
      action={deleteProduct}
      onSubmit={(event) => {
        if (
          !window.confirm(
            "Are you sure you want to delete this product? This cannot be undone."
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={productId} />
      <button
        type="submit"
        className="font-medium text-red-600 hover:underline"
      >
        Delete
      </button>
    </form>
  );
}
