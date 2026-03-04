import Link from "next/link";
import { ArrowRight, Zap, Users, Layout, Rocket, Github, Globe, Code, Menu, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-[100] border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white">D</div>
            <span className="font-bold text-lg sm:text-xl tracking-tight">DevHack</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Login</Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-zinc-200 transition-all"
              >
                Get Started
              </Link>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-white/5 bg-black/95 backdrop-blur-xl animate-in slide-in-from-top-4 duration-300">
            <div className="px-6 py-8 flex flex-col gap-6">
              <a
                href="#how-it-works"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-zinc-400 hover:text-white transition-colors"
              >
                How it works
              </a>
              <a
                href="#features"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Features
              </a>
              <hr className="border-white/5" />
              <div className="flex flex-col gap-4 pt-2">
                <Link href="/login" className="text-lg font-medium text-zinc-400 hover:text-white transition-colors">Login</Link>
                <Link
                  href="/register"
                  className="w-full py-4 bg-white text-black text-center font-bold rounded-2xl hover:bg-zinc-200 transition-all"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/20 blur-[120px] rounded-full -z-10" />

        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-xs font-medium animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            Hackathon productivity redefined
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
            Build Faster.<br />
            <span className="bg-gradient-to-r from-indigo-400 via-white to-indigo-400 bg-clip-text text-transparent">
              Hack Smarter.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-400 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            The ultimate collaborative workspace designed specifically for hackathon teams.
            Manage tasks, resources, and submissions in one unified platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/20 flex items-center justify-center gap-2 group"
            >
              Start Your Hackathon Workspace
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/db-test"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Dashboard Mockup Preview */}
        <div className="mt-20 max-w-6xl mx-auto rounded-3xl border border-white/10 bg-zinc-900/50 p-4 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
          <div className="aspect-video bg-black rounded-2xl overflow-hidden relative border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-transparent" />
            <div className="absolute top-4 left-6 flex gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500/50" />
              <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
            </div>
            {/* Mock content */}
            <div className="mt-16 px-8 grid grid-cols-4 gap-6 opacity-40">
              <div className="aspect-square bg-zinc-800 rounded-xl" />
              <div className="aspect-square bg-zinc-800 rounded-xl" />
              <div className="aspect-square bg-zinc-800 rounded-xl" />
              <div className="aspect-square bg-zinc-800 rounded-xl" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center text-zinc-500 font-mono text-sm uppercase tracking-widest">
              DevHack Workspace Preview
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold">How DevHack Works</h2>
            <p className="text-zinc-500 max-w-xl mx-auto">From idea to submission in four simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Signup", desc: "Create your account in seconds." },
              { step: "02", title: "Form Team", desc: "Create a new team or join with an invite code." },
              { step: "03", title: "Collaborate", desc: "Manage tasks, resources, and live notes." },
              { step: "04", title: "Submit", desc: "Export your final project details effortlessly." },
            ].map((s, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-black border border-white/5 hover:border-indigo-500/30 transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 text-4xl font-bold text-white/5 group-hover:text-indigo-500/10 transition-colors uppercase italic">{s.step}</div>
                <div className="space-y-4 relative z-10">
                  <h3 className="text-xl font-bold">{s.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold">Everything you need to win</h2>
            <p className="text-zinc-500 max-w-xl mx-auto">Focus on building, we'll handle the logistics.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Layout className="w-6 h-6 text-indigo-400" />}
              title="Kanban Task Board"
              desc="Agile board for hackathons. Track progress from backlog to done."
            />
            <FeatureCard
              icon={<Users className="w-6 h-6 text-indigo-400" />}
              title="Team Management"
              desc="Instant invite links and real-time member presence."
            />
            <FeatureCard
              icon={<Code className="w-6 h-6 text-indigo-400" />}
              title="Resource Hub"
              desc="Keep all your GitHub, Figma, and API docs in one place."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-indigo-400" />}
              title="Submission Builder"
              desc="Build your pitch deck and submission profile as you code."
            />
            <FeatureCard
              icon={<Rocket className="w-6 h-6 text-indigo-400" />}
              title="Fast Performance"
              desc="Optimized for speed during those critical last few hours."
            />
            <FeatureCard
              icon={<Globe className="w-6 h-6 text-indigo-400" />}
              title="Public Showcases"
              desc="Share your project with the world with public-facing pages."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 grayscale brightness-200">
            <div className="w-6 h-6 bg-white rounded flex items-center justify-center font-bold text-black text-xs">D</div>
            <span className="font-bold">DevHack</span>
          </div>
          <div className="text-zinc-600 text-sm">
            © 2026 DevHack Platform. All rights reserved.
          </div>
          <div className="flex gap-6 text-zinc-400">
            <a href="#" className="hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5 hover:border-white/10 transition-all flex flex-col items-start gap-6">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
        {icon}
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
