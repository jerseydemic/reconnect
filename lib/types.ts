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
    // Demographics for personalized advice
    gender?: "male" | "female" | "non-binary" | "prefer-not-to-say";
    age?: number;
    location?: string; // City, State or Country
    // Progress tracking
    streak?: number; // Current streak in days
    longestStreak?: number;
    totalTasksCompleted?: number;
    lastActivityDate?: string;
    milestones?: string[]; // ["3_days", "7_days", etc.]
    // AI preferences
    useAITasks?: boolean;
    aiTasksGenerated?: boolean;
    lastAIGeneration?: string;
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

export interface JournalEntry {
    id: string;
    sessionId: string;
    taskId?: number; // Optional link to task
    content: string;
    isPrivate: boolean; // If false, shared with partner
    createdAt: string;
    author: "partner1" | "partner2";
}
