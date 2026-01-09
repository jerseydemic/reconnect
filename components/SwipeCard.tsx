"use client";

import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Question } from "@/lib/types";
import { X, Check } from "lucide-react";

interface SwipeCardProps {
    question: Question;
    onSwipe: (direction: "left" | "right") => void;
    questionNumber: number;
    totalQuestions: number;
}

export function SwipeCard({ question, onSwipe, questionNumber, totalQuestions }: SwipeCardProps) {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-25, 25]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

    const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (Math.abs(info.offset.x) > 100) {
            onSwipe(info.offset.x > 0 ? "right" : "left");
        }
    };

    const getCategoryColor = (category: string) => {
        const colors = {
            communication: "from-blue-500 to-cyan-500",
            trust: "from-purple-500 to-pink-500",
            intimacy: "from-rose-500 to-pink-500",
            future: "from-emerald-500 to-teal-500",
            conflict: "from-orange-500 to-red-500",
            quality_time: "from-violet-500 to-purple-500"
        };
        return colors[category as keyof typeof colors] || "from-gray-500 to-gray-600";
    };

    return (
        <div className="relative w-full max-w-md mx-auto h-[500px] perspective-1000">
            <motion.div
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
                style={{
                    x,
                    rotate,
                    opacity,
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={handleDragEnd}
                whileTap={{ scale: 1.05 }}
            >
                <div className="w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                    {/* Progress Bar */}
                    <div className="h-1 bg-gray-100">
                        <div
                            className={`h-full bg-gradient-to-r ${getCategoryColor(question.category)} transition-all duration-300`}
                            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
                        />
                    </div>

                    {/* Card Content */}
                    <div className="flex flex-col h-full p-8">
                        {/* Header */}
                        <div className="text-center mb-6">
                            <div className="flex items-center justify-center gap-2 mb-3">
                                <div className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${getCategoryColor(question.category)}`} />
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    {question.category.replace(/_/g, " ")}
                                </p>
                                <div className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${getCategoryColor(question.category)}`} />
                            </div>
                            <p className="text-sm font-medium text-gray-400">
                                {questionNumber} of {totalQuestions}
                            </p>
                        </div>

                        {/* Question */}
                        <div className="flex-1 flex items-center justify-center">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center leading-relaxed px-4">
                                {question.question}
                            </h2>
                        </div>

                        {/* Swipe Indicators */}
                        <div className="flex justify-between items-center mt-6">
                            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-red-50 border-2 border-red-100">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-lg">
                                    <X className="w-5 h-5 text-white" strokeWidth={3} />
                                </div>
                                <div className="text-left">
                                    <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">Swipe Left</p>
                                    <p className="text-sm font-bold text-red-700">{question.leftLabel}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-green-50 border-2 border-green-100">
                                <div className="text-right">
                                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Swipe Right</p>
                                    <p className="text-sm font-bold text-green-700">{question.rightLabel}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                                    <Check className="w-5 h-5 text-white" strokeWidth={3} />
                                </div>
                            </div>
                        </div>

                        {/* Instruction */}
                        <div className="mt-6 text-center">
                            <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
                                <span className="inline-block">👆</span>
                                Drag the card or swipe to answer
                            </p>
                        </div>
                    </div>
                </div>

                {/* Drag Feedback Overlays */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-500 rounded-3xl flex items-center justify-center pointer-events-none"
                    style={{
                        opacity: useTransform(x, [-200, -50, 0], [0.9, 0.3, 0]),
                    }}
                >
                    <X className="w-32 h-32 text-white" strokeWidth={4} />
                </motion.div>

                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center pointer-events-none"
                    style={{
                        opacity: useTransform(x, [0, 50, 200], [0, 0.3, 0.9]),
                    }}
                >
                    <Check className="w-32 h-32 text-white" strokeWidth={4} />
                </motion.div>
            </motion.div>
        </div>
    );
}
