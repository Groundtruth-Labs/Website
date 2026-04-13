import { Resend } from 'resend';

const FROM_EMAIL = 'noreply@groundtruthlabs.org';
const COMPANY_NAME = 'Groundtruth Labs';

// ─── Shared layout pieces ───────────────────────────────────────────────────

function emailWrapper(content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Courier New',Courier,monospace;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f1f5f9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:28px;text-align:left;">
              <span style="font-family:'Courier New',Courier,monospace;font-size:14px;font-weight:700;color:#0f172a;letter-spacing:-0.02em;">${COMPANY_NAME}</span>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#ffffff;border:1px solid #e2e8f0;border-radius:4px;padding:40px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:28px 0 0 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #e2e8f0;padding-top:20px;">
                <tr>
                  <td style="font-family:Arial,sans-serif;font-size:11px;color:#94a3b8;line-height:1.6;">
                    <p style="margin:0;color:#cbd5e1;">
                      &copy; ${new Date().getFullYear()} ${COMPANY_NAME} &middot; Hawaii &middot; Remote Sensing Analytics
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function ctaButton(href: string, label: string) {
  return `
    <table cellpadding="0" cellspacing="0" border="0" style="margin:32px 0;">
      <tr>
        <td style="background:#0e7490;border-radius:3px;">
          <a href="${href}"
             style="display:inline-block;padding:13px 28px;font-family:'Courier New',Courier,monospace;font-size:13px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.03em;">
            ${label}
          </a>
        </td>
      </tr>
    </table>`;
}


function eyebrow(label: string) {
  return `<p style="font-family:'Courier New',Courier,monospace;font-size:10px;font-weight:700;color:#0e7490;letter-spacing:0.14em;text-transform:uppercase;margin:0 0 16px 0;">${label}</p>`;
}

function divider() {
  return `<div style="height:1px;background:#e2e8f0;margin:28px 0;"></div>`;
}

// ─── Templates ──────────────────────────────────────────────────────────────

const emailTemplates = {
  verification: (verifyLink: string, email: string) => ({
    subject: `Verify your email — ${COMPANY_NAME}`,
    html: emailWrapper(`
      ${eyebrow('Email verification')}
      <h1 style="font-family:'Courier New',Courier,monospace;font-size:22px;font-weight:700;color:#0f172a;margin:0 0 14px 0;line-height:1.2;">
        Confirm your account
      </h1>
      <p style="font-family:Arial,sans-serif;font-size:14px;color:#475569;margin:0;line-height:1.7;">
        You signed up with <strong style="color:#0f172a;">${email}</strong>. Click the button below to verify your address and get access to your dashboard.
      </p>
      ${ctaButton(verifyLink, 'Verify Email →')}
      ${divider()}
      <p style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;margin:0;line-height:1.7;">
        Once verified, you'll complete a short onboarding and land in your project dashboard. The whole thing takes under two minutes.
      </p>
    `),
  }),

  passwordReset: (resetLink: string) => ({
    subject: `Reset your password — ${COMPANY_NAME}`,
    html: emailWrapper(`
      ${eyebrow('Password reset')}
      <h1 style="font-family:'Courier New',Courier,monospace;font-size:22px;font-weight:700;color:#0f172a;margin:0 0 14px 0;line-height:1.2;">
        Set a new password
      </h1>
      <p style="font-family:Arial,sans-serif;font-size:14px;color:#475569;margin:0;line-height:1.7;">
        We got a request to reset your ${COMPANY_NAME} password. Click the button below to choose a new one.
      </p>
      ${ctaButton(resetLink, 'Reset Password →')}
      ${divider()}
      <table cellpadding="0" cellspacing="0" border="0" style="width:100%;">
        <tr>
          <td style="background:#fff7ed;border-left:3px solid #f59e0b;border-radius:2px;padding:12px 16px;">
            <p style="font-family:Arial,sans-serif;font-size:12px;color:#92400e;margin:0;line-height:1.6;">
              <strong>Didn't request this?</strong> You can ignore this email safely. Your password won't change.
            </p>
          </td>
        </tr>
      </table>
    `),
  }),

  invite: (inviteLink: string, inviterName?: string) => ({
    subject: `You're invited to ${COMPANY_NAME}`,
    html: emailWrapper(`
      ${eyebrow('Invitation')}
      <h1 style="font-family:'Courier New',Courier,monospace;font-size:22px;font-weight:700;color:#0f172a;margin:0 0 14px 0;line-height:1.2;">
        You've been invited
      </h1>
      <p style="font-family:Arial,sans-serif;font-size:14px;color:#475569;margin:0;line-height:1.7;">
        ${inviterName ? `<strong style="color:#0f172a;">${inviterName}</strong> from ` : ''}${COMPANY_NAME} has set up a client account for you. Accept the invitation to access your project data, NDVI reports, and deliverables.
      </p>
      ${ctaButton(inviteLink, 'Accept Invitation →')}
      ${divider()}
      <table cellpadding="0" cellspacing="0" border="0" style="width:100%;">
        <tr>
          <td style="width:50%;padding-right:16px;vertical-align:top;">
            <p style="font-family:'Courier New',Courier,monospace;font-size:10px;font-weight:700;color:#0e7490;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 6px 0;">NDVI + Ortho</p>
            <p style="font-family:Arial,sans-serif;font-size:12px;color:#64748b;margin:0;line-height:1.6;">Vegetation health maps and high-resolution orthomosaics</p>
          </td>
          <td style="width:50%;vertical-align:top;">
            <p style="font-family:'Courier New',Courier,monospace;font-size:10px;font-weight:700;color:#0e7490;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 6px 0;">48hr turnaround</p>
            <p style="font-family:Arial,sans-serif;font-size:12px;color:#64748b;margin:0;line-height:1.6;">Reports and annotations delivered fast</p>
          </td>
        </tr>
      </table>
    `),
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

    const resend = new Resend(process.env.RESEND_API_KEY);
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
