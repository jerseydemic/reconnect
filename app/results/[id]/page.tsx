"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Session, AnalysisResult } from "@/lib/types";
import { loadSession, calculateAnalysis, calculateSoloAnalysis } from "@/lib/utils";
import { Heart, TrendingUp, TrendingDown, AlertCircle, ArrowRight } from "lucide-react";

export default function ResultsPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = params.id as string;
    const isSoloMode = searchParams.get("mode") === "solo";

    const [session, setSession] = useState<Session | null>(null);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

    useEffect(() => {
        const loadedSession = loadSession(sessionId);
        if (loadedSession && loadedSession.completed) {
            setSession(loadedSession);

            // For solo mode, create a self-reflection analysis
            if (loadedSession.sessionType === "solo") {
                const result = calculateSoloAnalysis(loadedSession.partner1Answers);
                setAnalysis(result);
            } else {
                const result = calculateAnalysis(
                    loadedSession.partner1Answers,
                    loadedSession.partner2Answers
                );
                setAnalysis(result);
            }
        } else {
            router.push("/");
        }
    }, [sessionId, router, searchParams]);

    if (!session || !analysis) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-orange-100 flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    const getCategoryColor = (score: number) => {
        if (score >= 70) return "text-green-600";
        if (score >= 50) return "text-yellow-600";
        return "text-red-600";
    };

    const getCategoryBg = (score: number) => {
        if (score >= 70) return "bg-green-100";
        if (score >= 50) return "bg-yellow-100";
        return "bg-red-100";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-orange-100 p-4 pb-20">
            <div className="max-w-2xl mx-auto pt-8 space-y-6">
                {/* Header */}
                <div className="text-center">
                    <Heart className="w-16 h-16 mx-auto mb-4 text-pink-500 fill-pink-500" />
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        {session.sessionType === "solo" ? "Your Self-Reflection" : "Your Results"}
                    </h1>
                    <p className="text-gray-600">
                        {session.sessionType === "solo"
                            ? session.partner1Name
                            : `${session.partner1Name} & ${session.partner2Name}`
                        }
                    </p>
                </div>

                {/* Overall Score */}
                <Card className="shadow-xl border-2 border-purple-200">
                    <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                        <CardTitle className="text-3xl text-center">
                            {session.sessionType === "solo" ? "Relationship Health Score" : "Compatibility Score"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div className="text-6xl font-bold text-purple-600 mb-4">
                                {analysis.compatibilityScore}%
                            </div>
                            <p className="text-gray-600 mb-4">
                                {session.sessionType === "solo"
                                    ? `You answered positively to ${analysis.matches} out of 30 questions`
                                    : `You matched on ${analysis.matches} out of 30 questions`
                                }
                            </p>
                            <Progress value={analysis.compatibilityScore} className="h-3" />
                        </div>
                    </CardContent>
                </Card>

                {/* Category Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>Category Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {Object.entries(analysis.categoryScores).map(([category, score]) => (
                            <div key={category}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium capitalize">
                                        {category.replace(/_/g, " ")}
                                    </span>
                                    <Badge className={getCategoryBg(score)}>
                                        <span className={getCategoryColor(score)}>{score}%</span>
                                    </Badge>
                                </div>
                                <Progress value={score} className="h-2" />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Problem Areas */}
                {analysis.problemAreas.length > 0 && (
                    <Card className="border-2 border-orange-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-orange-600" />
                                Areas Needing Attention
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {analysis.problemAreas.map((area, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <TrendingDown className="w-5 h-5 text-orange-600 mt-0.5" />
                                        <span className="capitalize">{area}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}

                {/* Strengths */}
                {Object.entries(analysis.categoryScores)
                    .filter(([_, score]) => score >= 70)
                    .length > 0 && (
                        <Card className="border-2 border-green-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                    Your Strengths
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {Object.entries(analysis.categoryScores)
                                        .filter(([_, score]) => score >= 70)
                                        .map(([category, score]) => (
                                            <li key={category} className="flex items-start gap-2">
                                                <Heart className="w-5 h-5 text-green-600 mt-0.5 fill-green-600" />
                                                <span className="capitalize">{category.replace(/_/g, " ")}</span>
                                            </li>
                                        ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}

                {/* Message */}
                <Card className="bg-gradient-to-r from-pink-50 to-purple-50">
                    <CardContent className="pt-6">
                        <p className="text-center text-gray-700 leading-relaxed">
                            {session.sessionType === "solo" ? (
                                <>
                                    {analysis.compatibilityScore >= 70 && (
                                        <>
                                            You have a positive outlook on your relationship. Your answers show you
                                            still see value and potential. Focus on the areas that need work while
                                            maintaining hope for reconciliation.
                                        </>
                                    )}
                                    {analysis.compatibilityScore >= 50 && analysis.compatibilityScore < 70 && (
                                        <>
                                            Your feelings about the relationship are mixed. This is completely normal
                                            during separation. The healing tasks will help you work on yourself and
                                            clarify what you want for the future.
                                        </>
                                    )}
                                    {analysis.compatibilityScore < 50 && (
                                        <>
                                            You're experiencing significant pain in this relationship. That's valid.
                                            Whether you're working toward reconciliation or closure, these healing
                                            tasks will help you process your feelings and grow.
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    {analysis.compatibilityScore >= 70 && (
                                        <>
                                            You have a strong foundation to build on! Your alignment shows genuine
                                            connection. Focus on maintaining your strengths while working on the areas
                                            that need attention.
                                        </>
                                    )}
                                    {analysis.compatibilityScore >= 50 && analysis.compatibilityScore < 70 && (
                                        <>
                                            There's hope for your relationship. You have some alignment, but there are
                                            important areas that need work. The healing tasks will help you rebuild
                                            connection in these areas.
                                        </>
                                    )}
                                    {analysis.compatibilityScore < 50 && (
                                        <>
                                            Your relationship needs significant healing. Don't be discouraged - many
                                            couples have rebuilt from here. The key is commitment from both partners
                                            and consistent effort on the healing tasks.
                                        </>
                                    )}
                                </>
                            )}
                        </p>
                    </CardContent>
                </Card>

                {/* CTA */}
                <Button
                    onClick={() => router.push(`/tasks/${sessionId}`)}
                    className="w-full h-14 text-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                >
                    View Your Healing Tasks
                    <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}
