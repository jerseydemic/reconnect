"use client";

import { motion, useMotionValue, useTransform, PanInfo, useAnimation } from "framer-motion";
import { Question } from "@/lib/types";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SwipeCardProps {
    question: Question;
    onSwipe: (direction: "left" | "right") => void;
    questionNumber: number;
    totalQuestions: number;
}

export function SwipeCard({ question, onSwipe, questionNumber, totalQuestions }: SwipeCardProps) {
    const x = useMotionValue(0);
    const controls = useAnimation();
    const rotate = useTransform(x, [-300, 300], [-20, 20]);
    const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0, 1, 1, 1, 0]);

    const handleDragEnd = async (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const swipeThreshold = 100;
        
        if (Math.abs(info.offset.x) > swipeThreshold) {
            const direction = info.offset.x > 0 ? "right" : "left";
            
            // Animate card completely off screen
            await controls.start({
                x: direction === "right" ? 1000 : -1000,
                opacity: 0,
                transition: { duration: 0.3, ease: "easeOut" }
            });
            
            onSwipe(direction);
        }
    };

    const handleButtonClick = async (direction: "left" | "right") => {
        // Animate card off screen when button is clicked
        await controls.start({
            x: direction === "right" ? 1000 : -1000,
            opacity: 0,
            rotate: direction === "right" ? 20 : -20,
            transition: { duration: 0.3, ease: "easeOut" }
        });
        
        onSwipe(direction);
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
        <div className="relative w-full max-w-md mx-auto h-[380px] sm:h-[420px] perspective-1000 px-4 sm:px-0">
            <motion.div
                className="absolute inset-0 cursor-grab active:cursor-grabbing touch-pan-y"
                style={{
                    x,
                    rotate,
                    opacity,
                }}
                animate={controls}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                dragTransition={{ bounceStiffness: 600, bounceDamping: 25 }}
                onDragEnd={handleDragEnd}
                whileTap={{ scale: 1.02 }}
            >
                <div className="w-full h-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    {/* Progress Bar */}
                    <div className="h-1 bg-gray-100 dark:bg-gray-700">
                        <div
                            className={`h-full bg-gradient-to-r ${getCategoryColor(question.category)} transition-all duration-300`}
                            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
                        />
                    </div>

                    {/* Card Content - Slimmed down */}
                    <div className="flex flex-col h-full p-5 sm:p-6">
                        {/* Header - Compact */}
                        <div className="text-center mb-3">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <div className={`h-1 w-1 rounded-full bg-gradient-to-r ${getCategoryColor(question.category)}`} />
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    {question.category.replace(/_/g, " ")}
                                </p>
                                <div className={`h-1 w-1 rounded-full bg-gradient-to-r ${getCategoryColor(question.category)}`} />
                            </div>
                            <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
                                {questionNumber} of {totalQuestions}
                            </p>
                        </div>

                        {/* Question - Centered */}
                        <div className="flex-1 flex items-center justify-center py-4">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 text-center leading-relaxed px-2">
                                {question.question}
                            </h2>
                        </div>

                        {/* Action Buttons - Clickable alternatives to swiping */}
                        <div className="flex gap-3 mt-4">
                            <Button
                                onClick={() => handleButtonClick("left")}
                                className="flex-1 h-16 bg-gradient-to-br from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-lg hover:shadow-xl transition-all"
                            >
                                <div className="flex flex-col items-center gap-1">
                                    <X className="w-5 h-5" strokeWidth={3} />
                                    <span className="text-xs font-bold">{question.leftLabel}</span>
                                </div>
                            </Button>
                            
                            <Button
                                onClick={() => handleButtonClick("right")}
                                className="flex-1 h-16 bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all"
                            >
                                <div className="flex flex-col items-center gap-1">
                                    <Check className="w-5 h-5" strokeWidth={3} />
                                    <span className="text-xs font-bold">{question.rightLabel}</span>
                                </div>
                            </Button>
                        </div>

                        {/* Instruction */}
                        <div className="mt-3 text-center">
                            <p className="text-[10px] text-gray-400 dark:text-gray-500">
                                Swipe or tap buttons to answer
                            </p>
                        </div>
                    </div>
                </div>

                {/* Drag Feedback Overlays */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl flex items-center justify-center pointer-events-none"
                    style={{
                        opacity: useTransform(x, [-300, -100, 0], [0.9, 0.3, 0]),
                    }}
                >
                    <X className="w-32 h-32 text-white" strokeWidth={4} />
                </motion.div>

                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center pointer-events-none"
                    style={{
                        opacity: useTransform(x, [0, 100, 300], [0, 0.3, 0.9]),
                    }}
                >
                    <Check className="w-32 h-32 text-white" strokeWidth={4} />
                </motion.div>
            </motion.div>
        </div>
    );
}
