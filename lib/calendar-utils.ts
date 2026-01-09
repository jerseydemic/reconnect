import { HealingTask } from "./types";

/**
 * Generates an iCalendar (.ics) file content for a single healing task
 */
export function generateICSFile(
  task: HealingTask,
  sessionName: string,
  startDate?: Date
): string {
  const now = new Date();
  const start = startDate || new Date(now.getTime() + 24 * 60 * 60 * 1000); // Default: tomorrow
  const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour duration

  // Format dates to iCal format (YYYYMMDDTHHMMSSZ)
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  const dtstamp = formatDate(now);
  const dtstart = formatDate(start);
  const dtend = formatDate(end);

  // Create unique ID
  const uid = `reconnect-task-${task.id}-${Date.now()}@reconnect.app`;

  // Escape special characters for iCal format
  const escape = (str: string): string => {
    return str.replace(/[\\,;]/g, "\\$&").replace(/\n/g, "\\n");
  };

  const title = escape(`ReConnect: ${task.task}`);
  const description = escape(
    `Difficulty: ${task.difficulty}\\n\\nWhy: ${task.why}\\n\\nCategory: ${task.category.replace(/_/g, " ")}`
  );

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ReConnect//Healing Tasks//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `CATEGORIES:${task.category.replace(/_/g, " ").toUpperCase()}`,
    `PRIORITY:${task.difficulty === "hard" ? "1" : task.difficulty === "medium" ? "5" : "9"}`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-P1D", // Reminder 1 day before
    "ACTION:DISPLAY",
    `DESCRIPTION:Reminder: ${title}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return icsContent;
}

/**
 * Generates an iCalendar file with all healing tasks
 */
export function generateAllTasksICS(
  tasks: HealingTask[],
  _sessionName: string
): string {
  const now = new Date();
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  const escape = (str: string): string => {
    return str.replace(/[\\,;]/g, "\\$&").replace(/\n/g, "\\n");
  };

  const events = tasks.map((task, index) => {
    // Spread tasks over the next few weeks
    const start = new Date(now.getTime() + (index + 1) * 2 * 24 * 60 * 60 * 1000); // Every 2 days
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    const dtstamp = formatDate(now);
    const dtstart = formatDate(start);
    const dtend = formatDate(end);
    const uid = `reconnect-task-${task.id}-${Date.now()}@reconnect.app`;

    const title = escape(`ReConnect: ${task.task}`);
    const description = escape(
      `Difficulty: ${task.difficulty}\\n\\nWhy: ${task.why}\\n\\nCategory: ${task.category.replace(/_/g, " ")}`
    );

    return [
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART:${dtstart}`,
      `DTEND:${dtend}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `CATEGORIES:${task.category.replace(/_/g, " ").toUpperCase()}`,
      `PRIORITY:${task.difficulty === "hard" ? "1" : task.difficulty === "medium" ? "5" : "9"}`,
      "STATUS:CONFIRMED",
      "BEGIN:VALARM",
      "TRIGGER:-P1D",
      "ACTION:DISPLAY",
      `DESCRIPTION:Reminder: ${title}`,
      "END:VALARM",
      "END:VEVENT",
    ].join("\r\n");
  });

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ReConnect//Healing Tasks//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");

  return icsContent;
}

/**
 * Triggers a download of an ICS file
 */
export function downloadICSFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename.endsWith(".ics") ? filename : `${filename}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

/**
 * Generates a Google Calendar URL for a task
 */
export function getGoogleCalendarUrl(task: HealingTask): string {
  const now = new Date();
  const start = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Tomorrow
  const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour duration

  const formatGoogleDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  const title = encodeURIComponent(`ReConnect: ${task.task}`);
  const description = encodeURIComponent(
    `Difficulty: ${task.difficulty}\n\nWhy: ${task.why}\n\nCategory: ${task.category.replace(/_/g, " ")}`
  );
  const dates = `${formatGoogleDate(start)}/${formatGoogleDate(end)}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${description}&dates=${dates}`;
}

/**
 * Generates a Google Calendar URL for all tasks
 */
export function getGoogleCalendarUrlForAllTasks(tasks: HealingTask[]): string {
  // Google Calendar doesn't support multiple events in one URL
  // So we'll just open the first task and suggest users use ICS download for all
  if (tasks.length === 0) return "";
  return getGoogleCalendarUrl(tasks[0]);
}
