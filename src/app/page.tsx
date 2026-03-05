"use client";

import Link from "next/link";
import { ArrowRight, Zap, Github, Terminal, Activity, Layers } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-[#000000] text-zinc-400 selection:bg-[#4f46e5]/30 font-sans overflow-hidden flex flex-col relative tracking-tight">

      {/* Background Subtle Tech Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />

      {/* Floating Ambient Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#4f46e5]/5 blur-[120px] rounded-full -z-10 animate-pulse transition-all duration-1000" />

      {/* 1. Dynamic Header Navigation */}
      <header className="relative flex-none w-full px-6 md:px-12 py-6 flex items-center justify-between z-50 max-w-[90rem] mx-auto border-b border-white/[0.03]">
        <div className="flex items-center gap-6">
          <Image
            src="https://ik.imagekit.io/dypkhqxip/Screenshot_2026-03-04_at_20.33.46-removebg-preview.png"
            alt="DevHack Logo"
            width={140}
            height={35}
            priority
            className="h-7 md:h-8 w-auto object-contain transition-all duration-500 hover:brightness-150"
          />
          <div className="hidden md:flex h-3 w-px bg-white/5" />
          <div className="hidden md:flex items-center gap-4 text-[9px] font-medium text-zinc-600 uppercase tracking-[0.2em]">
            <span className="flex items-center gap-1.5"><Activity className="w-2.5 h-2.5 text-emerald-500" /> Operational</span>
            <span className="flex items-center gap-1.5"><Layers className="w-2.5 h-2.5" /> v2.4.0</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="text-[10px] font-medium text-zinc-500 hover:text-white transition-all uppercase tracking-widest"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-5 py-2 bg-white text-black text-[10px] font-medium rounded-lg transition-all duration-300 hover:bg-[#4f46e5] hover:text-white uppercase tracking-widest"
          >
            Join
          </Link>
        </div>
      </header>

      {/* 2. Surgical Main Content - Centered & Refined */}
      <main className="flex-1 relative flex flex-col justify-center items-center px-6 md:px-12 w-full max-w-[90rem] mx-auto z-10 py-20 text-center">
        <div className="space-y-10 w-full max-w-3xl flex flex-col items-center">

          {/* Status Chip */}
          <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/[0.01] border border-white/[0.03] backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="w-1 h-1 rounded-full bg-[#4f46e5] animate-ping" />
            <span className="text-[9px] font-medium text-[#4f46e5] uppercase tracking-[0.2em]">Environment Status</span>
            <div className="w-px h-2.5 bg-white/10" />
            <span className="text-[9px] font-normal text-zinc-500">System was set for the Beta leveled Tester instance</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1] text-white animate-in fade-in slide-in-from-bottom-8 duration-700">
              Build <span className="text-zinc-600 italic font-light">Beyond</span> Limits.
            </h1>
            <p className="max-w-lg mx-auto text-xs md:text-sm text-zinc-500 font-normal leading-relaxed tracking-normal opacity-70 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              A surgical-grade workspace engineered for absolute speed, precision, and collaborative excellence in global competitive hacking.
            </p>
          </div>

          {/* Action Grid - Smaller & Minimal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
            <Link
              href="/dashboard"
              className="group flex items-center justify-between p-5 bg-[#080808] border border-white/[0.02] rounded-2xl hover:border-[#4f46e5]/30 transition-all duration-500 hover:bg-[#0a0a0a]"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-[#4f46e5]/20 group-hover:text-[#4f46e5] transition-colors duration-500 text-zinc-500">
                  <Terminal className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-medium text-white tracking-tight">Participate</h3>
                  <p className="text-[10px] text-zinc-600 mt-0.5">Enter command center</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500 text-[#4f46e5]" />
            </Link>

            <Link
              href="/organizer/login"
              className="group flex items-center justify-between p-5 bg-[#080808] border border-white/[0.02] rounded-2xl hover:border-rose-500/30 transition-all duration-500 hover:bg-[#0a0a0a]"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-rose-500/20 group-hover:text-rose-500 transition-colors duration-500 text-zinc-500">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-medium text-white tracking-tight">Organize</h3>
                  <p className="text-[10px] text-zinc-600 mt-0.5">Manage event logistics</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500 text-rose-500" />
            </Link>
          </div>
        </div>
      </main>

      {/* 3. High-Precision Footer */}
      <footer className="relative flex-none w-full px-6 md:px-12 py-8 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/[0.03] z-50">
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center gap-5 text-[8px] font-medium text-zinc-700 uppercase tracking-[0.3em]">
            <span>© 2026 Platform</span>
            <span className="w-0.5 h-0.5 rounded-full bg-zinc-800" />
            <span>Encrypted Sync</span>
            <span className="w-0.5 h-0.5 rounded-full bg-zinc-800" />
            <span>SLA 99.9%</span>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <Link href="https://github.com/RishiRohanKalapala/DevHack" target="_blank" className="flex items-center gap-2 group text-zinc-700 hover:text-white transition-colors duration-300">
            <Github className="w-4 h-4" />
            <span className="text-[9px] font-medium uppercase tracking-[0.2em]">Source</span>
          </Link>
          <div className="flex items-center gap-3 text-zinc-800 font-mono text-[8px] uppercase tracking-widest font-bold">
            <div className="w-1 h-1 rounded-full bg-emerald-500/50" />
            Kernel Verified
          </div>
        </div>
      </footer>

    </div>
  );
}