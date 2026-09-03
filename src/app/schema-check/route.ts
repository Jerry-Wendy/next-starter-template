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

  const response = await fetch(`${url}/rest/v1/`, {
    headers: {
      apikey: key,
      Accept: "application/openapi+json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: `Supabase returned ${response.status}` },
      { status: response.status }
    );
  }

  const schema: any = await response.json();

  const definitions =
    schema.definitions ??
    schema.components?.schemas ??
    {};

  function tableInfo(name: string) {
    const table = definitions[name];

    if (!table) {
      return { error: `${name} table not found in API schema` };
    }

    const properties = table.properties ?? {};

    return Object.fromEntries(
      Object.entries(properties).map(([column, details]: [string, any]) => [
        column,
        {
          type: details.type ?? null,
          format: details.format ?? null,
        },
      ])
    );
  }

  return NextResponse.json({
    businesses: tableInfo("businesses"),
    contacts: tableInfo("contacts"),
  });
}
