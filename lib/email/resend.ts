import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'noreply@groundtruthlabs.org';
const COMPANY_NAME = 'Groundtruth Labs';

// HTML email templates
const emailTemplates = {
  verification: (verifyLink: string, email: string) => ({
    subject: 'Verify your Groundtruth Labs email',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #0f172a; margin: 0; font-size: 24px;">${COMPANY_NAME}</h1>
          <p style="color: #475569; margin: 5px 0 0 0; font-size: 14px;">Remote Sensing Analytics</p>
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 30px; margin-bottom: 20px;">
          <h2 style="color: #0f172a; margin: 0 0 15px 0; font-size: 18px;">Verify your email address</h2>
          <p style="color: #475569; margin: 0 0 20px 0; font-size: 14px; line-height: 1.6;">
            Welcome to ${COMPANY_NAME}! Click the button below to verify your email address and access your account.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyLink}" style="background: #0e7490; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: 500;">
              Verify Email
            </a>
          </div>

          <p style="color: #94a3b8; margin: 20px 0 0 0; font-size: 12px;">
            Or copy and paste this link in your browser:<br />
            <code style="background: white; padding: 8px 12px; border-radius: 4px; display: inline-block; word-break: break-all; margin-top: 5px; color: #0f172a;">
              ${verifyLink}
            </code>
          </p>
        </div>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; color: #94a3b8; font-size: 12px; text-align: center;">
          <p style="margin: 0 0 10px 0;">
            Questions? Contact us at support@groundtruthlabs.org
          </p>
          <p style="margin: 0;">
            © ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    `,
  }),

  passwordReset: (resetLink: string) => ({
    subject: 'Reset your Groundtruth Labs password',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #0f172a; margin: 0; font-size: 24px;">${COMPANY_NAME}</h1>
          <p style="color: #475569; margin: 5px 0 0 0; font-size: 14px;">Remote Sensing Analytics</p>
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 30px; margin-bottom: 20px;">
          <h2 style="color: #0f172a; margin: 0 0 15px 0; font-size: 18px;">Reset your password</h2>
          <p style="color: #475569; margin: 0 0 20px 0; font-size: 14px; line-height: 1.6;">
            We received a request to reset your password. Click the button below to create a new password.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background: #0e7490; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: 500;">
              Reset Password
            </a>
          </div>

          <p style="color: #94a3b8; margin: 20px 0 0 0; font-size: 12px;">
            Or copy and paste this link in your browser:<br />
            <code style="background: white; padding: 8px 12px; border-radius: 4px; display: inline-block; word-break: break-all; margin-top: 5px; color: #0f172a;">
              ${resetLink}
            </code>
          </p>

          <div style="background: #fff7ed; border-left: 4px solid #f59e0b; padding: 12px; margin-top: 20px; border-radius: 4px;">
            <p style="color: #92400e; margin: 0; font-size: 12px;">
              <strong>Didn't request this?</strong> Ignore this email or contact support if you didn't initiate a password reset.
            </p>
          </div>
        </div>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; color: #94a3b8; font-size: 12px; text-align: center;">
          <p style="margin: 0 0 10px 0;">
            Questions? Contact us at support@groundtruthlabs.org
          </p>
          <p style="margin: 0;">
            © ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    `,
  }),

  invite: (inviteLink: string, inviterName?: string) => ({
    subject: `You're invited to join ${COMPANY_NAME}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #0f172a; margin: 0; font-size: 24px;">${COMPANY_NAME}</h1>
          <p style="color: #475569; margin: 5px 0 0 0; font-size: 14px;">Remote Sensing Analytics</p>
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 30px; margin-bottom: 20px;">
          <h2 style="color: #0f172a; margin: 0 0 15px 0; font-size: 18px;">You're invited!</h2>
          <p style="color: #475569; margin: 0 0 20px 0; font-size: 14px; line-height: 1.6;">
            ${inviterName ? `${inviterName} from ` : ''}${COMPANY_NAME} has invited you to join their account. Click the button below to accept the invitation and get started.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteLink}" style="background: #0e7490; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: 500;">
              Accept Invitation
            </a>
          </div>

          <p style="color: #94a3b8; margin: 20px 0 0 0; font-size: 12px;">
            Or copy and paste this link in your browser:<br />
            <code style="background: white; padding: 8px 12px; border-radius: 4px; display: inline-block; word-break: break-all; margin-top: 5px; color: #0f172a;">
              ${inviteLink}
            </code>
          </p>
        </div>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; color: #94a3b8; font-size: 12px; text-align: center;">
          <p style="margin: 0 0 10px 0;">
            Questions? Contact us at support@groundtruthlabs.org
          </p>
          <p style="margin: 0;">
            © ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    `,
  }),
};

export type EmailTemplate = keyof typeof emailTemplates;

export async function sendEmail(
  to: string,
  template: EmailTemplate,
  data: Record<string, string>
) {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    const templateFn = emailTemplates[template] as any;
    if (!templateFn) {
      throw new Error(`Unknown email template: ${template}`);
    }

    const { subject, html } = templateFn(...Object.values(data));

    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (response.error) {
      throw response.error;
    }

    return response;
  } catch (error) {
    console.error(`Failed to send ${template} email to ${to}:`, error);
    throw error;
  }
}
