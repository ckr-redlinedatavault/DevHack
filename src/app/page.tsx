"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, Zap, Github, Terminal, Activity, Layers, Users, AlertTriangle, AlertCircle, GitCommit } from "lucide-react";
import Image from "next/image";
import BottomBanner from "@/components/BottomBar";

export default function LandingPage() {
  const [lastCommit, setLastCommit] = useState<string | null>(null);
  const [commitCount, setCommitCount] = useState<number | null>(null);

  useEffect(() => {
    // Fetch last commit hash
    fetch("https://api.github.com/repos/RishiRohanKalapala/DevHack/commits/main")
      .then((res) => res.json())
      .then((data) => {
        if (data.sha) {
          setLastCommit(data.sha.substring(0, 7));
        }
      })
      .catch(() => setLastCommit("7e3a2b1"));

    // Fetch total commit count using Link header trick
    fetch("https://api.github.com/repos/RishiRohanKalapala/DevHack/commits?per_page=1")
      .then((res) => {
        const link = res.headers.get("Link");
        if (link) {
          const match = link.match(/page=(\d+)>; rel="last"/);
          if (match) {
            setCommitCount(parseInt(match[1]));
          }
        } else {
          // If no link header, it might have only a few commits (< per_page)
          return res.json().then(data => setCommitCount(data.length));
        }
      })
      .catch(() => setCommitCount(154)); // Fallback
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#000000] text-zinc-400 selection:bg-[#4f46e5]/30 font-sans overflow-hidden flex flex-col relative tracking-tight">

      {/* Background Subtle Tech Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />

      {/* Floating Ambient Glow (The Highlight) */}
      <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-[#4f46e5]/10 blur-[140px] rounded-full -z-10 animate-pulse transition-all duration-1000" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#4f46e5]/5 blur-[120px] rounded-full -z-10 animate-pulse transition-all duration-1000" />

      {/* 1. Solid Navbar (Header) */}
      <header className="relative flex-none w-full px-6 md:px-12 py-5 flex items-center justify-between z-50 max-w-[90rem] mx-auto border-b border-black/10 bg-[#f8f9fa] sticky top-0 shadow-sm transition-all duration-300">
        <div className="flex items-center gap-10">
          <Image
            src="https://ik.imagekit.io/dypkhqxip/Screenshot_2026-03-06_at_04.31.26-removebg-preview.png"
            alt="DevHack Logo"
            width={200}
            height={50}
            priority
            className="h-10 md:h-12 w-auto object-contain transition-all duration-500 hover:scale-105 select-none"
          />
          <div className="hidden lg:flex h-4 w-px bg-black/10" />
          <div className="hidden lg:flex items-center gap-4 text-[10px] font-bold">
            <span className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Operational
            </span>
            <span className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg border border-rose-100">
              <AlertTriangle className="w-3.5 h-3.5" />
              Beta Build 2.4.0
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/RishiRohanKalapala/DevHack"
            target="_blank"
            className="flex items-center gap-2 pr-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 transition-all rounded-lg pl-5 py-2.5"
          >
            <Github className="w-4 h-4" />
            <span className="text-[10px] font-bold hidden sm:inline">GitHub Repository</span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-100 text-[#4f46e5] rounded-md border border-indigo-200 ml-1">
              <GitCommit className="w-3 h-3" />
              <span className="text-[9px] font-black">{commitCount || "..."} Commits</span>
              <div className="w-px h-2.5 bg-indigo-200 mx-0.5" />
              <span className="text-[9px] font-black">{lastCommit || "..."}</span>
            </div>
          </Link>

          <Link
            href="/login"
            className="px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-[10px] font-bold transition-all rounded-lg"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="px-6 py-2.5 bg-[#4f46e5] text-white text-[10px] font-black rounded-lg transition-all duration-300 hover:bg-[#4338ca] hover:scale-105 active:scale-95 shadow-lg shadow-[#4f46e5]/20"
          >
            Join Mission
          </Link>
        </div>
      </header>

      {/* 2. Surgical Main Content - Centered & Highlighted */}
      <main className="flex-1 relative w-full max-w-[90rem] mx-auto px-6 md:px-12 z-10 flex items-center py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">

          <div className="flex flex-col items-start text-left space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">

            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-[#4f46e5] border border-[#4f46e5]/20 shadow-[0_0_20px_rgba(79,70,229,0.2)]">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span className="text-[10px] font-bold text-white">Live Status</span>
              <div className="w-px h-3 bg-white/20" />
              <span className="text-[10px] font-medium text-white/90">System was set for the Beta leveled Tester instance</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-medium tracking-tighter leading-[0.9] text-white">
                Build <br />
                <span className="text-[#4f46e5]">Beyond</span> Limits.
              </h1>
              <p className="max-w-md text-xs md:text-sm text-zinc-500 font-normal leading-relaxed tracking-normal opacity-80">
                DevHack is the surgical-grade workspace for the next generation of builders. Engineered for absolute speed, precision, and collaborative excellence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
              <Link
                href="/dashboard"
                className="group flex items-center justify-between p-5 bg-[#0c0c0c] border border-white/15 rounded-2xl hover:border-[#4f46e5]/40 transition-all duration-500 hover:bg-[#121214] shadow-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-[#4f46e5] rounded-xl text-white transition-all duration-500 shadow-[0_0_15px_rgba(79,70,229,0.2)]">
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
                className="group flex items-center justify-between p-5 bg-[#0c0c0c] border border-white/15 rounded-2xl hover:border-emerald-500/40 transition-all duration-500 hover:bg-[#121214] shadow-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-emerald-600 rounded-xl text-white transition-all duration-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-medium text-white tracking-tight">Join Team</h3>
                    <p className="text-[10px] text-zinc-600 mt-1">Enter code</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500 text-emerald-500" />
              </Link>

              <Link
                href="/organizer/login"
                className="group flex items-center justify-between p-5 bg-[#0c0c0c] border border-white/15 rounded-2xl hover:border-rose-500/40 transition-all duration-500 hover:bg-[#121214] shadow-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-rose-600 rounded-xl text-white transition-all duration-500 shadow-[0_0_15px_rgba(225,29,72,0.2)]">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-medium text-white tracking-tight">Organize</h3>
                    <p className="text-[10px] text-zinc-600 mt-1">Event dashboard</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500 text-rose-500" />
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex relative items-center justify-center animate-in fade-in zoom-in duration-1000 delay-300">
            <div className="absolute inset-0 bg-[#4f46e5]/5 blur-[120px] rounded-full animate-pulse" />
            <img
              src="https://ik.imagekit.io/dypkhqxip/Breaking%20barriers-bro.svg"
              alt="Build Illustration"
              className="relative z-10 w-full h-auto max-w-2xl object-contain drop-shadow-[0_0_50px_rgba(79,70,229,0.15)] transition-transform duration-700 hover:scale-[1.02]"
            />
          </div>

        </div>
      </main>

      <BottomBanner />

    </div>
  );
}