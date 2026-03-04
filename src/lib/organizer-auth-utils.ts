import { cookies } from "next/headers";

export async function getOrganizerId() {
    const cookieStore = await cookies();
    return cookieStore.get("organizerId")?.value;
}

export async function setOrganizerId(organizerId: string) {
    const cookieStore = await cookies();
    cookieStore.set("organizerId", organizerId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7 // 1 week
    });
}

export async function removeOrganizerId() {
    const cookieStore = await cookies();
    cookieStore.delete("organizerId");
}
