import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { setUserId } from "@/lib/auth-utils";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (!user.email) return false;

            try {
                // Find or create user in our database
                let dbUser = await prisma.user.findUnique({
                    where: { email: user.email },
                });

                if (!dbUser) {
                    dbUser = await prisma.user.create({
                        data: {
                            email: user.email,
                            name: user.name || "User",
                            password: "", // Handled by making it optional in schema
                        },
                    });
                }

                // Compatibility: Set the custom userId cookie used by the rest of the app
                await setUserId(dbUser.id);

                return true;
            } catch (error) {
                console.error("Google Sign-In Error:", error);
                return false;
            }
        },
        async redirect({ url, baseUrl }) {
            return "/dashboard";
        },
    },
    pages: {
        signIn: "/login",
    },
});

export { handler as GET, handler as POST };
