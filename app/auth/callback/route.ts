import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams: rawSearchParams, origin } = new URL(request.url);
  const code = rawSearchParams.get("code");
  const tokenHash = rawSearchParams.get("token_hash");
  const type = rawSearchParams.get("type");
  const next = rawSearchParams.get("next") ?? "/dashboard";

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  let error = null;

  // Handle OAuth code exchange (magic link from admin invites)
  if (code) {
    const { error: codeError } = await supabase.auth.exchangeCodeForSession(code);
    error = codeError;
  }
  // Handle token-based flows (email verification, password reset, magic link)
  else if (tokenHash && type) {
    const { error: tokenError } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as any,
    });
    error = tokenError;
  }

  if (!error) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
