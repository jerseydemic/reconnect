import { Question } from "./types";

export const QUESTIONS: Question[] = [
    // Communication (6 questions) - 3 free, 3 premium
    {
        id: 1,
        category: "communication",
        question: "Do you feel comfortable sharing your true feelings with your partner?",
        leftLabel: "Not really",
        rightLabel: "Absolutely",
        tier: "free"
    },
    {
        id: 2,
        category: "communication",
        question: "Does your partner listen when you talk about important things?",
        leftLabel: "Rarely",
        rightLabel: "Always",
        tier: "free"
    },
    {
        id: 3,
        category: "communication",
        question: "Can you discuss difficult topics without it turning into a fight?",
        leftLabel: "No",
        rightLabel: "Yes",
        tier: "free"
    },
    {
        id: 4,
        category: "communication",
        question: "Do you feel heard and understood in this relationship?",
        leftLabel: "Not often",
        rightLabel: "Very much",
        tier: "premium"
    },
    {
        id: 5,
        category: "communication",
        question: "Are you able to express your needs clearly?",
        leftLabel: "Struggle with it",
        rightLabel: "Yes, easily",
        tier: "premium"
    },
    {
        id: 6,
        category: "communication",
        question: "Does your partner validate your feelings?",
        leftLabel: "Rarely",
        rightLabel: "Usually",
        tier: "premium"
    },

    // Trust (5 questions) - 2 free, 3 premium
    {
        id: 7,
        category: "trust",
        question: "Do you trust your partner's intentions toward you?",
        leftLabel: "Sometimes doubt",
        rightLabel: "Fully trust",
        tier: "free"
    },
    {
        id: 8,
        category: "trust",
        question: "Can you rely on your partner to keep their promises?",
        leftLabel: "Not always",
        rightLabel: "Definitely",
        tier: "free"
    },
    {
        id: 9,
        category: "trust",
        question: "Do you feel safe being vulnerable with your partner?",
        leftLabel: "Not really",
        rightLabel: "Completely",
        tier: "premium"
    },
    {
        id: 10,
        category: "trust",
        question: "Has trust been broken in your relationship?",
        leftLabel: "Yes",
        rightLabel: "No",
        tier: "premium"
    },
    {
        id: 11,
        category: "trust",
        question: "Are you willing to rebuild trust together?",
        leftLabel: "Unsure",
        rightLabel: "Yes, committed",
        tier: "premium"
    },

    // Intimacy (5 questions) - 3 free, 2 premium
    {
        id: 12,
        category: "intimacy",
        question: "Are you satisfied with your emotional connection?",
        leftLabel: "Could be better",
        rightLabel: "Very satisfied",
        tier: "free"
    },
    {
        id: 13,
        category: "intimacy",
        question: "Do you feel physically connected to your partner?",
        leftLabel: "Not much",
        rightLabel: "Strongly",
        tier: "free"
    },
    {
        id: 14,
        category: "intimacy",
        question: "Does your partner show you affection regularly?",
        leftLabel: "Rarely",
        rightLabel: "Often",
        tier: "free"
    },
    {
        id: 15,
        category: "intimacy",
        question: "Do you miss the intimacy you once had?",
        leftLabel: "Not really",
        rightLabel: "Very much",
        tier: "premium"
    },
    {
        id: 16,
        category: "intimacy",
        question: "Are you willing to work on rebuilding intimacy?",
        leftLabel: "Hesitant",
        rightLabel: "Yes, eager",
        tier: "premium"
    },

    // Future (5 questions) - 3 free, 2 premium
    {
        id: 17,
        category: "future",
        question: "Can you see a future together with your partner?",
        leftLabel: "Uncertain",
        rightLabel: "Definitely",
        tier: "free"
    },
    {
        id: 18,
        category: "future",
        question: "Do you share similar life goals?",
        leftLabel: "Very different",
        rightLabel: "Very similar",
        tier: "free"
    },
    {
        id: 19,
        category: "future",
        question: "Are you both committed to making this work?",
        leftLabel: "One-sided",
        rightLabel: "Both committed",
        tier: "free"
    },
    {
        id: 20,
        category: "future",
        question: "Do you believe your relationship can be saved?",
        leftLabel: "Doubtful",
        rightLabel: "Hopeful",
        tier: "premium"
    },
    {
        id: 21,
        category: "future",
        question: "Are you willing to put in the work to heal?",
        leftLabel: "Maybe",
        rightLabel: "Absolutely",
        tier: "premium"
    },

    // Conflict Resolution (5 questions) - 2 free, 3 premium
    {
        id: 22,
        category: "conflict",
        question: "Do you fight fair in arguments?",
        leftLabel: "Not usually",
        rightLabel: "Yes, we do",
        tier: "free"
    },
    {
        id: 23,
        category: "conflict",
        question: "Can you apologize when you're wrong?",
        leftLabel: "Difficult",
        rightLabel: "Yes, easily",
        tier: "free"
    },
    {
        id: 24,
        category: "conflict",
        question: "Does your partner take responsibility for their actions?",
        leftLabel: "Rarely",
        rightLabel: "Usually",
        tier: "premium"
    },
    {
        id: 25,
        category: "conflict",
        question: "Do conflicts get resolved or just swept under the rug?",
        leftLabel: "Swept away",
        rightLabel: "Resolved",
        tier: "premium"
    },
    {
        id: 26,
        category: "conflict",
        question: "Are you willing to compromise for the relationship?",
        leftLabel: "Struggle with it",
        rightLabel: "Yes, willing",
        tier: "premium"
    },

    // Quality Time (4 questions) - 2 free, 2 premium
    {
        id: 27,
        category: "quality_time",
        question: "Do you spend enough meaningful time together?",
        leftLabel: "Not enough",
        rightLabel: "Plenty",
        tier: "free"
    },
    {
        id: 28,
        category: "quality_time",
        question: "Do you enjoy each other's company?",
        leftLabel: "Sometimes",
        rightLabel: "Always",
        tier: "free"
    },
    {
        id: 29,
        category: "quality_time",
        question: "Do you make your relationship a priority?",
        leftLabel: "Not really",
        rightLabel: "Definitely",
        tier: "premium"
    },
    {
        id: 30,
        category: "quality_time",
        question: "Would you like to spend more quality time together?",
        leftLabel: "Not sure",
        rightLabel: "Yes, very much",
        tier: "premium"
    }
];
