import { NextResponse } from "next/headers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { setOrganizerId } from "@/lib/organizer-auth-utils";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const existingOrganizer = await prisma.organizer.findUnique({
            where: { email },
        });

        if (existingOrganizer) {
            return NextResponse.json({ message: "Organizer with this email already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const organizer = await prisma.organizer.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        await setOrganizerId(organizer.id);

        return NextResponse.json({ message: "Registration successful" }, { status: 201 });
    } catch (error) {
        console.error("Organizer registration error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
