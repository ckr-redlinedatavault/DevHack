"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutGrid,
    PlusCircle,
    Settings,
    LogOut,
    Zap
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function OrganizerHubSidebar({ organizerName }: { organizerName: string }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch("/api/logout", { method: "POST" });
        router.push("/organizer/login");
    };

    const navItems = [
        { name: "My Events", href: "/organizer/dashboard", icon: LayoutGrid },
        { name: "New Event", href: "/organizer/onboarding", icon: PlusCircle },
        { name: "Settings", href: "/organizer/dashboard/settings", icon: Settings },
    ];

    return (
        <aside className="w-20 bg-black border-r border-white/5 flex flex-col fixed inset-y-0 z-50 transition-all group">
            <div className="p-6 flex flex-col items-center">
                <div className="w-10 h-10 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-all duration-300 mb-10">
                    <Zap className="w-5 h-5 text-white" />
                </div>
            </div>

            <nav className="flex-grow p-3 space-y-4 flex flex-col items-center">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={item.name}
                            className={`p-3 rounded-2xl transition-all ${isActive
                                    ? "bg-rose-500 text-white shadow-xl shadow-rose-500/20"
                                    : "text-zinc-600 hover:text-rose-500 hover:bg-rose-500/5 hover:scale-110"
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "opacity-80"}`} />
                        </Link>
                    );
                })}
            </nav>

            <div className="p-3 mb-6 flex flex-col items-center">
                <button
                    onClick={handleLogout}
                    className="p-3 rounded-2xl text-zinc-600 hover:text-rose-500 hover:bg-rose-500/5 transition-all group"
                    title="Sign Out"
                >
                    <LogOut className="w-5 h-5 group-hover:-translate-x-0.5" />
                </button>
            </div>
        </aside>
    );
}
