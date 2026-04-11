'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/email/resend';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://groundtruthlabs.org';

type RegisterUserInput = {
  email: string;
  password: string;
  company?: string;
};

export async function registerUser({
  email,
  password,
  company,
}: RegisterUserInput) {
  try {
    const admin = createAdminClient();

    const { data, error } = await admin.auth.admin.generateLink({
      type: 'signup',
      email,
      password,
      options: {
        redirectTo: `${SITE_URL}/auth/callback?next=/onboarding`,
        data: {
          company_name: company || undefined,
        },
      },
    });

    if (error) {
      throw error;
    }

    if (!data?.properties?.hashed_token) {
      throw new Error('Failed to generate verification link');
    }

    // Build an intermediate URL on our domain — prevents Gmail's link
    // pre-fetcher from consuming the one-time Supabase token before the
    // user clicks it. The token is only exchanged when the user hits the
    // "Confirm email" button on /auth/verify.
    // Note: Supabase returns the field as `hashed_token` but the URL param
    // it expects on /auth/callback is `token_hash`.
    const verifyUrl = new URL(`${SITE_URL}/auth/verify`);
    verifyUrl.searchParams.set('token_hash', data.properties.hashed_token);
    verifyUrl.searchParams.set('type', 'signup');
    verifyUrl.searchParams.set('next', '/onboarding');

    await sendEmail(email, 'verification', {
      verifyLink: verifyUrl.toString(),
      email,
    });

    return { success: true };
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
}

export async function resendVerificationEmail(email: string) {
  try {
    const admin = createAdminClient();

    // Use 'email_change_new' won't work for unverified users — use magiclink
    // which generates a valid one-time login link for any user state.
    const { data, error } = await admin.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: `${SITE_URL}/auth/callback?next=/onboarding`,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data?.properties?.hashed_token) {
      throw new Error('Failed to generate verification link');
    }

    const verifyUrl = new URL(`${SITE_URL}/auth/verify`);
    verifyUrl.searchParams.set('token_hash', data.properties.hashed_token);
    verifyUrl.searchParams.set('type', 'magiclink');
    verifyUrl.searchParams.set('next', '/onboarding');

    await sendEmail(email, 'verification', {
      verifyLink: verifyUrl.toString(),
      email,
    });

    return { success: true };
  } catch (error) {
    console.error('Resend verification error:', error);
    throw error;
  }
}

export async function requestPasswordReset(email: string) {
  try {
    const admin = createAdminClient();

    // Generate password recovery link using Supabase admin API
    const { data, error } = await admin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        redirectTo: `${SITE_URL}/auth/callback?next=/update-password`,
      },
    });

    if (error) {
      throw error;
    }

    if (!data?.properties?.action_link) {
      throw new Error('Failed to generate reset link');
    }

    // Send reset email via Resend
    await sendEmail(email, 'passwordReset', {
      resetLink: data.properties.action_link,
    });

    return { success: true };
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
}

export async function sendInviteEmail(email: string, inviterName?: string) {
  try {
    const admin = createAdminClient();

    // Generate magic link invite using Supabase admin API
    const { data, error } = await admin.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: `${SITE_URL}/auth/callback?next=/onboarding`,
      },
    });

    if (error) {
      throw error;
    }

    if (!data?.properties?.action_link) {
      throw new Error('Failed to generate invite link');
    }

    // Send invite email via Resend
    await sendEmail(email, 'invite', {
      inviteLink: data.properties.action_link,
      inviterName: inviterName || '',
    });

    return { success: true };
  } catch (error) {
    console.error('Invite error:', error);
    throw error;
  }
}
