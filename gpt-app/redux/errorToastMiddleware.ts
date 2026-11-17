import { isRejectedWithValue, type Middleware } from "@reduxjs/toolkit";

import { isLogoutPending } from "@/lib/authSession";
import { showErrorToast } from "@/redux/ui/slice";

const hasDedicatedErrorUi = (actionType: string) =>
  actionType.startsWith("auth/") || actionType.startsWith("tokens/refreshBalance/") || actionType === "tokens/claim/rejected";

export const errorToastMiddleware: Middleware =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    const result = next(action);

    if (
      isRejectedWithValue(action) &&
      !isLogoutPending() &&
      !action.meta.aborted &&
      !hasDedicatedErrorUi(action.type) &&
      typeof action.payload === "string"
    ) {
      dispatch(showErrorToast(action.payload));
    }

    return result;
  };
