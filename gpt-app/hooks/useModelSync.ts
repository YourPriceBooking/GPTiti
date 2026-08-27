"use client";

import { useCallback, useEffect } from "react";

import { getModelGroupAndItem } from "@/functions/getModelGroupAndItem";
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

  const selectedModel = useAppSelector(selectSelectedModel);
  const selectedModelGroup = useAppSelector(selectSelectedModelGroup);
  const activeChatId = useAppSelector(selectActiveChatId);
  const activeChatModelId = useAppSelector(selectActiveChatModelId);
  const activeChatMessageCount = useAppSelector(selectActiveChatMessageCount);

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
      if (!changed || activeChatMessageCount === 0) return;
      dispatch(handleNewChat());
      onModelSwitched();
    },
    [dispatch, selectedModel, activeChatMessageCount, onModelSwitched],
  );

  return { selectedModel, selectedModelGroup, selectModel };
}
