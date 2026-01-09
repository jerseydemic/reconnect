"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Session, HealingTask } from "@/lib/types";
import { loadSession, saveSession, calculateAnalysis } from "@/lib/utils";
import { HEALING_TASKS } from "@/lib/tasks";
import { CheckCircle2, Circle, Heart, Home, TrendingUp, Sparkles, Lock } from "lucide-react";

export default function TasksPage() {
    const params = useParams();
    const router = useRouter();
    const sessionId = params.id as string;

    const [session, setSession] = useState<Session | null>(null);
    const [tasks, setTasks] = useState<HealingTask[]>([]);

    useEffect(() => {
        const loadedSession = loadSession(sessionId);
        if (loadedSession && loadedSession.completed) {
            // Payment gate temporarily disabled
            // TODO: Re-enable when Stripe is integrated
            // Solo: $3.99/month, Couples: $9.99/month
            // if (!loadedSession.paid) {
            //     // Redirect to results page where they can pay
            //     router.push(`/results/${sessionId}`);
            //     return;
            // }

            setSession(loadedSession);

            // Load task completion state
            const savedTasks = localStorage.getItem(`tasks_${sessionId}`);
            if (savedTasks) {
                setTasks(JSON.parse(savedTasks));
            } else {
                // Initialize tasks
                const initialTasks = HEALING_TASKS.map(task => ({
                    ...task,
                    completed: false
                }));
                setTasks(initialTasks);
                localStorage.setItem(`tasks_${sessionId}`, JSON.stringify(initialTasks));
            }
        } else {
            router.push("/");
        }
    }, [sessionId, router]);

    const toggleTask = (taskId: number) => {
        setTasks(prev =>
            prev.map(task =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
            )
        );
    };

    if (!session) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-orange-100 flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    const completedCount = tasks.filter(t => t.completed).length;
    const progress = (completedCount / tasks.length) * 100;

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "easy":
                return "bg-green-100 text-green-700";
            case "medium":
                return "bg-yellow-100 text-yellow-700";
            case "hard":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-orange-100 p-4 pb-20">
            <div className="max-w-2xl mx-auto pt-8 space-y-6">
                {/* Header */}
                <div className="text-center">
                    <Heart className="w-16 h-16 mx-auto mb-4 text-pink-500 fill-pink-500" />
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        Healing Tasks
                    </h1>
                    <p className="text-gray-600">
                        {session.partner1Name} & {session.partner2Name}
                    </p>
                </div>

                {/* Progress */}
                <Card className="shadow-xl">
                    <CardHeader>
                        <CardTitle>Your Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>{completedCount} of {tasks.length} tasks completed</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <Progress value={progress} className="h-3" />
                        </div>
                    </CardContent>
                </Card>

                {/* Instructions */}
                <Card className="bg-gradient-to-r from-pink-50 to-purple-50">
                    <CardContent className="pt-6">
                        <p className="text-sm text-gray-700 text-center">
                            Complete these tasks together to rebuild your connection.
                            Start with easy tasks and work your way up. Check them off as you complete them.
                        </p>
                    </CardContent>
                </Card>

                {/* Tasks */}
                <div className="space-y-4">
                    {tasks.map((task) => (
                        <Card
                            key={task.id}
                            className={`cursor-pointer transition-all ${task.completed ? "bg-green-50 border-green-200" : "hover:shadow-lg"
                                }`}
                            onClick={() => toggleTask(task.id)}
                        >
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-4">
                                    <div className="mt-1">
                                        {task.completed ? (
                                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                                        ) : (
                                            <Circle className="w-6 h-6 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className={`font-semibold ${task.completed ? "line-through text-gray-500" : "text-gray-800"}`}>
                                                {task.task}
                                            </h3>
                                            <Badge className={getDifficultyColor(task.difficulty)}>
                                                {task.difficulty}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            <strong>Why:</strong> {task.why}
                                        </p>
                                        <Badge variant="outline" className="text-xs">
                                            {task.category.replace(/_/g, " ").toUpperCase()}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Footer */}
                <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <CardContent className="pt-6">
                        <p className="text-sm text-gray-600 text-center mb-4">
                            Remember: Healing takes time and consistent effort from both partners.
                            Celebrate small wins and be patient with each other.
                        </p>
                        <Button
                            onClick={() => router.push("/")}
                            variant="outline"
                            className="w-full"
                        >
                            <Home className="mr-2 w-4 h-4" />
                            Back to Home
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
