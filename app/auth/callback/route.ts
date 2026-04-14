import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/dashboard";

  // Create the redirect response upfront so we can set session cookies directly
  // on it. Next.js does NOT propagate cookies set via cookies() when the
  // response is a redirect — they must be written to the response object itself.
  const successResponse = NextResponse.redirect(`${origin}${next}`);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            successResponse.cookies.set(name, value, options as Parameters<typeof successResponse.cookies.set>[2])
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
    return successResponse;
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
