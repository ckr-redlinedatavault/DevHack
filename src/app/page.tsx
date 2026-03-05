"use client";

import Link from "next/link";
import { ArrowRight, Zap, Github, Terminal, Activity, Layers, Users, AlertTriangle, AlertCircle } from "lucide-react";
import Image from "next/image";
import BottomBanner from "@/components/BottomBar";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-[#000000] text-zinc-400 selection:bg-[#4f46e5]/30 font-sans overflow-hidden flex flex-col relative tracking-tight">

      {/* Background Subtle Tech Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />

      {/* Floating Ambient Glow (The Highlight) */}
      <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-[#4f46e5]/10 blur-[140px] rounded-full -z-10 animate-pulse transition-all duration-1000" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#4f46e5]/5 blur-[120px] rounded-full -z-10 animate-pulse transition-all duration-1000" />

      {/* 1. Solid Navbar (Header) */}
      <header className="relative flex-none w-full px-6 md:px-12 py-5 flex items-center justify-between z-50 max-w-[90rem] mx-auto border-b border-white/[0.05] bg-black/90 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-10">
          <Image
            src="https://ik.imagekit.io/dypkhqxip/Screenshot_2026-03-04_at_20.33.46-removebg-preview.png"
            alt="DevHack Logo"
            width={200}
            height={50}
            priority
            className="h-10 md:h-12 w-auto object-contain transition-all duration-500 hover:brightness-150"
          />
          <div className="hidden lg:flex h-4 w-px bg-white/10" />
          <div className="hidden lg:flex items-center gap-5 text-[10px] font-medium text-zinc-500 uppercase tracking-[0.2em]">
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Operational</span>
            <span className="flex items-center gap-2"><AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> <span className="text-rose-500 font-bold">Beta Build 2.4.0</span></span>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-6 pr-4 border-r border-white/5">
            <Link href="https://github.com/RishiRohanKalapala/DevHack" target="_blank" className="text-zinc-500 hover:text-white transition-all">
              <Github className="w-4.5 h-4.5" />
            </Link>
          </div>
          <Link
            href="/login"
            className="text-[10px] font-medium text-zinc-400 hover:text-white transition-all uppercase tracking-widest"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-6 py-2 bg-[#4f46e5] text-white text-[10px] font-bold rounded-lg transition-all duration-300 hover:bg-[#4338ca] hover:scale-105 active:scale-95 uppercase tracking-widest shadow-[0_0_15px_rgba(79,70,229,0.3)]"
          >
            Join Mission
          </Link>
        </div>
      </header>

      {/* 2. Surgical Main Content - Centered & Highlighted */}
      <main className="flex-1 relative flex flex-col justify-center items-center px-6 md:px-12 w-full max-w-[90rem] mx-auto z-10 py-16 text-center">
        <div className="relative w-full max-w-5xl flex flex-col items-center p-12 md:p-24 rounded-[3rem] bg-gradient-to-b from-white/[0.02] to-transparent border border-white/[0.05] backdrop-blur-[2px] space-y-12 shadow-2xl overflow-hidden group/hero">
          {/* Subtle Inner Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-[#4f46e5]/20 to-transparent" />
          <div className="absolute inset-0 bg-blue-500/[0.01] pointer-events-none" />

          {/* Status Message Highlight */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-[#4f46e5]/5 border border-[#4f46e5]/20 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="w-1.5 h-1.5 rounded-full bg-[#4f46e5] animate-ping" />
            <span className="text-[10px] font-bold text-[#4f46e5] uppercase tracking-[0.2em]">Alert</span>
            <div className="w-px h-3 bg-[#4f46e5]/20" />
            <span className="text-[10px] font-medium text-zinc-300">System was set for the Beta leveled Tester instance</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-[1.05] text-white animate-in fade-in slide-in-from-bottom-8 duration-700">
              Build <span className="text-[#4f46e5]">Beyond</span> Limits.
            </h1>
            <p className="max-w-xl mx-auto text-xs md:text-sm text-zinc-500 font-normal leading-relaxed tracking-normal opacity-80 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              DevHack is the surgical-grade workspace for the next generation of builders. Engineered for absolute speed, precision, and collaborative excellence.
            </p>
          </div>

          {/* Action Boxes - 3 Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-4xl">
            <Link
              href="/dashboard"
              className="group flex items-center justify-between p-6 bg-[#0a0a0a] border border-white/[0.05] rounded-2xl hover:border-[#4f46e5]/40 transition-all duration-500 hover:bg-[#121214] shadow-2xl"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-[#4f46e5]/10 rounded-xl group-hover:bg-[#4f46e5] group-hover:text-white transition-all duration-500 text-[#4f46e5]">
                  <Terminal className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-medium text-white tracking-tight">Participate</h3>
                  <p className="text-[10px] text-zinc-600 mt-1">Command center</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500 text-[#4f46e5]" />
            </Link>

            <Link
              href="/join-team-preview"
              className="group flex items-center justify-between p-6 bg-[#0a0a0a] border border-white/[0.05] rounded-2xl hover:border-emerald-500/40 transition-all duration-500 hover:bg-[#121214] shadow-2xl"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-emerald-500/10 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 text-emerald-500">
                  <Users className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-medium text-white tracking-tight">Join Team</h3>
                  <p className="text-[10px] text-zinc-600 mt-1">Enter invite code</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500 text-emerald-500" />
            </Link>

            <Link
              href="/organizer/login"
              className="group flex items-center justify-between p-6 bg-[#0a0a0a] border border-white/[0.05] rounded-2xl hover:border-rose-500/40 transition-all duration-500 hover:bg-[#121214] shadow-2xl"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-rose-500/10 rounded-xl group-hover:bg-rose-500 group-hover:text-white transition-all duration-500 text-rose-500">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-medium text-white tracking-tight">Organize</h3>
                  <p className="text-[10px] text-zinc-600 mt-1">Event logistics</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500 text-rose-500" />
            </Link>
          </div>
        </div>
      </main>

      <BottomBanner />

    </div>
  );
}