"use client";

import Link from "next/link";
import { ArrowRight, Zap, LucideIcon, Shield, Layers, Cpu, Globe } from "lucide-react";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-rose-500/30 font-sans">
      {/* Header / Navigation */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${scrolled ? "py-4 bg-black/80 backdrop-blur-md border-b border-white/5" : "py-8 bg-transparent"}`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="https://ik.imagekit.io/dypkhqxip/Screenshot_2026-03-04_at_20.33.46-removebg-preview.png"
              alt="DevHack Logo"
              className="h-10 w-auto object-contain brightness-110"
            />
          </div>

          <div className="hidden md:flex items-center gap-10 text-[13px] font-bold text-zinc-500 uppercase tracking-widest">
            <a href="#vision" className="hover:text-rose-500 transition-colors">Vision</a>
            <a href="#relay" className="hover:text-rose-500 transition-colors">Relay</a>
            <Link href="/organizer/login" className="flex items-center gap-2 hover:text-rose-500 transition-colors">
              <Zap className="w-3.5 h-3.5 text-rose-500" />
              Organizer Access
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="text-[13px] font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest">
              Secure Login
            </Link>
            <Link
              href="/register"
              className="px-6 py-2.5 bg-rose-500 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-lg hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20"
            >
              Initialize
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative">
        {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
          {/* Ambient Atmospheric FX */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-rose-500/5 blur-[160px] rounded-full -z-10 animate-pulse-slow" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/[0.02] blur-[120px] rounded-full -z-10" />

          <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-rose-500/5 border border-rose-500/10 text-rose-500 text-[10px] font-bold uppercase tracking-[0.3em] backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              Operational Protocol v2.5
            </div>

            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[1] text-white">
                Precision Hackathon<br />
                <span className="text-zinc-600">Telemetry.</span>
              </h1>
              <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-500 font-medium leading-relaxed italic opacity-80 pt-4">
                The next-generation workspace architected for speed, collaboration, and real-time event synchronization.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
              <Link
                href="/register"
                className="w-full sm:w-auto px-10 py-5 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-2xl flex items-center justify-center gap-3 group"
              >
                Start Mission
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#vision"
                className="w-full sm:w-auto px-10 py-5 bg-zinc-950/50 border border-white/5 text-zinc-400 font-bold text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-white/5 transition-all flex items-center justify-center gap-2"
              >
                Vision Relay
              </a>
            </div>
          </div>
        </section>

        {/* Features / Vision - Integrated Simple Look */}
        <section id="vision" className="py-32 px-6 border-t border-white/5 bg-zinc-950/30">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
            <FeatureBlock
              icon={Layers}
              title="Unified Rails"
              desc="Real-time task synchronization across global team members with zero latency."
            />
            <FeatureBlock
              icon={Shield}
              title="Encrypted Vaults"
              desc="Secure repository for project resources, API keys, and internal documentation."
            />
            <FeatureBlock
              icon={Cpu}
              title="Live Telemetry"
              desc="Direct fiber-optic link between your workspace activity and the event leaderboard."
            />
          </div>
        </section>

        {/* Single Page Ending Message */}
        <section className="py-40 px-6 text-center border-t border-white/5">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="w-16 h-1 bg-rose-500 mx-auto rounded-full opacity-50" />
            <h2 className="text-4xl font-black text-white tracking-tighter">Ready to Deploy?</h2>
            <p className="text-zinc-500 font-medium">Join 500+ developers building the future of decentralized infrastructure on DevHack.</p>
            <div className="pt-6">
              <Link
                href="/register"
                className="inline-flex items-center gap-3 text-rose-500 font-black text-sm uppercase tracking-widest hover:gap-5 transition-all"
              >
                Execute Protocol <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-16 border-t border-white/5 px-6 bg-black">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-8">
            <img
              src="https://ik.imagekit.io/dypkhqxip/Screenshot_2026-03-04_at_20.33.46-removebg-preview.png"
              alt="DevHack Logo"
              className="h-8 w-auto opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer"
            />
            <div className="w-px h-6 bg-white/10 hidden md:block" />
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em]">
              Global Hackathon OS
            </p>
          </div>

          <div className="flex items-center gap-10 text-[10px] font-black text-zinc-700 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">X / Twitter</a>
          </div>

          <div className="text-zinc-800 text-[10px] font-black uppercase tracking-widest">
            © 2026 DevHack Platform.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureBlock({ icon: Icon, title, desc }: { icon: LucideIcon, title: string, desc: string }) {
  return (
    <div className="space-y-6 group">
      <div className="w-14 h-14 rounded-2xl bg-black border border-white/5 flex items-center justify-center group-hover:bg-rose-500 group-hover:border-rose-500 transition-all duration-500 shadow-xl shadow-rose-500/0 group-hover:shadow-rose-500/20">
        <Icon className="w-6 h-6 text-zinc-500 group-hover:text-white transition-colors duration-500" />
      </div>
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
        <p className="text-zinc-500 text-sm font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
          {desc}
        </p>
      </div>
    </div>
  );
}
