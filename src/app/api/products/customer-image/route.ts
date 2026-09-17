import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
    }

    const formData = await request.formData();

    const productId = String(formData.get("product_id") || "").trim();
    const file = formData.get("product_image");

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
    }

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "Please choose an image file." }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Please upload a JPG, PNG, or WEBP image." },
        { status: 400 }
      );
    }

    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const filePath = `${productId}/customer.${extension}`;
    const fileBuffer = new Uint8Array(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from("Product images")
      .upload(filePath, fileBuffer, {
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: `Could not upload image: ${uploadError.message}` },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from("Product images")
      .getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from("products")
      .update({
        customer_image_url: publicUrlData.publicUrl,
      })
      .eq("id", productId);

    if (updateError) {
      return NextResponse.json(
        { error: `Could not save image URL: ${updateError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.redirect(
      new URL(`/products/${productId}`, request.url),
      303
    );
  } catch (error) {
    console.error("Customer image upload error:", error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Image upload failed." },
      { status: 500 }
    );
  }
}
