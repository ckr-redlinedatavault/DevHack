import { NextResponse } from "next/headers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { setOrganizerId } from "@/lib/organizer-auth-utils";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const organizer = await prisma.organizer.findUnique({
            where: { email },
        });

        if (!organizer || !organizer.password) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        const isValid = await bcrypt.compare(password, organizer.password);

        if (!isValid) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        await setOrganizerId(organizer.id);

        return NextResponse.json({ message: "Login successful" }, { status: 200 });
    } catch (error) {
        console.error("Organizer login error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
