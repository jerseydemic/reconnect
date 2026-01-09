import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Session, Answer, AnalysisResult } from "./types";
import { QUESTIONS } from "./questions";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSessionId(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function upgradeToPremium(sessionId: string): void {
    const session = loadSession(sessionId);
    if (session) {
        session.paid = true;
        session.subscriptionTier = "premium";
        session.subscriptionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days from now
        saveSession(session);
    }
}

export function checkSubscriptionStatus(sessionId: string): boolean {
    const session = loadSession(sessionId);
    if (!session || session.subscriptionTier === "free") return false;
    
    // Check if subscription has expired
    if (session.subscriptionExpiry) {
        const expiry = new Date(session.subscriptionExpiry);
        if (expiry < new Date()) {
            // Subscription expired, downgrade to free
            session.subscriptionTier = "free";
            session.paid = false;
            saveSession(session);
            return false;
        }
    }
    
    return session.paid && session.subscriptionTier === "premium";
}


export function calculateAnalysis(
  partner1Answers: Answer[],
  partner2Answers: Answer[]
): AnalysisResult {
  const categoryScores: Record<string, { matches: number; total: number }> = {
    communication: { matches: 0, total: 0 },
    trust: { matches: 0, total: 0 },
    intimacy: { matches: 0, total: 0 },
    future: { matches: 0, total: 0 },
    conflict: { matches: 0, total: 0 },
    quality_time: { matches: 0, total: 0 }
  };

  let totalMatches = 0;
  let totalQuestions = partner1Answers.length;

  partner1Answers.forEach((answer, index) => {
    const partner2Answer = partner2Answers[index];
    const question = QUESTIONS.find(q => q.id === answer.questionId);

    if (question && partner2Answer) {
      const category = question.category;
      categoryScores[category].total++;

      if (answer.response === partner2Answer.response) {
        categoryScores[category].matches++;
        totalMatches++;
      }
    }
  });

  const compatibilityScore = Math.round((totalMatches / totalQuestions) * 100);

  const categoryPercentages = Object.entries(categoryScores).reduce(
    (acc, [category, { matches, total }]) => ({
      ...acc,
      [category]: total > 0 ? Math.round((matches / total) * 100) : 0
    }),
    {} as Record<string, number>
  );

  const problemAreas = Object.entries(categoryPercentages)
    .filter(([_, score]) => score < 50)
    .map(([category]) => category.replace(/_/g, " "))
    .sort((a, b) => categoryPercentages[a] - categoryPercentages[b]);

  return {
    compatibilityScore,
    categoryScores: categoryPercentages as any,
    matches: totalMatches,
    mismatches: totalQuestions - totalMatches,
    problemAreas
  };
}

export function calculateSoloAnalysis(answers: Answer[]): AnalysisResult {
  const categoryScores: Record<string, { positive: number; total: number }> = {
    communication: { positive: 0, total: 0 },
    trust: { positive: 0, total: 0 },
    intimacy: { positive: 0, total: 0 },
    future: { positive: 0, total: 0 },
    conflict: { positive: 0, total: 0 },
    quality_time: { positive: 0, total: 0 }
  };

  let totalPositive = 0;
  let totalQuestions = answers.length;

  answers.forEach((answer) => {
    const question = QUESTIONS.find(q => q.id === answer.questionId);

    if (question) {
      const category = question.category;
      categoryScores[category].total++;

      // Right swipe = positive response
      if (answer.response === "right") {
        categoryScores[category].positive++;
        totalPositive++;
      }
    }
  });

  const overallScore = Math.round((totalPositive / totalQuestions) * 100);

  const categoryPercentages = Object.entries(categoryScores).reduce(
    (acc, [category, { positive, total }]) => ({
      ...acc,
      [category]: total > 0 ? Math.round((positive / total) * 100) : 0
    }),
    {} as Record<string, number>
  );

  const problemAreas = Object.entries(categoryPercentages)
    .filter(([_, score]) => score < 50)
    .map(([category]) => category.replace(/_/g, " "))
    .sort((a, b) => categoryPercentages[a] - categoryPercentages[b]);

  return {
    compatibilityScore: overallScore,
    categoryScores: categoryPercentages as any,
    matches: totalPositive,
    mismatches: totalQuestions - totalPositive,
    problemAreas
  };
}

export function saveSession(session: Session): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(`session_${session.id}`, JSON.stringify(session));
    
    // If session has email, index it for retrieval
    if (session.userEmail) {
      const emailKey = `user_sessions_${session.userEmail.toLowerCase()}`;
      const existingSessions = localStorage.getItem(emailKey);
      const sessionIds: string[] = existingSessions ? JSON.parse(existingSessions) : [];
      
      if (!sessionIds.includes(session.id)) {
        sessionIds.push(session.id);
        localStorage.setItem(emailKey, JSON.stringify(sessionIds));
      }
    }
  }
}

export function loadSession(sessionId: string): Session | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(`session_${sessionId}`);
    return data ? JSON.parse(data) : null;
  }
  return null;
}

export function getSessionsByEmail(email: string): Session[] {
  if (typeof window !== "undefined") {
    const emailKey = `user_sessions_${email.toLowerCase()}`;
    const sessionIdsData = localStorage.getItem(emailKey);
    
    if (!sessionIdsData) return [];
    
    const sessionIds: string[] = JSON.parse(sessionIdsData);
    const sessions: Session[] = [];
    
    sessionIds.forEach(id => {
      const session = loadSession(id);
      if (session) {
        sessions.push(session);
      }
    });
    
    // Sort by creation date, newest first
    return sessions.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  return [];
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Simple password hashing (client-side only, for basic security)
// In production, this should be done server-side with proper bcrypt/argon2
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

export async function getSessionsByEmailAndPassword(email: string, password: string): Promise<Session[]> {
  if (typeof window !== "undefined") {
    const emailKey = `user_sessions_${email.toLowerCase()}`;
    const sessionIdsData = localStorage.getItem(emailKey);
    
    if (!sessionIdsData) return [];
    
    const sessionIds: string[] = JSON.parse(sessionIdsData);
    const sessions: Session[] = [];
    
    for (const id of sessionIds) {
      const session = loadSession(id);
      if (session && session.passwordHash) {
        const isValid = await verifyPassword(password, session.passwordHash);
        if (isValid) {
          sessions.push(session);
        }
      }
    }
    
    // Sort by creation date, newest first
    return sessions.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  return [];
}
