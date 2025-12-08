import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set(name, value, options);
        },
        remove(name: string, options: any) {
          cookieStore.set(name, '', { ...options, maxAge: 0 });
        },
      },
    }
  );

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  // ✅ SAFE NEXT HANDLING
  let next = searchParams.get("next") ?? "/dashboard";

  const allowedDomain = process.env.NEXT_PUBLIC_SITE_URL!;
  const isSafe =
    next.startsWith("/") ||
    next.startsWith(allowedDomain);

  if (!isSafe) next = "/dashboard";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const redirectUrl = next.startsWith("http")
        ? next
        : new URL(next, siteUrl).toString();

      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.redirect(
    new URL("/login?error=access_denied&error_code=otp_expired", siteUrl)
  );
}
