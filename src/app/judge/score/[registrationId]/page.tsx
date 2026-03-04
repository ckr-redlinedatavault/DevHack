import { prisma } from "@/lib/prisma";
import { getJudgeSession } from "@/lib/judge-auth-utils";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Layout, ExternalLink, Trophy, ShieldCheck } from "lucide-react";
import ScoringForm from "./ScoringForm";

export default async function TeamScoringPage({ params }: { params: Promise<{ registrationId: string }> }) {
    const session = await getJudgeSession();
    if (!session) redirect("/judge/login");

    const { registrationId } = await params;

    const registration = await prisma.eventRegistration.findUnique({
        where: { id: registrationId },
        include: {
            event: true,
            scores: {
                where: { judgeId: session.judgeId }
            }
        }
    });

    if (!registration || registration.event.id !== session.eventId) {
        notFound();
    }

    const team = await prisma.team.findFirst({
        where: { name: registration.teamName },
        include: { submission: true }
    });

    const existingScore = registration.scores[0];

    return (
        <div className="min-h-screen bg-[#09090b] text-white p-6 md:p-12 font-sans selection:bg-sky-500/30">
            <div className="max-w-4xl mx-auto space-y-12">
                <nav className="flex items-center space-x-2 text-sm font-medium text-zinc-500 mb-8">
                    <Link href="/judge/dashboard" className="hover:text-white transition-colors flex items-center gap-1">
                        <ArrowLeft className="w-4 h-4" /> All Teams
                    </Link>
                    <span className="text-zinc-700">/</span>
                    <span className="text-sky-400">Evaluate: {registration.teamName}</span>
                </nav>

                <div className="space-y-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
                        <div className="space-y-4">
                            <h1 className="text-5xl font-black tracking-tight">{registration.teamName}</h1>
                            <div className="flex items-center gap-4 text-zinc-500 font-bold text-sm">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" /> {registration.leadEmail}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Layout className="w-4 h-4" /> {registration.event.name}
                                </div>
                            </div>
                        </div>

                        {team?.submission && (
                            <a
                                href={team.submission.deckUrl || "#"}
                                target="_blank"
                                className="inline-flex items-center gap-3 bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20"
                            >
                                <ExternalLink className="w-5 h-5 text-pretty" /> View Project Submission
                            </a>
                        )}
                    </div>

                    <div className="bg-sky-500/5 border border-sky-500/20 rounded-3xl p-6 flex items-center justify-between shadow-[0_0_50px_rgba(14,165,233,0.05)]">
                        <div className="flex items-center gap-4">
                            <Trophy className="w-8 h-8 text-sky-400" />
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-white">Objective Criteria</h3>
                                <p className="text-xs text-zinc-500 font-medium">Scoring must be based on Hackathon rules.</p>
                            </div>
                        </div>
                        <ShieldCheck className="w-6 h-6 text-sky-500/30" />
                    </div>

                    <ScoringForm
                        registrationId={registration.id}
                        teamName={registration.teamName}
                        initialScore={existingScore ? {
                            innovation: existingScore.innovation,
                            implementation: existingScore.implementation,
                            design: existingScore.design,
                            impact: existingScore.impact,
                            comment: existingScore.comment
                        } : undefined}
                    />
                </div>
            </div>
        </div>
    );
}
