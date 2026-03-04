import nodemailer from "nodemailer";

function generateProfessionalCode(): string {
  const prefixes = ["DEV", "TEAM", "HACK"];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 5; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${suffix}`;
}

export async function sendInviteEmail(
  toEmail: string,
  inviteCode: string,
  teamName: string,
  projectName: string,
  senderName: string
) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
  const inviteLink = `${baseUrl}/join/${inviteCode}`;
  const fromEmail = process.env.GMAIL_USER;

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error("ERROR: GMAIL credentials missing. Emails cannot be sent.");
    return { success: false, error: new Error("GMAIL_USER or GMAIL_APP_PASSWORD missing") };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"DevHack" <${fromEmail}>`,
      to: toEmail,
      subject: `${senderName} invited you to join ${teamName} on DevHack`,
      html: `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DevHack Invite</title>
  <style>
    body { margin: 0; padding: 0; background-color: #09090b; }
    table { border-collapse: collapse; }
    .main-table { width: 100%; max-width: 560px; margin: 40px auto; background-color: #111113; border: 1px solid #27272a; border-radius: 16px; overflow: hidden; }
    .content-cell { padding: 40px 32px; }
    .eyebrow { display: inline-block; padding: 4px 12px; border-radius: 100px; color: #818cf8; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; background-color: rgba(79,70,229,0.1); border: 1px solid rgba(79,70,229,0.2); }
    h1 { font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; font-size: 26px; font-weight: 800; color: #ffffff; line-height: 1.3; margin: 20px 0 12px; }
    p { font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; font-size: 14px; color: #71717a; line-height: 1.6; margin: 0 0 16px; }
    .card { background-color: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 20px 24px; margin: 24px 0; width: 100%; }
    .invite-code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 24px; font-weight: 900; letter-spacing: 4px; color: #818cf8; background-color: rgba(79,70,229,0.08); border: 1px dashed rgba(79,70,229,0.3); border-radius: 10px; padding: 16px; text-align: center; margin: 20px 0; }
    .btn { display: inline-block; padding: 16px 32px; background-color: #4f46e5; color: #ffffff !important; text-decoration: none; border-radius: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; font-size: 15px; font-weight: 700; text-align: center; }
    .footer { padding: 24px; background-color: #0c0c0e; border-top: 1px solid #27272a; text-align: center; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #09090b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #09090b;">
    <tr>
      <td align="center" style="padding: 20px;">
        <table class="main-table" border="0" cellspacing="0" cellpadding="0">
          <!-- Header -->
          <tr>
            <td align="center" style="background-color: #000000; padding: 24px 32px; border-bottom: 1px solid #27272a;">
              <img src="https://ik.imagekit.io/dypkhqxip/Screenshot_2026-03-04_at_20.33.46-removebg-preview.png" width="180" alt="DevHack Logo" style="display: block; outline: none; border: none; text-decoration: none;">
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="content-cell">
              <span class="eyebrow">Team Invite</span>
              <h1>Workspace Invitation</h1>
              <p>Hello,</p>
              <p><strong style="color: #e4e4e7;">${senderName}</strong> has invited you to collaborate on <strong style="color: #ffffff;">${teamName}</strong> for the project <strong>${projectName}</strong>.</p>
              
              <table class="card" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding-bottom: 8px; font-family: sans-serif; font-size: 11px; font-weight: 700; color: #52525b; text-transform: uppercase; letter-spacing: 1px;">Team Name</td>
                  <td align="right" style="padding-bottom: 8px; font-family: sans-serif; font-size: 14px; font-weight: 600; color: #e4e4e7;">${teamName}</td>
                </tr>
                <tr>
                  <td style="font-family: sans-serif; font-size: 11px; font-weight: 700; color: #52525b; text-transform: uppercase; letter-spacing: 1px;">Project</td>
                  <td align="right" style="font-family: sans-serif; font-size: 14px; font-weight: 600; color: #e4e4e7;">${projectName}</td>
                </tr>
              </table>

              <p style="text-align: center; font-family: sans-serif; font-size: 11px; color: #52525b; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 32px; margin-bottom: 8px;">Use this invite code to join</p>
              <div class="invite-code">${inviteCode}</div>

              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 32px; margin-bottom: 32px;">
                <tr>
                  <td align="center">
                    <a href="${inviteLink}" class="btn">Join Workspace Now</a>
                  </td>
                </tr>
              </table>

              <hr style="border: none; border-top: 1px solid #27272a; margin: 32px 0;" />
              <p style="font-family: sans-serif; font-size: 12px; color: #3f3f46; margin: 0;">Trouble with the button? Copy this link:<br />
                <a href="${inviteLink}" style="color: #818cf8; text-decoration: none; word-break: break-all;">${inviteLink}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer">
              <p style="margin: 0; font-family: sans-serif; font-size: 11px; color: #3f3f46;">© ${new Date().getFullYear()} DevHack · Built for Hackathon Teams</p>
              <p style="margin-top: 8px; font-family: sans-serif; font-size: 10px; color: #27272a;">This is an automated invitation. If you didn't expect this, please ignore.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
            `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully via Gmail:", info.messageId);
    return { success: true, data: info };
  } catch (error) {
    console.error("Gmail send error:", error);
    return { success: false, error };
  }
}

export async function sendPasswordResetEmail(
  toEmail: string,
  resetToken: string,
  userName: string
) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
  const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;
  const fromEmail = process.env.GMAIL_USER;

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error("ERROR: GMAIL credentials missing. Emails cannot be sent.");
    return { success: false, error: new Error("GMAIL_USER or GMAIL_APP_PASSWORD missing") };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"DevHack" <${fromEmail}>`,
      to: toEmail,
      subject: `Reset your DevHack password`,
      html: `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DevHack Password Reset</title>
  <style>
    body { margin: 0; padding: 0; background-color: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; }
    .main-table { width: 100%; max-width: 560px; margin: 40px auto; background-color: #111113; border: 1px solid #27272a; border-radius: 16px; overflow: hidden; }
    .content-cell { padding: 40px 32px; text-align: center; }
    h1 { font-size: 24px; font-weight: 800; color: #ffffff; margin: 0 0 16px; }
    p { font-size: 14px; color: #71717a; line-height: 1.6; margin: 0 0 24px; }
    .btn { display: inline-block; padding: 14px 28px; background-color: #4f46e5; color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: 700; margin-bottom: 32px; }
    .footer { padding: 24px; background-color: #0c0c0e; border-top: 1px solid #27272a; text-align: center; font-size: 11px; color: #3f3f46; }
  </style>
</head>
<body>
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 20px;">
        <table class="main-table" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="background-color: #000000; padding: 24px; border-bottom: 1px solid #27272a;">
              <img src="https://ik.imagekit.io/dypkhqxip/Screenshot_2026-03-04_at_20.33.46-removebg-preview.png" width="140" alt="DevHack Logo">
            </td>
          </tr>
          <tr>
            <td class="content-cell">
              <h1>Password Reset Request</h1>
              <p>Hello ${userName},<br/><br/>We received a request to reset the password for your DevHack account. Click the button below to choose a new password. This link will expire in 1 hour.</p>
              <a href="${resetLink}" class="btn">Reset Password</a>
              <p style="font-size: 12px; margin-bottom: 0;">If you didn't request this, you can safely ignore this email.</p>
            </td>
          </tr>
          <tr>
            <td class="footer">
              © ${new Date().getFullYear()} DevHack. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, data: info };
  } catch (error) {
    console.error("Password reset email error:", error);
    return { success: false, error };
  }
}

export { generateProfessionalCode };
