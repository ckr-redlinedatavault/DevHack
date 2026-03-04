"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function JudgeLogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        const res = await fetch("/api/judge/logout", { method: "POST" });
        if (res.ok) {
            router.push("/judge/login");
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-zinc-600 hover:text-white transition-all group"
        >
            <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Exit Portal</span>
            <LogOut className="w-6 h-6" />
        </button>
    );
}
