import { NextResponse } from "next/headers";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";
import { getOrganizerId } from "@/lib/organizer-auth-utils";

export async function POST(req: Request, { params }: { params: { eventId: string } }) {
    try {
        const organizerId = await getOrganizerId();
        const { eventId } = await params;

        if (!organizerId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const event = await prisma.hackathonEvent.findUnique({
            where: { id: eventId, organizerId },
            include: { registrations: { where: { status: "PENDING" } } },
        });

        if (!event) {
            return NextResponse.json({ message: "Event not found" }, { status: 404 });
        }

        if (event.registrations.length === 0) {
            return NextResponse.json({ message: "No pending registrations" }, { status: 400 });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
        const liveEventUrl = `${baseUrl}/event/${eventId}/live`;

        // Send emails and update status concurrently
        const emailPromises = event.registrations.map(async (reg) => {
            const mailOptions = {
                from: `"DevHack Organizer" <${process.env.GMAIL_USER}>`,
                to: reg.leadEmail,
                subject: `You're invited to ${event.name}!`,
                html: `
                <div style="font-family: sans-serif; padding: 20px; background-color: #09090b; color: white;">
                    <h1 style="color: #10b981;">Access Granted!</h1>
                    <p>Hello ${reg.teamName} team lead,</p>
                    <p>Your team's registration for <strong>${event.name}</strong> has been officially approved.</p>
                    <p>You can access the live hackathon status portal and timer here:</p>
                    <a href="${liveEventUrl}" style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: black;text-decoration: none; font-weight: bold; border-radius: 8px; margin-top: 20px;">
                        Enter Live Status Portal
                    </a>
                </div>
                `,
            };

            await transporter.sendMail(mailOptions);

            return prisma.eventRegistration.update({
                where: { id: reg.id },
                data: { status: "INVITED" },
            });
        });

        await Promise.all(emailPromises);

        return NextResponse.json({ message: "Invitations sent successfully" }, { status: 200 });

    } catch (error) {
        console.error("Invite sending error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
