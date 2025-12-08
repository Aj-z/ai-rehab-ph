import { createClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") ?? "magiclink";
  const email = searchParams.get("email");

  // ✅ SAFE NEXT PARAM
  let next = searchParams.get("next") ?? "/dashboard";

  const allowedDomain = process.env.NEXT_PUBLIC_SITE_URL!;
  const isSafe =
    next.startsWith("/") ||
    next.startsWith(allowedDomain);

  if (!isSafe) next = "/dashboard";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  if (token_hash && email) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      email,
      token_hash,
      type: type as "magiclink" | "recovery" | "invite",
    });

    if (!error) {
      const redirectUrl = next.startsWith("http")
        ? next
        : new URL(next, siteUrl).toString();

      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.redirect(
    new URL("/?error=auth_failed", siteUrl)
  );
}
