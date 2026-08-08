"use client";

import { useRef, useEffect, useCallback, useState } from "react";

import { useModelMode } from "@/hooks/useModelMode";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useChatStream } from "@/hooks/useChatStream";
import { useChatRestore } from "@/hooks/useChatRestore";
import { useInputDraft } from "@/hooks/useInputDraft";
import { useModelSync } from "@/hooks/useModelSync";
import { useProjectChats } from "@/hooks/useProjectChats";
import { readErrorMessage } from "@/lib/errorMessage";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectActiveChat,
  selectActiveChatId,
  selectActiveChatMessageCount,
  selectActiveChatMessagesStatus,
  selectSortedChatList,
  selectHasInput,
  selectInputSent,
  selectIsTyping,
  selectTemplateTick,
} from "@/redux/chat/selectors";
import {
  addConversation,
  deleteDraftChat,
  isDraftId,
  promoteDraft,
  renameChat,
  setActiveChatId,
} from "@/redux/chat/slice";
import {
  createConversation,
  fetchConversations,
  removeConversation,
  renameConversation,
} from "@/redux/chat/operations";
import {
  selectAccessTokenReady,
  selectIsLoggedIn,
} from "@/redux/auth/selectors";
import {
  selectFocusMode,
  selectHasFirstRequest,
  selectIsModalOpen,
  selectIsCreateProjectModalOpen,
  selectActiveProjectId,
  selectIsOverlayOpen,
  selectIsSectionVisible,
} from "@/redux/ui/selectors";
import {
  setFocusMode,
  setIsSectionVisible,
  setActiveProjectId,
} from "@/redux/ui/slice";
import { fetchProjects } from "@/redux/projects/operations";

const CREATE_CONVERSATION_FAILED =
  "Couldn't start a new chat. Please try again.";

