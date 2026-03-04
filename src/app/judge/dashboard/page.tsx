import { prisma } from "@/lib/prisma";
import { getJudgeSession } from "@/lib/judge-auth-utils";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Trophy, ArrowRight, Activity, ExternalLink, ShieldCheck, CheckCircle2 } from "lucide-react";
import JudgeLogoutButton from "./LogoutButton";

export default async function JudgeDashboardPage() {
    const session = await getJudgeSession();
    if (!session) redirect("/judge/login");

    const judge = await prisma.judge.findUnique({
        where: { id: session.judgeId },
        include: {
            event: {
                include: {
                    registrations: {
                        where: { status: "INVITED" },
                        include: {
                            scores: {
                                where: { judgeId: session.judgeId }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!judge) redirect("/judge/login");

    const teams = judge.event.registrations;

    // Fetch actual Workspace teams to check if they have a submission
    const teamNames = teams.map(t => t.teamName);
    const actualTeams = await prisma.team.findMany({
        where: { name: { in: teamNames } },
        include: { submission: true }
    });

    return (
        <div className="min-h-screen bg-[#09090b] text-white p-6 md:p-12 font-sans selection:bg-sky-500/30">
            <div className="max-w-6xl mx-auto space-y-12">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-widest">
                            <ShieldCheck className="w-4 h-4" /> Official Scoring Authority
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight">{judge.event.name}</h1>
                        <p className="text-zinc-500 text-lg font-medium">Hello Judge <span className="text-white font-bold">{judge.name}</span>. Start evaluating teams below.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-[#121214] border border-white/5 p-4 rounded-2xl flex items-center gap-3">
                            <Activity className="w-5 h-5 text-sky-500" />
                            <div>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Phase</p>
                                <p className="text-sm font-bold text-white">{judge.event.currentPhase}</p>
                            </div>
                        </div>
                        <JudgeLogoutButton />
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teams.map(reg => {
                        const actualTeam = actualTeams.find(t => t.name === reg.teamName);
                        const hasSubmission = actualTeam?.submission;
                        const alreadyScored = reg.scores.length > 0;

                        return (
                            <div key={reg.id} className="bg-[#121214] border border-white/5 rounded-3xl p-6 space-y-6 flex flex-col justify-between hover:border-white/10 transition-all group relative overflow-hidden">
                                {alreadyScored && (
                                    <div className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 flex items-center gap-1.5 backdrop-blur-sm">
                                        <CheckCircle2 className="w-3 h-3" /> Scored
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center font-black group-hover:bg-sky-500/10 group-hover:text-sky-400 transition-colors">
                                        {reg.teamName[0]}
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-bold text-white group-hover:text-sky-400 transition-colors">{reg.teamName}</h3>
                                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-tight">Lead: {reg.leadEmail}</p>
                                    </div>

                                    <div className="pt-2">
                                        {hasSubmission ? (
                                            <a
                                                href={actualTeam.submission?.deckUrl || "#"}
                                                target="_blank"
                                                className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/20 px-3 py-2 rounded-xl border border-indigo-500/10 transition-all hover:-translate-y-0.5"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" /> View Project
                                            </a>
                                        ) : (
                                            <span className="text-xs font-bold text-zinc-600 italic">No project submitted yet...</span>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <Link
                                        href={`/judge/score/${reg.id}`}
                                        className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${alreadyScored
                                            ? "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                                            : "bg-sky-500 text-black hover:bg-sky-400 shadow-lg shadow-sky-500/20"
                                            }`}
                                    >
                                        {alreadyScored ? "Edit Scores" : "Launch Scoring"}
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {teams.length === 0 && (
                    <div className="py-20 text-center space-y-4 bg-white/[0.02] rounded-3xl border border-dashed border-white/5">
                        <Trophy className="w-12 h-12 text-zinc-800 mx-auto" />
                        <p className="text-zinc-500 font-medium">No invited teams currently in the system for this event.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
