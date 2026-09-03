import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return NextResponse.json(
      { error: "Supabase environment variables are missing." },
      { status: 500 }
    );
  }

  const response = await fetch(
    `${url}/rest/v1/businesses?select=*&limit=5`,
    {
      headers: {
        apikey: key,
      },
      cache: "no-store",
    }
  );

  const body = await response.text();

  return NextResponse.json({
    status: response.status,
    ok: response.ok,
    body,
  });
}
