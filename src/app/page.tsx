"use client";

import Link from "next/link";
import { ArrowRight, Zap, Code2, ShieldAlert, Activity, Github } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="h-[100dvh] w-full bg-[#050505] text-zinc-300 selection:bg-[#4f46e5]/30 font-sans font-light overflow-hidden flex flex-col">

      {/* 1. Tester Instance Banner */}
      <div className="flex-none w-full bg-[#4f46e5] py-4 px-4 text-center z-50">
        <p className="text-xs text-white font-medium tracking-wide">
          Hello folks, this system is set for the Tester Instance. Please use the system and give your valuable feedback.
        </p>
      </div>

      {/* 2. Simple Static Header */}
      <header className="flex-none w-full px-6 md:px-12 py-6 flex items-center justify-between z-50 max-w-[90rem] mx-auto">
        <div className="flex items-center">
          <Image
            src="https://ik.imagekit.io/dypkhqxip/Screenshot_2026-03-04_at_20.33.46-removebg-preview.png"
            alt="DevHack Logo"
            width={240}
            height={60}
            priority
            className="h-12 md:h-16 w-auto object-contain brightness-125"
          />
        </div>

        <div className="flex items-center gap-8">
          <Link
            href="/login"
            className="text-xs font-medium text-zinc-500 hover:text-white transition-colors tracking-wide"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="px-5 py-2 bg-white/5 border border-white/10 text-zinc-200 text-xs font-medium rounded-full hover:bg-white hover:text-black transition-all duration-300"
          >
            Start Here
          </Link>
        </div>
      </header>

      {/* 3. Main Center Content (Locked to Viewport) */}
      <main className="flex-1 relative flex flex-col justify-center px-6 md:px-12 w-full max-w-[90rem] mx-auto z-10">
        <div className="space-y-8 w-full max-w-3xl">

          {/* Hero Typography - Pure Solid Colors */}
          <div className="space-y-5">
            <h1 className="text-[3.5rem] md:text-[5.5rem] lg:text-[6.5rem] font-light tracking-tighter leading-[0.95] text-white">
              Build the <br />
              <span className="text-zinc-600">
                unbuildable.
              </span>
            </h1>
            <p className="max-w-md text-sm md:text-base text-zinc-500 font-light leading-relaxed tracking-wide">
              The high-performance workspace for elite hackathon teams. Precision engineered for absolute speed.
            </p>
          </div>

          {/* Action Buttons - Flat Minimal Look */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-black font-medium text-xs md:text-sm rounded-full hover:bg-zinc-200 transition-colors flex items-center justify-center gap-3 group"
            >
              Start Mission
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
            <Link
              href="/organizer/login"
              className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-zinc-800 text-zinc-400 font-medium text-xs md:text-sm rounded-full hover:bg-zinc-900 hover:text-white transition-colors duration-300 flex items-center justify-center gap-3 group"
            >
              <Zap className="w-4 h-4 text-zinc-500 group-hover:text-[#4f46e5] transition-colors duration-300" />
              Organizer Panel
            </Link>
          </div>



        </div>
      </main>

      {/* 4. Static Minimal Footer */}
      <footer className="flex-none w-full px-6 md:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-black font-bold z-50 bg-[#f4f4f5]">
        <p className="tracking-wide">© 2026 DevHack Platform. Systems nominal.</p>
        <div className="flex items-center gap-8">
          <Link href="https://github.com/RishiRohanKalapala/DevHack" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
            <Github className="w-5 h-5" />
          </Link>
        </div>
      </footer>

    </div>
  );
}