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
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "https://dev-hack-v2-xi.vercel.app";
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
    body { margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    .main-table { width: 100%; max-width: 500px; margin: 40px auto; background-color: #09090b; border: 1px solid #18181b; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
    .content-cell { padding: 48px 40px; }
    .eyebrow { display: inline-block; padding: 6px 12px; border-radius: 8px; color: #4f46e5; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; background-color: rgba(79,70,229,0.05); border: 1px solid rgba(79,70,229,0.1); margin-bottom: 24px; }
    h1 { font-size: 28px; font-weight: 800; color: #ffffff; line-height: 1.2; margin: 0 0 16px; letter-spacing: -0.02em; }
    p { font-size: 15px; color: #a1a1aa; line-height: 1.6; margin: 0 0 24px; }
    .card { background-color: #000000; border: 1px solid #18181b; border-radius: 20px; padding: 24px; margin: 32px 0; }
    .invite-label { font-size: 10px; font-weight: 800; color: #52525b; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px; display: block; text-align: center; }
    .invite-code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 26px; font-weight: 900; color: #ffffff; text-align: center; margin: 0; }
    .btn { display: block; padding: 18px 32px; background-color: #4f46e5; color: #ffffff !important; text-decoration: none; border-radius: 14px; font-size: 14px; font-weight: 800; text-align: center; box-shadow: 0 10px 20px rgba(79,70,229,0.2); transition: all 0.2s; }
    .footer { padding: 32px 40px; background-color: rgba(255,255,255,0.02); text-align: center; }
    .footer-text { font-size: 11px; color: #3f3f46; margin: 0; line-height: 1.5; }
    .logo-container { padding: 40px 0 0; text-align: center; }
    .logo-img { height: 32px; width: auto; display: inline-block; margin-bottom: 12px; filter: brightness(1.2); }
  </style>
</head>
<body>
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #000000;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table class="main-table" border="0" cellspacing="0" cellpadding="0">
          <!-- Header Logo -->
          <tr>
            <td class="logo-container">
               <img src="https://ik.imagekit.io/dypkhqxip/Screenshot_2026-03-04_at_20.33.46-removebg-preview.png" alt="DevHack" class="logo-img" />
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="content-cell">
              <span class="eyebrow">Transmission Received</span>
              <h1>Join the mission.</h1>
              <p>Hello,</p>
              <p><strong style="color: #ffffff;">${senderName}</strong> has provisioned a slot for you to join <strong style="color: #4f46e5;">${teamName}</strong> for the build phase of <strong style="color: #ffffff;">${projectName}</strong>.</p>
              
              <div class="card">
                <span class="invite-label">Official Invite Code</span>
                <div class="invite-code">${inviteCode}</div>
              </div>

              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 40px;">
                <tr>
                  <td align="center">
                    <a href="${inviteLink}" class="btn">Initialize Workspace Access</a>
                  </td>
                </tr>
              </table>

              <div style="margin-top: 48px; padding-top: 32px; border-top: 1px solid #18181b;">
                <p style="font-size: 12px; color: #3f3f46; margin-bottom: 4px;">Direct link relay:</p>
                <a href="${inviteLink}" style="color: #52525b; text-decoration: none; word-break: break-all; font-size: 11px;">${inviteLink}</a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer">
              <p class="footer-text">© ${new Date().getFullYear()} DevHack. Mission Critical Infrastructure.</p>
              <p class="footer-text" style="color: #27272a; margin-top: 8px;">If this wasn't expected, please disregard this transmission.</p>
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
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "https://dev-hack-v2-xi.vercel.app";
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
    body { margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .main-table { width: 100%; max-width: 500px; margin: 40px auto; background-color: #09090b; border: 1px solid #18181b; border-radius: 24px; overflow: hidden; }
    .content-cell { padding: 56px 40px; text-align: center; }
    h1 { font-size: 26px; font-weight: 800; color: #ffffff; margin: 0 0 16px; letter-spacing: -0.02em; }
    p { font-size: 15px; color: #a1a1aa; line-height: 1.6; margin: 0 0 32px; }
    .btn { display: inline-block; padding: 18px 36px; background-color: #f43f5e; color: #ffffff !important; text-decoration: none; border-radius: 14px; font-weight: 800; font-size: 14px; box-shadow: 0 10px 20px rgba(244,63,94,0.15); }
    .footer { padding: 32px; background-color: rgba(255,255,255,0.02); text-align: center; font-size: 11px; color: #3f3f46; border-top: 1px solid #18181b; }
    .logo-icon { width: 32px; height: 32px; background-color: #f43f5e; border-radius: 10px; display: inline-block; margin-bottom: 24px; line-height: 32px; color: white; font-weight: 900; font-size: 18px; text-align: center; }
  </style>
</head>
<body>
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table class="main-table" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td class="content-cell">
              <div class="logo-icon">V</div>
              <h1>Restore access.</h1>
              <p>Hello ${userName},<br/><br/>We received a request to recalibrate the security credentials for your DevHack account. Click below to continue. This link expires in 60 minutes.</p>
              <a href="${resetLink}" class="btn">Reset Password</a>
              <p style="font-size: 12px; margin-top: 40px; margin-bottom: 0; color: #3f3f46;">If you didn't initiate this request, no action is required.</p>
            </td>
          </tr>
          <tr>
            <td class="footer">
              © ${new Date().getFullYear()} DevHack. Global Security Infrastructure.
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
