import { HealingTask } from "./types";

export const HEALING_TASKS: HealingTask[] = [
    // Communication tasks
    {
        id: 1,
        category: "communication",
        difficulty: "easy",
        task: "Spend 15 minutes sharing your day without phones or distractions",
        why: "Builds active listening and presence",
        completed: false,
        tier: "free"
    },
    {
        id: 2,
        category: "communication",
        difficulty: "medium",
        task: "Write each other a letter expressing what you miss most about the relationship",
        why: "Helps articulate feelings that are hard to say out loud",
        completed: false,
        tier: "premium"
    },
    {
        id: 3,
        category: "communication",
        difficulty: "hard",
        task: "Have a 30-minute conversation about what led to the separation, using 'I feel' statements",
        why: "Addresses root issues with non-blaming language",
        completed: false,
        tier: "premium"
    },

    // Trust tasks
    {
        id: 4,
        category: "trust",
        difficulty: "easy",
        task: "Share one thing you appreciate about your partner every day for a week",
        why: "Rebuilds positive associations and goodwill",
        completed: false,
        tier: "free"
    },
    {
        id: 5,
        category: "trust",
        difficulty: "medium",
        task: "Share one insecurity or fear you've been hiding from your partner",
        why: "Vulnerability builds deeper connection and trust",
        completed: false,
        tier: "premium"
    },
    {
        id: 6,
        category: "trust",
        difficulty: "hard",
        task: "Discuss what trust means to each of you and create 3 specific trust-building commitments",
        why: "Establishes clear expectations and accountability",
        completed: false,
        tier: "premium"
    },

    // Intimacy tasks
    {
        id: 7,
        category: "intimacy",
        difficulty: "easy",
        task: "Give each other a 5-minute shoulder massage",
        why: "Physical touch releases bonding hormones",
        completed: false,
        tier: "free"
    },
    {
        id: 8,
        category: "intimacy",
        difficulty: "medium",
        task: "Share your favorite memory together and why it was special",
        why: "Reconnects you with positive emotional history",
        completed: false,
        tier: "premium"
    },
    {
        id: 9,
        category: "intimacy",
        difficulty: "hard",
        task: "Have an honest conversation about your physical and emotional intimacy needs",
        why: "Aligns expectations and desires",
        completed: false,
        tier: "premium"
    },

    // Future tasks
    {
        id: 10,
        category: "future",
        difficulty: "easy",
        task: "Plan one fun activity to do together next week",
        why: "Creates something to look forward to together",
        completed: false,
        tier: "free"
    },
    {
        id: 11,
        category: "future",
        difficulty: "medium",
        task: "Each write down 3 goals for your relationship and compare them",
        why: "Ensures you're working toward the same vision",
        completed: false,
        tier: "premium"
    },
    {
        id: 12,
        category: "future",
        difficulty: "hard",
        task: "Create a 'relationship vision board' together with images and words representing your ideal future",
        why: "Visualizes shared dreams and strengthens commitment",
        completed: false,
        tier: "premium"
    },

    // Conflict resolution tasks
    {
        id: 13,
        category: "conflict",
        difficulty: "easy",
        task: "Practice the 'pause button' - when tension rises, take a 10-minute break before continuing",
        why: "Prevents escalation and allows emotions to settle",
        completed: false,
        tier: "free"
    },
    {
        id: 14,
        category: "conflict",
        difficulty: "medium",
        task: "Apologize for one specific thing you did that hurt your partner during the separation",
        why: "Taking accountability opens the door to healing",
        completed: false,
        tier: "premium"
    },
    {
        id: 15,
        category: "conflict",
        difficulty: "hard",
        task: "Create a 'fair fighting' agreement with 5 rules you both commit to during disagreements",
        why: "Establishes healthy conflict patterns",
        completed: false,
        tier: "premium"
    },

    // Quality time tasks
    {
        id: 16,
        category: "quality_time",
        difficulty: "easy",
        task: "Cook a meal together without any screens",
        why: "Teamwork and presence strengthen connection",
        completed: false,
        tier: "free"
    },
    {
        id: 17,
        category: "quality_time",
        difficulty: "medium",
        task: "Go on a 'first date' again - dress up, go somewhere special, pretend you're just getting to know each other",
        why: "Rekindles romance and excitement",
        completed: false,
        tier: "premium"
    },
    {
        id: 18,
        category: "quality_time",
        difficulty: "hard",
        task: "Plan a weekend getaway together, even if it's just a staycation",
        why: "Extended quality time away from daily stressors deepens reconnection",
        completed: false,
        tier: "premium"
    }
];
