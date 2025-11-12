import { addMonths } from "date-fns";

export function validateCastContent(content: string): string | null {
  if (!content.trim()) {
    return "Please enter cast content";
  }
  if (content.length > 320) {
    return "Content must be 320 characters or less";
  }
  return null;
}

export function validateScheduledTime(
  scheduledDate: string,
  scheduledTime: string
): { timestamp: number; error: string | null } {
  if (!scheduledDate || !scheduledTime) {
    return { timestamp: 0, error: "Please select date and time" };
  }

  const dateTimeString = `${scheduledDate}T${scheduledTime}`;
  const localDate = new Date(dateTimeString);
  const scheduledTimestamp = localDate.getTime();

  if (scheduledTimestamp <= Date.now()) {
    return { timestamp: scheduledTimestamp, error: "Scheduled time must be in the future" };
  }

  const maxTime = addMonths(new Date(), 3).getTime();
  if (scheduledTimestamp > maxTime) {
    return { timestamp: scheduledTimestamp, error: "Cannot schedule more than 3 months ahead" };
  }

  return { timestamp: scheduledTimestamp, error: null };
}

export function validateImageFile(file: File): string | null {
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return "Image must be less than 10MB";
  }
  return null;
}
