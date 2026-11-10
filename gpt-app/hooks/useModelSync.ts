"use client";

import { useCallback, useEffect } from "react";

import { getModelGroupAndItem } from "@/functions/getModelGroupAndItem";
import { isSelectableModel } from "@/config/models.config";
import {
  selectActiveChatId,
  selectActiveChatMessageCount,
  selectActiveChatModelId,
} from "@/redux/chat/selectors";
import { handleNewChat, isDraftId } from "@/redux/chat/slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectSelectedModel,
  selectSelectedModelGroup,
} from "@/redux/model/selectors";
import { setSelectedModel, setSelectedModelGroup } from "@/redux/model/slice";

type UseModelSyncParams = {
  onModelSwitched: () => void;
};

export function useModelSync({ onModelSwitched }: UseModelSyncParams) {
  const dispatch = useAppDispatch();

  const savedModel = useAppSelector(selectSelectedModel);
  const selectedModelGroup = useAppSelector(selectSelectedModelGroup);
  const activeChatId = useAppSelector(selectActiveChatId);
  const activeChatModelId = useAppSelector(selectActiveChatModelId);
  const activeChatMessageCount = useAppSelector(selectActiveChatMessageCount);
  // Keep historical chats on their original model. Never silently substitute it.
  const unavailableChatModel = !!activeChatId && !isDraftId(activeChatId) &&
    !!activeChatModelId && !isSelectableModel(activeChatModelId);
  const selectedModel = unavailableChatModel && activeChatModelId
    ? activeChatModelId
    : savedModel;

  useEffect(() => {
    if (!activeChatId || isDraftId(activeChatId)) return;
    if (!activeChatModelId || activeChatModelId === selectedModel) return;
    const found = getModelGroupAndItem(activeChatModelId);
    if (!found) return;
    dispatch(setSelectedModel(activeChatModelId));
    dispatch(setSelectedModelGroup(found.group));
  }, [activeChatId, activeChatModelId, selectedModel, dispatch]);

  const selectModel = useCallback(
    (model: string) => {
      const changed = model !== selectedModel;
      dispatch(setSelectedModel(model));
      if (!changed || (activeChatMessageCount === 0 && !unavailableChatModel)) return;
      dispatch(handleNewChat());
      onModelSwitched();
    },
    [dispatch, selectedModel, activeChatMessageCount, unavailableChatModel, onModelSwitched],
  );

  return { selectedModel, selectedModelGroup, selectModel };
}
