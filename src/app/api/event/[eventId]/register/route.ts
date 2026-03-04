import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setUserId } from "@/lib/auth-utils";

export async function POST(req: Request, { params }: { params: Promise<{ eventId: string }> }) {
    try {
        const { eventId } = await params;
        const { teamName, leadEmail } = await req.json();

        if (!teamName || !leadEmail) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const event = await prisma.hackathonEvent.findUnique({
            where: { id: eventId },
        });

        if (!event) {
            return NextResponse.json({ message: "Event not found" }, { status: 404 });
        }

        const existingRegistration = await prisma.eventRegistration.findFirst({
            where: { eventId, leadEmail },
        });

        if (existingRegistration) {
            return NextResponse.json({ message: "A team lead with this email is already registered." }, { status: 400 });
        }

        // 1. Create EventRegistration as INVITED (Auto-approve for seamless flow)
        const registration = await prisma.eventRegistration.create({
            data: {
                eventId,
                teamName,
                leadEmail,
                status: "INVITED"
            },
        });

        // 2. Create or Find User to establish session
        let user = await prisma.user.findUnique({ where: { email: leadEmail } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: leadEmail,
                    name: teamName + " Lead",
                }
            });
        }

        // 3. Set the session cookie
        await setUserId(user.id);

        // 4. Redirect to onboarding so they can "Create Workspace" properly
        return NextResponse.json({
            message: "Registration successful. Welcome aboard!",
            registration,
            redirectTo: "/onboarding"
        }, { status: 201 });

    } catch (error) {
        console.error("Public registration error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
