// src/app/auth/confirm/route.ts
import { createClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") ?? "magiclink";
  const next = searchParams.get("next") ?? "/dashboard";
  const email = searchParams.get("email"); // REQUIRED by Supabase

  if (token_hash && email) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      email,
      token_hash,
      type: type as "magiclink" | "recovery" | "invite",
    });

    if (!error) {
      return NextResponse.redirect(new URL(next, req.url));
    }
  }

  return NextResponse.redirect(
    new URL("/?error=auth_failed", req.url)
  );
}
