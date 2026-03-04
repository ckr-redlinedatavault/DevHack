import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
  const fromEmail = process.env.EMAIL_FROM || "DevHack <onboarding@resend.dev>";

  console.log(`Attempting to send email to ${toEmail} from ${fromEmail}`);

  try {
    const data = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `${senderName} invited you to join ${teamName} on DevHack`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DevHack Invite</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; padding: 40px 20px; }
    .container { max-width: 560px; margin: 0 auto; background: #111113; border: 1px solid #27272a; border-radius: 16px; overflow: hidden; }
    .header { background: #000; padding: 32px; border-bottom: 1px solid #27272a; display: flex; align-items: center; gap: 12px; }
    .logo { width: 40px; height: 40px; background: #4f46e5; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 18px; color: white; }
    .brand { font-size: 20px; font-weight: 800; color: white; letter-spacing: -0.5px; }
    .body { padding: 40px 32px; }
    .eyebrow { display: inline-block; padding: 4px 12px; background: rgba(79,70,229,0.1); border: 1px solid rgba(79,70,229,0.2); border-radius: 100px; color: #818cf8; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 20px; }
    h1 { font-size: 26px; font-weight: 800; color: #ffffff; line-height: 1.3; margin-bottom: 12px; }
    p { font-size: 14px; color: #71717a; line-height: 1.6; margin-bottom: 16px; }
    .card { background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 20px 24px; margin: 24px 0; }
    .card-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .card-row:last-child { margin-bottom: 0; }
    .card-label { font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #52525b; }
    .card-value { font-size: 14px; font-weight: 600; color: #e4e4e7; }
    .invite-code { font-family: monospace; font-size: 22px; font-weight: 900; letter-spacing: 4px; color: #818cf8; background: rgba(79,70,229,0.08); border: 1px dashed rgba(79,70,229,0.3); border-radius: 10px; padding: 14px 20px; text-align: center; margin: 24px 0; }
    .btn { display: block; width: 100%; padding: 16px; background: #4f46e5; color: white; text-decoration: none; text-align: center; border-radius: 12px; font-size: 15px; font-weight: 700; letter-spacing: -0.3px; margin: 24px 0; }
    .btn:hover { background: #4338ca; }
    .divider { border: none; border-top: 1px solid #27272a; margin: 24px 0; }
    .link-fallback { font-size: 12px; color: #52525b; word-break: break-all; }
    .link-fallback a { color: #818cf8; text-decoration: none; }
    .footer { padding: 20px 32px; background: #0c0c0e; border-top: 1px solid #27272a; text-align: center; }
    .footer p { font-size: 11px; color: #3f3f46; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">D</div>
      <div class="brand">DevHack</div>
    </div>

    <div class="body">
      <div class="eyebrow">Team Invite</div>
      <h1>You've been invited to join a hackathon workspace</h1>
      <p><strong style="color:#e4e4e7">${senderName}</strong> has invited you to collaborate on their DevHack project.</p>

      <div class="card">
        <div class="card-row">
          <span class="card-label">Team</span>
          <span class="card-value">${teamName}</span>
        </div>
        <div class="card-row">
          <span class="card-label">Project</span>
          <span class="card-value">${projectName}</span>
        </div>
      </div>

      <p style="text-align:center; font-size:12px; color:#52525b; margin-bottom:4px;">YOUR INVITE CODE</p>
      <div class="invite-code">${inviteCode}</div>

      <a href="${inviteLink}" class="btn">Join Workspace →</a>

      <hr class="divider" />
      <p class="link-fallback">Or copy this link into your browser:<br/><a href="${inviteLink}">${inviteLink}</a></p>
    </div>

    <div class="footer">
      <p>If you were not expecting this invite, you can safely ignore this email.</p>
      <p style="margin-top:6px;">© ${new Date().getFullYear()} DevHack · Built for Hackers</p>
    </div>
  </div>
</body>
</html>
            `,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}

export { generateProfessionalCode };
