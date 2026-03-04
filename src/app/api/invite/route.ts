import { NextResponse } from "next/server";
import { sendInviteEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth-utils";

export async function POST(req: Request) {
    try {
        const userId = await getUserId();

        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { email, teamId } = await req.json();

        if (!email || !teamId) {
            return NextResponse.json({ message: "Email and teamId are required" }, { status: 400 });
        }

        // Get team details + verify sender is a member
        const team = await prisma.team.findUnique({
            where: { id: teamId },
            include: {
                members: {
                    where: { userId },
                    include: {
                        user: { select: { name: true } }
                    }
                }
            }
        });

        if (!team || team.members.length === 0) {
            return NextResponse.json({ message: "Team not found or access denied" }, { status: 403 });
        }

        const senderName = team.members[0].user.name;

        const result = await sendInviteEmail(
            email,
            team.inviteCode,
            team.name,
            team.projectName,
            senderName
        );

        if (!result?.success) {
            console.error("Resend error details:", JSON.stringify(result?.error, null, 2));
            return NextResponse.json({
                message: "Failed to send email",
                error: (result?.error as any)?.message || "Unknown Resend error"
            }, { status: 500 });
        }

        return NextResponse.json({ message: "Invite sent successfully!" });
    } catch (error: any) {
        console.error("Invite send error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
