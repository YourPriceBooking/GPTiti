import { isPending, isFulfilled, isRejected, type Middleware } from "@reduxjs/toolkit";
import { getAccountGeneration } from "../lib/authSession";

// Requests begun before logout must not repopulate chats, projects, balance or
// auth state after it (including a new account signing in).
export function createAuthBoundaryMiddleware(getGeneration = getAccountGeneration): Middleware {
  const requests = new Map<string, number>();
  return () => (next) => (action) => {
    if (isPending(action) && action.type !== "auth/logout/pending") {
      requests.set(action.meta.requestId, getGeneration());
    } else if ((isFulfilled(action) || isRejected(action)) && !action.type.startsWith("auth/logout/")) {
      const started = requests.get(action.meta.requestId);
      requests.delete(action.meta.requestId);
      if ((started !== undefined && started !== getGeneration()) ||
          (action.meta as { sessionSuperseded?: boolean }).sessionSuperseded) return action;
    }
    return next(action);
  };
}
