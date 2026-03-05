"use client";

import Link from "next/link";
import { ArrowRight, Zap, Github, Terminal, Activity, Layers } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-[#000000] text-zinc-400 selection:bg-[#4f46e5]/30 font-sans overflow-hidden flex flex-col relative tracking-tight">

      {/* Background Subtle Tech Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />

      {/* Floating Ambient Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#4f46e5]/5 blur-[120px] rounded-full -z-10 animate-pulse transition-all duration-1000" />

      {/* 1. Dynamic Header Navigation */}
      <header className="relative flex-none w-full px-6 md:px-12 py-8 flex items-center justify-between z-50 max-w-[90rem] mx-auto border-b border-white/[0.03]">
        <div className="flex items-center gap-6">
          <Image
            src="https://ik.imagekit.io/dypkhqxip/Screenshot_2026-03-04_at_20.33.46-removebg-preview.png"
            alt="DevHack Logo"
            width={180}
            height={45}
            priority
            className="h-8 md:h-10 w-auto object-contain transition-all duration-500 hover:brightness-150"
          />
          <div className="hidden md:flex h-4 w-px bg-white/5" />
          <div className="hidden md:flex items-center gap-4 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">
            <span className="flex items-center gap-1.5"><Activity className="w-3 h-3 text-emerald-500" /> Operational</span>
            <span className="flex items-center gap-1.5"><Layers className="w-3 h-3" /> v2.4.0</span>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <Link
            href="/login"
            className="text-[11px] font-bold text-zinc-500 hover:text-white transition-all uppercase tracking-widest"
          >
            Terminal Login
          </Link>
          <Link
            href="/register"
            className="px-6 py-2.5 bg-white text-black text-[11px] font-bold rounded-xl transition-all duration-300 hover:bg-[#4f46e5] hover:text-white uppercase tracking-widest shadow-xl shadow-white/5"
          >
            Join Mission
          </Link>
        </div>
      </header>

      {/* 2. Surgical Main Content */}
      <main className="flex-1 relative flex flex-col justify-center px-6 md:px-12 w-full max-w-[90rem] mx-auto z-10 pt-20 pb-32">
        <div className="space-y-12 w-full max-w-4xl">

          {/* Status Chip */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.02] border border-white/[0.05] backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="w-1.5 h-1.5 rounded-full bg-[#4f46e5] animate-ping" />
            <span className="text-[10px] font-bold text-[#4f46e5] uppercase tracking-[0.2em]">System Alert</span>
            <div className="w-px h-3 bg-white/10" />
            <span className="text-[10px] font-medium text-zinc-500 truncate max-w-[200px] md:max-w-none">Tester Instance active. Contribution requested.</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl lg:text-[7.5rem] font-bold tracking-tighter leading-[0.85] text-white animate-in fade-in slide-in-from-left-8 duration-700">
              Build <br />
              <span className="text-zinc-800 transition-colors duration-1000 hover:text-[#4f46e5]">Beyond</span> Limits.
            </h1>
            <p className="max-w-xl text-sm md:text-lg text-zinc-500 font-medium leading-relaxed tracking-tight opacity-80 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              DevHack is the surgical-grade workspace for the next generation of builders. Engineered for absolute speed, precision, and collaborative dominance in competitive hacking.
            </p>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 auto-cols-min">
            <Link
              href="/dashboard"
              className="group flex flex-col justify-between p-8 bg-[#0a0a0a] border border-white/[0.03] rounded-[2rem] hover:border-[#4f46e5]/50 transition-all duration-500 hover:bg-zinc-950 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-[#4f46e5] transition-colors duration-500">
                  <Terminal className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Participate</h3>
                <p className="text-sm text-zinc-600 font-medium leading-normal">Access your command center and begin the build phase.</p>
              </div>
            </Link>

            <Link
              href="/organizer/login"
              className="group flex flex-col justify-between p-8 bg-[#0a0a0a] border border-white/[0.03] rounded-[2rem] hover:border-rose-500/50 transition-all duration-500 hover:bg-zinc-950 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-rose-500 transition-colors duration-500">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Organize</h3>
                <p className="text-sm text-zinc-600 font-medium leading-normal">Provision custom events and manage logistics with surgical tools.</p>
              </div>
            </Link>
          </div>
        </div>
      </main>

      {/* 3. High-Precision Footer */}
      <footer className="relative flex-none w-full px-6 md:px-12 py-10 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/[0.03] z-50">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-6 text-[9px] font-bold text-zinc-700 uppercase tracking-[0.3em]">
            <span>© 2026 Platform</span>
            <span className="w-1 h-1 rounded-full bg-zinc-800" />
            <span>Encrypted Connection</span>
            <span className="w-1 h-1 rounded-full bg-zinc-800" />
            <span>SLA 99.9%</span>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <Link href="https://github.com/RishiRohanKalapala/DevHack" target="_blank" className="flex items-center gap-2 group text-zinc-600 hover:text-white transition-colors duration-300">
            <Github className="w-5 h-5 group-hover:rotate-[360deg] transition-transform duration-700" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Source</span>
          </Link>
          <div className="flex items-center gap-4 text-zinc-800 font-mono text-[9px] uppercase tracking-widest font-black">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Kernel Stable
          </div>
        </div>
      </footer>

    </div>
  );
}