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
    const { amount, orderId } = await req.json();
    const token = await getToken();

    const r = await fetch(`${BASE}/invoice`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        invoice_code: process.env.QPAY_INVOICE_CODE,
        sender_invoice_no: orderId,
        invoice_receiver_code: "terminal",
        invoice_description: "The Path of Stars захиалга",
        amount,
        callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/qpay/callback`,
      }),
    });

    const d = await r.json();
    if (!r.ok) return NextResponse.json({ error: JSON.stringify(d) }, { status: 400 });

    return NextResponse.json({
      invoice_id: d.invoice_id,
      qr_image: d.qr_image,
      qr_text: d.qr_text,
      urls: d.urls ?? [],
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
