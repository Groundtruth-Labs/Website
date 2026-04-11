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

    if (!data?.properties?.action_link) {
      throw new Error('Failed to generate verification link');
    }

    await sendEmail(email, 'verification', {
      verifyLink: data.properties.action_link,
      email,
    });

    return { success: true };
  } catch (error) {
    console.error('Signup error:', error);
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
