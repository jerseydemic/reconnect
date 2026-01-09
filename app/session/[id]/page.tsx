"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { SwipeCard } from "@/components/SwipeCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Session, Answer } from "@/lib/types";
import { QUESTIONS } from "@/lib/questions";
import { loadSession, saveSession } from "@/lib/utils";
import { Copy, Check, Loader2, Undo2 } from "lucide-react";

export default function SessionPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    const sessionId = params.id as string;
    const partner = searchParams.get("partner");

    const [session, setSession] = useState<Session | null>(null);
    const [partner2Name, setPartner2Name] = useState("");
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadedSession = loadSession(sessionId);
        if (loadedSession) {
            setSession(loadedSession);
        } else if (partner === "2") {
            router.push("/");
        }
        setLoading(false);
    }, [sessionId, partner, router]);

    const handlePartner2Join = () => {
        if (!session || !partner2Name.trim()) return;

        const updatedSession = {
            ...session,
            partner2Name: partner2Name.trim()
        };

        setSession(updatedSession);
        saveSession(updatedSession);
    };

    const handleSwipe = (direction: "left" | "right") => {
        if (!session) return;

        const currentQuestion = QUESTIONS[session.currentQuestionIndex];
        const answer: Answer = {
            questionId: currentQuestion.id,
            response: direction
        };

        const isPartner1 = partner === "1" || partner === "solo";
        const isSoloMode = session.sessionType === "solo";

        const updatedSession = {
            ...session,
            partner1Answers: isPartner1
                ? [...session.partner1Answers, answer]
                : session.partner1Answers,
            partner2Answers: !isPartner1
                ? [...session.partner2Answers, answer]
                : session.partner2Answers,
            currentQuestionIndex: session.currentQuestionIndex + 1
        };

        // For solo mode, complete when user finishes all questions
        if (isSoloMode && updatedSession.currentQuestionIndex >= QUESTIONS.length) {
            updatedSession.completed = true;
            saveSession(updatedSession);
            router.push(`/results/${sessionId}?mode=solo`);
            return;
        }

        // Check if both partners have completed all questions (couple mode)
        if (
            !isSoloMode &&
            updatedSession.currentQuestionIndex >= QUESTIONS.length &&
            updatedSession.partner1Answers.length === QUESTIONS.length &&
            updatedSession.partner2Answers.length === QUESTIONS.length
        ) {
            updatedSession.completed = true;
            saveSession(updatedSession);
            router.push(`/results/${sessionId}`);
            return;
        }

        setSession(updatedSession);
        saveSession(updatedSession);
    };

    const handleUndo = () => {
        if (!session) return;

        const isPartner1 = partner === "1" || partner === "solo";
        const myAnswers = isPartner1 ? session.partner1Answers : session.partner2Answers;

        // Can't undo if no answers yet
        if (myAnswers.length === 0) return;

        const updatedSession = {
            ...session,
            partner1Answers: isPartner1
                ? session.partner1Answers.slice(0, -1)
                : session.partner1Answers,
            partner2Answers: !isPartner1
                ? session.partner2Answers.slice(0, -1)
                : session.partner2Answers,
            currentQuestionIndex: session.currentQuestionIndex - 1
        };

        setSession(updatedSession);
        saveSession(updatedSession);
    };

    const copySessionCode = () => {
        navigator.clipboard.writeText(sessionId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-orange-100 flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-orange-100 flex items-center justify-center p-4">
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle>Session Not Found</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 mb-4">This session doesn't exist.</p>
                        <Button onClick={() => router.push("/")} className="w-full">
                            Go Home
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Partner 2 needs to enter their name (skip for solo mode)
    if (partner === "2" && !session.partner2Name && session.sessionType !== "solo") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-orange-100 flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardHeader>
                        <CardTitle>Join {session.partner1Name}'s Session</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Your Name</label>
                            <Input
                                placeholder="Enter your name"
                                value={partner2Name}
                                onChange={(e) => setPartner2Name(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handlePartner2Join()}
                            />
                        </div>
                        <Button
                            onClick={handlePartner2Join}
                            disabled={!partner2Name.trim()}
                            className="w-full bg-gradient-to-r from-pink-500 to-purple-500"
                        >
                            Start Assessment
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Partner 1 waiting for Partner 2 (skip for solo mode)
    if (partner === "1" && !session.partner2Name && session.sessionType !== "solo") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-orange-100 flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardHeader>
                        <CardTitle>Waiting for Partner</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-gray-600">
                            Share this code with your partner so they can join:
                        </p>
                        <div className="flex gap-2">
                            <Input
                                value={sessionId}
                                readOnly
                                className="text-2xl font-bold text-center tracking-wider"
                            />
                            <Button onClick={copySessionCode} variant="outline" size="icon">
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </div>
                        <p className="text-sm text-gray-500 text-center">
                            They can join at: <strong>reconnect.app</strong>
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const currentQuestion = QUESTIONS[session.currentQuestionIndex];
    const progress = ((session.currentQuestionIndex) / QUESTIONS.length) * 100;
    const myAnswers = partner === "1" || partner === "solo" ? session.partner1Answers : session.partner2Answers;
    const isSoloMode = session.sessionType === "solo";

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-orange-100 p-4">
            <div className="max-w-2xl mx-auto pt-8">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        {isSoloMode ? "Solo Assessment" : (partner === "1" ? session.partner1Name : session.partner2Name)}
                    </h1>
                    <p className="text-gray-600">
                        {myAnswers.length} of {QUESTIONS.length} questions answered
                    </p>
                    {isSoloMode && (
                        <p className="text-sm text-purple-600 mt-1">
                            Reflecting on your relationship independently
                        </p>
                    )}
                    <Progress value={progress} className="mt-4" />
                </div>

                {/* Swipe Card */}
                {currentQuestion && session.currentQuestionIndex < QUESTIONS.length && (
                    <>
                        <SwipeCard
                            question={currentQuestion}
                            onSwipe={handleSwipe}
                            questionNumber={session.currentQuestionIndex + 1}
                            totalQuestions={QUESTIONS.length}
                        />

                        {/* Undo Button */}
                        <div className="flex justify-center mt-4">
                            <Button
                                onClick={handleUndo}
                                disabled={myAnswers.length === 0}
                                variant="outline"
                                className="gap-2 bg-white/80 backdrop-blur-sm hover:bg-white border-purple-200 disabled:opacity-50"
                            >
                                <Undo2 className="w-4 h-4" />
                                Go Back
                            </Button>
                        </div>
                    </>
                )}

                {/* Waiting for partner */}
                {session.currentQuestionIndex >= QUESTIONS.length && !session.completed && (
                    <Card className="max-w-md mx-auto">
                        <CardHeader>
                            <CardTitle>Waiting for Partner</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 text-center">
                                You've completed all questions. Waiting for your partner to finish...
                            </p>
                            <div className="flex justify-center mt-4">
                                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
