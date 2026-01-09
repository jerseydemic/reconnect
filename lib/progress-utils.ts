import { Session, HealingTask } from "./types";

export interface ProgressData {
  date: string; // ISO date
  tasksCompleted: number;
  journalEntries: number;
}

/**
 * Calculate the current streak of consecutive days with completed tasks
 */
export function calculateStreak(session: Session): number {
  if (!session.taskProgress || Object.keys(session.taskProgress).length === 0) {
    return 0;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastActivity = session.lastActivityDate 
    ? new Date(session.lastActivityDate)
    : new Date(session.createdAt);
  lastActivity.setHours(0, 0, 0, 0);

  // Check if last activity was today or yesterday
  const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff > 1) {
    // Streak broken
    return 0;
  }

  return session.streak || 0;
}

/**
 * Update progress when a task is completed
 */
export function updateProgress(sessionId: string, taskId: number): void {
  const sessionData = localStorage.getItem(`session_${sessionId}`);
  if (!sessionData) return;

  const session: Session = JSON.parse(sessionData);
  
  // Update task progress
  session.taskProgress[taskId] = true;
  
  // Calculate streak
  const today = new Date().toISOString().split('T')[0];
  const lastActivity = session.lastActivityDate?.split('T')[0];
  
  if (lastActivity === today) {
    // Same day, don't increment streak
  } else if (lastActivity) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (lastActivity === yesterdayStr) {
      // Consecutive day, increment streak
      session.streak = (session.streak || 0) + 1;
      session.longestStreak = Math.max(session.longestStreak || 0, session.streak);
    } else {
      // Streak broken, reset to 1
      session.streak = 1;
    }
  } else {
    // First activity
    session.streak = 1;
    session.longestStreak = 1;
  }
  
  session.lastActivityDate = new Date().toISOString();
  session.totalTasksCompleted = (session.totalTasksCompleted || 0) + 1;
  
  // Check for milestones
  checkMilestones(session);
  
  // Save updated session
  localStorage.setItem(`session_${sessionId}`, JSON.stringify(session));
}

/**
 * Check and award milestones
 */
function checkMilestones(session: Session): void {
  if (!session.milestones) {
    session.milestones = [];
  }

  const milestones = [
    { days: 3, id: "3_days" },
    { days: 7, id: "7_days" },
    { days: 14, id: "14_days" },
    { days: 30, id: "30_days" },
    { days: 60, id: "60_days" },
    { days: 90, id: "90_days" },
  ];

  const currentStreak = session.streak || 0;

  for (const milestone of milestones) {
    if (currentStreak >= milestone.days && !session.milestones.includes(milestone.id)) {
      session.milestones.push(milestone.id);
    }
  }
}

/**
 * Get milestones achieved
 */
export function getMilestones(session: Session): string[] {
  return session.milestones || [];
}

/**
 * Get progress data for charting
 */
export function getProgressData(sessionId: string, days: number = 30): ProgressData[] {
  const progressKey = `progress_${sessionId}`;
  const stored = localStorage.getItem(progressKey);
  
  if (!stored) {
    return [];
  }

  const allProgress: ProgressData[] = JSON.parse(stored);
  
  // Return last N days
  return allProgress.slice(-days);
}

/**
 * Record daily progress
 */
export function recordDailyProgress(sessionId: string, tasksCompleted: number): void {
  const progressKey = `progress_${sessionId}`;
  const stored = localStorage.getItem(progressKey);
  const today = new Date().toISOString().split('T')[0];
  
  let progress: ProgressData[] = stored ? JSON.parse(stored) : [];
  
  // Check if today already has an entry
  const todayIndex = progress.findIndex(p => p.date === today);
  
  if (todayIndex >= 0) {
    // Update today's count
    progress[todayIndex].tasksCompleted += tasksCompleted;
  } else {
    // Add new entry for today
    progress.push({
      date: today,
      tasksCompleted,
      journalEntries: 0,
    });
  }
  
  localStorage.setItem(progressKey, JSON.stringify(progress));
}
