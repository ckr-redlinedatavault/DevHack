import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Settings, ShieldCheck, Mail, User } from "lucide-react";

export default async function SettingsPage() {
    const cookieStore = await cookies();
    const organizerId = cookieStore.get("organizerId")?.value;

    if (!organizerId) redirect("/organizer/login");

    const organizer = await prisma.organizer.findUnique({
        where: { id: organizerId },
        select: { name: true, email: true, createdAt: true }
    });

    if (!organizer) redirect("/organizer/login");

    return (
        <div className="space-y-12 max-w-4xl">
            <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic leading-none text-pretty">
                    Account Portal
                </h1>
                <p className="text-zinc-500 text-lg font-medium max-w-xl">
                    Manage your organizer profile, security protocols, and system-wide configurations.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                <div className="bg-[#121214] border border-white/5 p-8 rounded-[32px] space-y-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <ShieldCheck className="w-24 h-24" />
                    </div>
                    <div className="space-y-2 relative z-10">
                        <h3 className="text-xl font-black uppercase tracking-tighter leading-none">Profile Core</h3>
                    </div>
                    <div className="space-y-4 relative z-10">
                        <div className="bg-black border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                            <User className="w-5 h-5 text-rose-500" />
                            <div>
                                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Name</p>
                                <p className="text-sm font-bold text-white">{organizer.name}</p>
                            </div>
                        </div>
                        <div className="bg-black border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                            <Mail className="w-5 h-5 text-rose-500" />
                            <div>
                                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Email Address</p>
                                <p className="text-sm font-bold text-white">{organizer.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-900/30 border border-white/5 p-8 rounded-[32px] flex flex-col justify-center space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                        <Settings className="w-6 h-6 text-zinc-500" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold text-white uppercase tracking-tighter leading-none">Security Access</h3>
                        <p className="text-zinc-500 text-sm font-medium">Your account is fully verified. Membership active since {new Date(organizer.createdAt).toLocaleDateString()}.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