export function useHomeController() {
  const dispatch = useAppDispatch();

  const sortedChatList = useAppSelector(selectSortedChatList);
  const activeChat = useAppSelector(selectActiveChat);
  const activeChatId = useAppSelector(selectActiveChatId);
  const activeChatMessageCount = useAppSelector(selectActiveChatMessageCount);
  const activeChatMessagesStatus = useAppSelector(
    selectActiveChatMessagesStatus,
  );
  const hasInput = useAppSelector(selectHasInput);
  const inputSent = useAppSelector(selectInputSent);
  const isTyping = useAppSelector(selectIsTyping);
  const templateTick = useAppSelector(selectTemplateTick);

  const focusMode = useAppSelector(selectFocusMode);
  const isSectionVisible = useAppSelector(selectIsSectionVisible);
  const isModalOpen = useAppSelector(selectIsModalOpen);
  const isCreateProjectModalOpen = useAppSelector(
    selectIsCreateProjectModalOpen,
  );
  const isOverlayOpen = useAppSelector(selectIsOverlayOpen);
  const hasFirstRequest = useAppSelector(selectHasFirstRequest);
  const activeProjectId = useAppSelector(selectActiveProjectId);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const accessTokenReady = useAppSelector(selectAccessTokenReady);

  const [operationError, setOperationError] = useState<string | null>(null);
  const reportError = useCallback(
    (message: string) => setOperationError(message),
    [],
  );

  const draft = useInputDraft();
  const { selectedModel, selectedModelGroup, selectModel } = useModelSync({
    onModelSwitched: draft.clearDraft,
  });
  const { sendMessage, streamError, clearStreamError } = useChatStream();
  const { restoringActiveChat } = useChatRestore();
  const projects = useProjectChats({ onError: reportError });

  const { modelMode, setModelMode, modelRef } = useModelMode();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sendCycleInFlightRef = useRef(false);
  useScrollDirection(scrollContainerRef);

  const chatError = streamError ?? operationError;
  const clearChatError = useCallback(() => {
    clearStreamError();
    setOperationError(null);
  }, [clearStreamError]);

  const activeChatLoading =
    activeChatMessagesStatus === "idle" ||
    activeChatMessagesStatus === "loading";
  const isNewChat = !activeChatLoading && isDraftId(activeChatId);
  const isExistingChat = !!activeChat;
  const dockHidden = (isSectionVisible && focusMode) || isOverlayOpen;

  useEffect(() => {
    if (!isLoggedIn || !accessTokenReady) return;
    dispatch(fetchConversations());
    dispatch(fetchProjects());
  }, [isLoggedIn, accessTokenReady, dispatch]);

  useEffect(() => {
    dispatch(setIsSectionVisible(activeChatMessageCount === 0));
    dispatch(setFocusMode(false));
  }, [activeChatId, activeChatMessageCount, dispatch]);

  useEffect(() => {
    if (restoringActiveChat || activeChatMessageCount === 0) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
  }, [activeChatId, activeChatMessageCount, restoringActiveChat]);

  const ensureConversationId = useCallback(
    async (draftText: string): Promise<string | null> => {
      if (!activeChatId) return null;
      if (!isDraftId(activeChatId)) return activeChatId;

      try {
        const conv = await dispatch(
          createConversation({
            modelId: selectedModel,
            title: draftText.slice(0, 60) || undefined,
          }),
        ).unwrap();
        dispatch(
          promoteDraft({
            draftId: activeChatId,
            realId: conv._id,
            title: conv.title ?? (draftText || null),
            modelId: conv.modelId ?? selectedModel,
          }),
        );
        return conv._id;
      } catch (err) {
        setOperationError(readErrorMessage(err, CREATE_CONVERSATION_FAILED));
        return null;
      }
    },
    [dispatch, activeChatId, selectedModel],
  );

  const handleSendClick = useCallback(
    async (
      _hasFirstRequest: boolean,
      imageUrls: string[] = [],
      imageFiles: File[] = [],
    ) => {
      if (sendCycleInFlightRef.current) return;
      sendCycleInFlightRef.current = true;

      try {
        const text = draft.readDraftText();
        if (!text && imageUrls.length === 0) return;

        const conversationId = await ensureConversationId(text);
        if (!conversationId) return;

        const accepted = await sendMessage({
          conversationId,
          modelId: selectedModel,
          text,
          imageUrls,
          imageFiles,
        });
        if (accepted) draft.consumeDraft();
      } finally {
        sendCycleInFlightRef.current = false;
      }
    },
    [draft, ensureConversationId, selectedModel, sendMessage],
  );

  const handleProjectSend = useCallback(
    async (imageUrls: string[] = [], imageFiles: File[] = []) => {
      if (sendCycleInFlightRef.current) return;
      sendCycleInFlightRef.current = true;

      try {
        if (!activeProjectId) return;
        const text = draft.readDraftText();
        if (!text && imageUrls.length === 0) return;

        let conv;
        try {
          conv = await dispatch(
            createConversation({
              modelId: selectedModel,
              title: text.slice(0, 60) || undefined,
            }),
          ).unwrap();
        } catch (err) {
          setOperationError(
            readErrorMessage(err, CREATE_CONVERSATION_FAILED),
          );
          return;
        }

        dispatch(
          addConversation({
            id: conv._id,
            title: conv.title ?? (text || null),
            modelId: conv.modelId ?? selectedModel,
          }),
        );

        projects.linkConversations(activeProjectId, [conv._id]);
        dispatch(setActiveProjectId(null));

        const accepted = await sendMessage({
          conversationId: conv._id,
          modelId: selectedModel,
          text,
          imageUrls,
          imageFiles,
        });
        if (accepted) draft.consumeDraft();
      } finally {
        sendCycleInFlightRef.current = false;
      }
    },
    [dispatch, activeProjectId, selectedModel, draft, projects, sendMessage],
  );

  const handleSelectChat = useCallback(
    (id: string) => {
      dispatch(setActiveProjectId(null));
      dispatch(setActiveChatId(id));
    },
    [dispatch],
  );

  const handleDeleteChat = useCallback(
    (id: string) => {
      if (isDraftId(id)) dispatch(deleteDraftChat(id));
      else dispatch(removeConversation(id));
    },
    [dispatch],
  );

  const handleRenameChat = useCallback(
    (chatId: string, newTitle: string) => {
      dispatch(renameChat({ chatId, newTitle })); // optimistic local update
      if (!isDraftId(chatId)) {
        dispatch(renameConversation({ id: chatId, title: newTitle }));
      }
    },
    [dispatch],
  );

  return {
    dispatch,
    // data / selectors
    activeChat,
    activeProject: projects.activeProject,
    projectList: projects.projectList,
    addChatsProject: projects.addChatsProject,
    addChatsProjectId: projects.addChatsProjectId,
    availableChatsForProject: projects.availableChatsForProject,
    projectChats: projects.projectChats,
    sortedChatList,
    selectedModel,
    selectedModelGroup,
    // ui flags
    isModalOpen,
    isCreateProjectModalOpen,
    isOverlayOpen,
    isSectionVisible,
    focusMode,
    inputSent,
    hasInput,
    hasFirstRequest,
    isTyping,
    templateTick,
    restoringActiveChat,
    isNewChat,
    isExistingChat,
    dockHidden,
    // errors
    chatError,
    clearChatError,
    // estimate
    showEstimate: draft.showEstimate,
    estimateSupported: draft.estimateSupported,
    estimatedTokens: draft.estimatedTokens,
    // model mode
    modelMode,
    setModelMode,
    modelRef,
    // refs
    inputRef: draft.inputRef,
    messagesEndRef,
    scrollContainerRef,
    // setters
    setInputImageCount: draft.setInputImageCount,
    // handlers
    handleChange: draft.handleChange,
    insertTemplate: draft.insertTemplate,
    handleSelectModel: selectModel,
    handleSelectChat,
    handleDeleteChat,
    handleRenameChat,
    handleSendClick,
    handleProjectSend,
    handleRemoveChatFromProject: projects.unlinkConversation,
    linkConversations: projects.linkConversations,
  };
}

export type HomeController = ReturnType<typeof useHomeController>;
