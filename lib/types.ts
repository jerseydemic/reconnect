export interface Question {
    id: number;
    category: "communication" | "trust" | "intimacy" | "future" | "conflict" | "quality_time";
    question: string;
    leftLabel: string;
    rightLabel: string;
    tier: "free" | "premium";
}

export interface Answer {
    questionId: number;
    response: "left" | "right"; // left = no/disagree, right = yes/agree
}

export interface Session {
    id: string;
    sessionType: "couple" | "solo";
    partner1Name: string;
    partner2Name: string;
    partner1Answers: Answer[];
    partner2Answers: Answer[];
    currentQuestionIndex: number;
    completed: boolean;
    paid: boolean;
    subscriptionTier: "free" | "premium";
    subscriptionExpiry?: string;
    taskProgress: Record<number, boolean>;
    lastTaskUpdate?: string;
    createdAt: string;
    userEmail?: string; // For session persistence and retrieval
    passwordHash?: string; // For session security
}

export interface AnalysisResult {
    compatibilityScore: number;
    categoryScores: {
        communication: number;
        trust: number;
        intimacy: number;
        future: number;
        conflict: number;
        quality_time: number;
    };
    matches: number;
    mismatches: number;
    problemAreas: string[];
}

export interface HealingTask {
    id: number;
    category: string;
    difficulty: "easy" | "medium" | "hard";
    task: string;
    why: string;
    completed: boolean;
    tier: "free" | "premium";
}
