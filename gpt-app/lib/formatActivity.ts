export const formatActivity = (value?: string): string | null => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const elapsed = Math.max(0, Date.now() - date.getTime());
  const hours = Math.floor(elapsed / 3_600_000);
  const days = Math.floor(elapsed / 86_400_000);

  if (hours < 1) return "Updated just now";
  if (hours < 24)
    return `Updated ${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  if (days < 7) return `Updated ${days} ${days === 1 ? "day" : "days"} ago`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `Updated ${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  }
  const months = Math.floor(days / 30);
  return `Updated ${months} ${months === 1 ? "month" : "months"} ago`;
};
