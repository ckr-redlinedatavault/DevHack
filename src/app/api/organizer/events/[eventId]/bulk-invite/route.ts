import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";
import { getOrganizerId } from "@/lib/organizer-auth-utils";

export async function POST(req: Request, { params }: { params: Promise<{ eventId: string }> }) {
  try {
    const organizerId = await getOrganizerId();
    const { eventId } = await params;
    const { emails } = await req.json(); // Array of { teamName, email }

    if (!organizerId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json({ message: "No data provided" }, { status: 400 });
    }

    const event = await prisma.hackathonEvent.findUnique({
      where: { id: eventId, organizerId },
    });

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "https://dev-hack-v2-xi.vercel.app";
    const liveEventUrl = `${baseUrl}/event/${eventId}/live`;

    console.log("Bulk Dispatch Started for Event:", eventId);
    console.log("Recipient Queue Size:", emails.length);

    // Verify transporter connection once
    try {
      console.log("[SMTP] Verifying Connection...");
      await transporter.verify();
      console.log("[SMTP] Connection Verified. Ready to send.");
    } catch (verifyError: any) {
      console.error("[SMTP] Connection Check Failed:", verifyError);
      throw new Error(`SMTP Connection Error: ${verifyError.message}`);
    }

    const invitationResults = [];
    const errors = [];

    for (const entry of emails) {
      try {
        const cleanEmail = entry.email.replace(/['"]/g, "").trim().toLowerCase();
        const cleanTeamName = entry.teamName.trim() || cleanEmail.split('@')[0];
        if (!cleanEmail) continue;

        console.log(`Processing Dispatch for: ${cleanTeamName} (${cleanEmail})`);

        // 1. Create registration if not exists
        let registration;
        try {
          registration = await prisma.eventRegistration.findFirst({
            where: { eventId, leadEmail: cleanEmail }
          });

          if (!registration) {
            console.log(`[DB] Creating New Registration for ${cleanEmail}`);
            registration = await prisma.eventRegistration.create({
              data: {
                eventId,
                leadEmail: cleanEmail,
                teamName: cleanTeamName,
                status: "PENDING"
              }
            });
          } else {
            console.log(`[DB] Updating Existing Registration for ${cleanEmail}`);
            await prisma.eventRegistration.update({
              where: { id: registration.id },
              data: { teamName: cleanTeamName }
            });
          }
        } catch (dbErr: any) {
          console.error("[DB ERROR]", dbErr);
          errors.push(`Database error for ${cleanEmail}: ${dbErr.message}`);
          continue;
        }

        // 2. Send Email
        console.log(`[MAIL] Dispatching Entry Email to ${cleanEmail}`);
        const mailOptions = {
          from: `"DevHack Organizer" <${process.env.GMAIL_USER}>`,
          to: cleanEmail,
          subject: `Approval Granted: Welcome to ${event.name}!`,
          html: `
          <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
          <html xmlns="http://www.w3.org/1999/xhtml">
          <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>DevHack Approval</title>
            <style>
              body { margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
              .main-table { width: 100%; max-width: 500px; margin: 40px auto; background-color: #09090b; border: 1px solid #18181b; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
              .content-cell { padding: 48px 40px; }
              .eyebrow { display: inline-block; padding: 6px 12px; border-radius: 8px; color: #4f46e5; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; background-color: rgba(79,70,229,0.05); border: 1px solid rgba(79,70,229,0.1); margin-bottom: 24px; }
              h1 { font-size: 28px; font-weight: 800; color: #ffffff; line-height: 1.2; margin: 0 0 16px; letter-spacing: -0.02em; }
              p { font-size: 15px; color: #a1a1aa; line-height: 1.6; margin: 0 0 24px; }
              .btn { display: block; padding: 18px 32px; background-color: #4f46e5; color: #ffffff !important; text-decoration: none; border-radius: 14px; font-size: 14px; font-weight: 800; text-align: center; box-shadow: 0 10px 20px rgba(79,70,229,0.2); }
              .footer { padding: 32px 40px; background-color: rgba(255,255,255,0.02); text-align: center; border-top: 1px solid #18181b; }
              .footer-text { font-size: 11px; color: #3f3f46; margin: 0; }
              .logo-img { height: 32px; width: auto; display: inline-block; margin-bottom: 24px; filter: brightness(1.2); }
            </style>
          </head>
          <body>
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #000000;">
              <tr>
                <td align="center" style="padding: 40px 20px;">
                  <table class="main-table" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td class="content-cell">
                        <img src="https://ik.imagekit.io/dypkhqxip/Screenshot_2026-03-04_at_20.33.46-removebg-preview.png" alt="DevHack" class="logo-img" />
                        <span class="eyebrow">Access Granted</span>
                        <h1>Welcome to the arena.</h1>
                        <p>Hello ${cleanTeamName} team lead,</p>
                        <p>Your registration for <strong style="color: #ffffff;">${event.name}</strong> has been officially approved. The arena is now open for your team.</p>
                        <p>Access the live mission portal to track the timeline, view the synchronized timer, and prepare for the build phase.</p>
                        
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 40px;">
                          <tr>
                            <td align="center">
                              <a href="${liveEventUrl}" class="btn">Enter Live Status Portal</a>
                            </td>
                          </tr>
                          <tr>
                              <td align="center" style="padding-top: 20px;">
                                  <a href="${baseUrl}/onboarding" style="color: #a1a1aa; text-decoration: underline; font-size: 13px; font-weight: 600;">Setup Team Workspace</a>
                              </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td class="footer">
                        <p class="footer-text">© ${new Date().getFullYear()} DevHack. Automated Event Operations.</p>
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
        console.log(`[MAIL] Dispatch Successful. ID: ${info.messageId}. Response: ${info.response}`);

        // 3. Update status to INVITED
        console.log(`[DB] Activating Status to INVITED for ${cleanEmail}`);
        await prisma.eventRegistration.update({
          where: { id: registration.id },
          data: { status: "INVITED" }
        });

        invitationResults.push(cleanEmail);
      } catch (entryError: any) {
        console.error(`[CRITICAL] Entry Dispatch Failed for: ${entry.email}. Error: ${entryError.message}`);
        errors.push(`Failed for ${entry.email}: ${entryError.message}`);
      }
    }

    if (invitationResults.length === 0 && emails.length > 0) {
      return NextResponse.json({
        message: "All dispatches failed",
        errors: errors
      }, { status: 500 });
    }

    console.log("Bulk Dispatch Completed. Results:", invitationResults.length);
    return NextResponse.json({
      message: "Invitations processed",
      results: invitationResults,
      errors: errors.length > 0 ? errors : undefined
    }, { status: 200 });

  } catch (error: any) {
    console.error("Master Bulk invite error:", error);
    return NextResponse.json({ message: `System Error: ${error.message || "Unknown error"}` }, { status: 500 });
  }
}
