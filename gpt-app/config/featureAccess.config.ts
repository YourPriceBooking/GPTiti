export const QUICK_TASKS_ALLOWED_EMAILS: string[] = [
  "i.bondarenko@trade-system.com.ua",
];

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export function isEmailAllowed(
  allowList: readonly string[],
  email?: string | null,
): boolean {
  const allowed = allowList.map(normalizeEmail).filter(Boolean);
  if (allowed.length === 0) return true;

  const userEmail = normalizeEmail(email ?? "");
  if (!userEmail) return false;

  return allowed.includes(userEmail);
}
