import { NextResponse } from "next/server";

type LeadPayload = {
  name?: string;
  phone?: string;
  capital?: number;
  capitalVnd?: number;
  experience?: string;
  assistant?: string;
  totalScore?: number;
  riskProfile?: string;
  capacity?: number;
  tolerance?: number;
  autonomy?: number;
  answers?: string[];
  source?: string;
  website?: string;
};

const WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL ?? "";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as LeadPayload;

    if (payload.website) return NextResponse.json({ ok: true });
    if (!payload.name?.trim() || !payload.phone?.trim() || !Number(payload.capitalVnd || payload.capital)) {
      return NextResponse.json({ ok: false, error: "Thông tin khách hàng chưa đầy đủ." }, { status: 400 });
    }
    if (!payload.assistant || !["Hải Anh", "Minh Hải"].includes(payload.assistant)) {
      return NextResponse.json({ ok: false, error: "Trợ lý hỗ trợ không hợp lệ." }, { status: 400 });
    }
    if (!WEBHOOK_URL.startsWith("https://script.google.com/macros/s/") || !WEBHOOK_URL.endsWith("/exec")) {
      return NextResponse.json(
        { ok: false, error: "Webhook Google Sheet chưa được triển khai hoặc chưa cấu hình GOOGLE_SHEETS_WEBHOOK_URL." },
        { status: 503 },
      );
    }

    const webhookResponse = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: new URLSearchParams({ payload: JSON.stringify(payload) }),
      redirect: "follow",
      cache: "no-store",
    });

    const responseText = await webhookResponse.text();
    let result: { ok?: boolean; error?: string } = {};
    try {
      result = JSON.parse(responseText);
    } catch {
      return NextResponse.json({ ok: false, error: "Apps Script trả về dữ liệu không hợp lệ." }, { status: 502 });
    }

    if (!webhookResponse.ok || !result.ok) {
      return NextResponse.json({ ok: false, error: result.error || "Google Sheet từ chối ghi dữ liệu." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Không thể kết nối tới Google Sheet." }, { status: 500 });
  }
}
