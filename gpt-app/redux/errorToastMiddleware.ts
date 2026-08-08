import { isRejectedWithValue, type Middleware } from "@reduxjs/toolkit";

import { showErrorToast } from "@/redux/ui/slice";

const hasDedicatedErrorUi = (actionType: string) =>
  actionType.startsWith("auth/") || actionType === "tokens/claim/rejected";

export const errorToastMiddleware: Middleware =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    const result = next(action);

    if (
      isRejectedWithValue(action) &&
      !action.meta.aborted &&
      !hasDedicatedErrorUi(action.type) &&
      typeof action.payload === "string"
    ) {
      dispatch(showErrorToast(action.payload));
    }

    return result;
  };
