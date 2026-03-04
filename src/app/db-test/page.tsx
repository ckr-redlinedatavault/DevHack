"use client";

import { useState, useEffect, useTransition } from "react";
import { createUser, getUsers, checkConnection } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle, Database, UserPlus, RefreshCw } from "lucide-react";

export default function DbTestPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [connectionStatus, setConnectionStatus] = useState<{
        loading: boolean;
        success?: boolean;
        message?: string;
    }>({ loading: true });

    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const refreshData = async () => {
        setConnectionStatus({ loading: true });

        const connResult = await checkConnection();
        if (connResult.success) {
            setConnectionStatus({ loading: false, success: true, message: "Connected to Database" });
            const usersResult = await getUsers();
            if (usersResult.success && usersResult.data) {
                setUsers(usersResult.data);
            } else if (usersResult.success) {
                setUsers([]);
            } else {
                setError(usersResult.error as string);
            }
        } else {
            setConnectionStatus({ loading: false, success: false, message: connResult.error });
            setError(connResult.error);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            setError(null);
            const result = await createUser(formData);
            if (result.success) {
                (e.target as HTMLFormElement).reset();
                refreshData();
            } else {
                setError(result.error);
            }
        });
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-50 p-6 md:p-12 font-sans selection:bg-indigo-500/30">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-8">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
                            Database Tester
                        </h1>
                        <p className="text-zinc-400 mt-2 text-lg">
                            Verify your Supabase/Prisma connection and perform CRUD operations.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${connectionStatus.loading ? "border-zinc-800 bg-zinc-900/50" :
                            connectionStatus.success ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" :
                                "border-rose-500/20 bg-rose-500/10 text-rose-400"
                            }`}>
                            {connectionStatus.loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : connectionStatus.success ? (
                                <CheckCircle2 className="w-4 h-4" />
                            ) : (
                                <XCircle className="w-4 h-4" />
                            )}
                            <span className="text-sm font-medium">
                                {connectionStatus.loading ? "Connecting..." : connectionStatus.message}
                            </span>
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={refreshData}
                            className="rounded-full border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:text-white"
                        >
                            <RefreshCw className={`w-4 h-4 ${connectionStatus.loading ? "animate-spin" : ""}`} />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Create User Form */}
                    <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <UserPlus className="w-5 h-5 text-indigo-400" />
                                Add New User
                            </CardTitle>
                            <CardDescription className="text-zinc-400">
                                Create a record in the `User` table to test write operations.
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={handleCreateUser}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-zinc-300">Email</label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="alex@example.com"
                                        required
                                        className="bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium text-zinc-300">Name (Optional)</label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Alex Smith"
                                        className="bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500"
                                    />
                                </div>
                                {error && (
                                    <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-start gap-2">
                                        <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button
                                    type="submit"
                                    disabled={isPending || connectionStatus.loading || !connectionStatus.success}
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-600/20"
                                >
                                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
                                    {isPending ? "Creating User..." : "Insert to Database"}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>

                    {/* User List */}
                    <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <Database className="w-5 h-5 text-emerald-400" />
                                Database Records
                            </CardTitle>
                            <CardDescription className="text-zinc-400">
                                Live view of records from your PostgreSQL instance.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {users.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-zinc-500 border-2 border-dashed border-zinc-800 rounded-xl">
                                        <Database className="w-8 h-8 mb-2 opacity-20" />
                                        <p>No records found</p>
                                    </div>
                                ) : (
                                    users.map((user: any) => (
                                        <div
                                            key={user.id}
                                            className="group p-4 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-900/60 hover:border-zinc-700 transition-all duration-300"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-semibold text-white group-hover:text-indigo-300 transition-colors text-xs mb-1">
                                                        {user.name || "Anonymous User"}
                                                    </p>
                                                    <p className="text-sm text-zinc-400 font-mono">{user.email}</p>
                                                </div>
                                                <div className="text-[10px] font-mono text-zinc-600">
                                                    ID: {user.id}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Instructions/Logs */}
                <div className="rounded-2xl bg-zinc-900/30 border border-zinc-800/50 p-6">
                    <h3 className="text-sm font-semibold text-zinc-300 mb-4">Connection details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1">
                            <p className="text-xs text-zinc-500 font-medium">Provider</p>
                            <p className="text-sm text-zinc-300 font-mono">PostgreSQL (Supabase)</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-zinc-500 font-medium">ORM</p>
                            <p className="text-sm text-zinc-300 font-mono">Prisma v7.4.2</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-zinc-500 font-medium">Status Check</p>
                            <p className="text-sm text-zinc-300 font-mono">Real-time health pulse</p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}</style>
        </div>
    );
}
