"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUsers() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { id: "desc" },
        });
        return { success: true, data: users };
    } catch (error: any) {
        console.error("Failed to fetch users:", error);
        return { success: false, error: error.message || "Failed to fetch users" };
    }
}

export async function createUser(formData: FormData) {
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;

    if (!email) {
        return { success: false, error: "Email is required" };
    }

    try {
        const user = await prisma.user.create({
            data: {
                email,
                name: name || "Test User",
                password: null,
            },
        });
        revalidatePath("/db-test");
        return { success: true, data: user };
    } catch (error: any) {
        console.error("Failed to create user:", error);
        return { success: false, error: error.message || "Failed to create user" };
    }
}

export async function checkConnection() {
    try {
        await prisma.$queryRaw`SELECT 1`;
        return { success: true, message: "Connected successfully" };
    } catch (error: any) {
        console.error("Database connection failed:", error);
        let message = error.message || "Connection failed";

        // Check for common IPv6/Supabase connection issues
        if (message.includes("ENOTFOUND") || message.includes("Can't reach database server")) {
            message = "Connection Error: The database host could not be resolved. This is often due to IPv6-only settings in Supabase. Please use the 'Connection Pooler' URL (Port 6543) from your Supabase settings.";
        }

        return { success: false, error: message };
    }
}
