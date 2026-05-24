import { NextRequest, NextResponse } from "next/server";

const BASE = "https://merchant.qpay.mn/v2";

async function getToken() {
  const b64 = Buffer.from(`${process.env.QPAY_USERNAME}:${process.env.QPAY_PASSWORD}`).toString("base64");
  const r = await fetch(`${BASE}/auth/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${b64}` },
  });
  const d = await r.json();
  if (!d.access_token) throw new Error("QPay auth failed");
  return d.access_token as string;
}

export async function POST(req: NextRequest) {
  try {
    const { invoice_id } = await req.json();
    const token = await getToken();

    const r = await fetch(`${BASE}/payment/check`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        object_type: "INVOICE",
        object_id: invoice_id,
        offset: { page_number: 1, page_limit: 100 },
      }),
    });

    const d = await r.json();
    return NextResponse.json({ paid: (d.count ?? 0) > 0 });
  } catch (e) {
    return NextResponse.json({ paid: false, error: String(e) }, { status: 500 });
  }
}
