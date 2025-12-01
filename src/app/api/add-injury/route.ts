import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("injury data:", body);
  return NextResponse.json({ ok: true });
}
