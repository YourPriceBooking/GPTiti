"use client";

import { useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

import { useModelMode } from "@/hooks/useModelMode";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useChatStream } from "@/hooks/useChatStream";
import { useChatRestore } from "@/hooks/useChatRestore";
import { useInputDraft } from "@/hooks/useInputDraft";
import { useModelSync } from "@/hooks/useModelSync";
import { useProjectChats } from "@/hooks/useProjectChats";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectActiveChat,
  selectActiveChatId,
  selectActiveChatMessageCount,
  selectActiveChatMessagesStatus,
  selectSortedChatList,
  selectChatStatus,
  selectHasInput,
  selectInputSent,
  selectIsTyping,
  selectTemplateTick,
} from "@/redux/chat/selectors";
import {
  addConversation,
  deleteDraftChat,
  handleNewChat,
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
  setAddChatsProjectId,
} from "@/redux/ui/slice";
import {
  fetchProjects,
  removeProject,
  updateProject,
} from "@/redux/projects/operations";
import { renameProject } from "@/redux/projects/slice";
import { selectProjectsStatus } from "@/redux/projects/selectors";

export function useHomeController() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const sortedChatList = useAppSelector(selectSortedChatList);
  const activeChat = useAppSelector(selectActiveChat);
  const activeChatId = useAppSelector(selectActiveChatId);
  const activeChatMessageCount = useAppSelector(selectActiveChatMessageCount);
  const activeChatMessagesStatus = useAppSelector(
    selectActiveChatMessagesStatus,
  );
  const chatListStatus = useAppSelector(selectChatStatus);
  const projectsStatus = useAppSelector(selectProjectsStatus);
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

  const draft = useInputDraft();
  const { clearDraft } = draft;
  const { selectedModel, selectedModelGroup, selectModel } = useModelSync({
    onModelSwitched: clearDraft,
  });
  const {
    ensureConnectionReady,
    sendMessage,
    retryLastMessage,
    cancelLastPendingMessage,
    streamError,
    clearStreamError,
  } = useChatStream();
  const { restoringActiveChat } = useChatRestore();
  const projects = useProjectChats();

  const { modelMode, setModelMode, modelRef } = useModelMode();

  const handleStartNewChat = useCallback(() => {
    clearDraft();
    dispatch(setActiveProjectId(null));
    dispatch(handleNewChat());
    router.push("/");
  }, [clearDraft, dispatch, router]);

  const handleAddChatsToProject = useCallback(
    (projectId: string) => dispatch(setAddChatsProjectId(projectId)),
    [dispatch],
  );

  const handleRenameProject = useCallback(
    (projectId: string, title: string) => {
      dispatch(renameProject({ id: projectId, title }));
      dispatch(updateProject({ id: projectId, changes: { title } }));
    },
    [dispatch],
  );

  const handleDeleteProject = useCallback(
    (projectId: string) => {
      void dispatch(removeProject(projectId)).then((action) => {
        if (
          removeProject.fulfilled.match(action) &&
          activeProjectId === projectId
        ) {
          dispatch(setActiveProjectId(null));
          router.push("/projects");
        }
      });
    },
    [activeProjectId, dispatch, router],
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sendCycleInFlightRef = useRef(false);
  const pendingProjectConversationRef = useRef<{
    projectId: string;
    conversationId: string;
  } | null>(null);
  useScrollDirection(scrollContainerRef);

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
      } catch {
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
      if (sendCycleInFlightRef.current) return false;
      sendCycleInFlightRef.current = true;

      try {
        const text = draft.readDraftText();
        if (!text && imageUrls.length === 0) return false;

        const conversationId = await ensureConversationId(text);
        if (!conversationId) return false;

        const accepted = await sendMessage({
          conversationId,
          modelId: selectedModel,
          text,
          imageUrls,
          imageFiles,
        });
        if (accepted) {
          draft.consumeDraft();
          router.replace(`/chats/${conversationId}`);
        }
        return accepted;
      } finally {
        sendCycleInFlightRef.current = false;
      }
    },
    [draft, ensureConversationId, router, selectedModel, sendMessage],
  );

  const handleProjectSend = useCallback(
    async (imageUrls: string[] = [], imageFiles: File[] = []) => {
      if (sendCycleInFlightRef.current) return false;
      sendCycleInFlightRef.current = true;

      try {
        if (!activeProjectId) return false;
        const text = draft.readDraftText();
        if (!text && imageUrls.length === 0) return false;

        if (!(await ensureConnectionReady())) return false;

        let conversationId =
          pendingProjectConversationRef.current?.projectId === activeProjectId
            ? pendingProjectConversationRef.current.conversationId
            : null;

        if (!conversationId) {
          let conv;
          try {
            conv = await dispatch(
              createConversation({
                modelId: selectedModel,
                title: text.slice(0, 60) || undefined,
              }),
            ).unwrap();
          } catch {
            return false;
          }

          conversationId = conv._id;
          pendingProjectConversationRef.current = {
            projectId: activeProjectId,
            conversationId,
          };

          dispatch(
            addConversation({
              id: conversationId,
              title: conv.title ?? (text || null),
              modelId: conv.modelId ?? selectedModel,
            }),
          );

          projects.linkConversations(activeProjectId, [conversationId]);
        }

        const accepted = await sendMessage({
          conversationId,
          modelId: selectedModel,
          text,
          imageUrls,
          imageFiles,
        });
        if (accepted) {
          pendingProjectConversationRef.current = null;
          draft.consumeDraft();
          dispatch(setActiveProjectId(null));
          router.replace(`/chats/${conversationId}`);
        }
        return accepted;
      } finally {
        sendCycleInFlightRef.current = false;
      }
    },
    [
      dispatch,
      activeProjectId,
      ensureConnectionReady,
      selectedModel,
      draft,
      projects,
      router,
      sendMessage,
    ],
  );

  const handleSelectChat = useCallback(
    (id: string) => {
      dispatch(setActiveProjectId(null));
      dispatch(setActiveChatId(id));
      router.push(`/chats/${id}`);
    },
    [dispatch, router],
  );

  const handleRetryStream = useCallback(async () => {
    if (!activeChatId) return false;
    const accepted = await retryLastMessage(activeChatId);
    if (accepted) draft.consumeDraft();
    return accepted;
  }, [activeChatId, draft, retryLastMessage]);

  const handleCancelPendingMessage = useCallback(() => {
    if (!activeChatId) return;
    cancelLastPendingMessage(activeChatId);
  }, [activeChatId, cancelLastPendingMessage]);

  const handleDeleteChat = useCallback(
    (id: string) => {
      if (isDraftId(id)) dispatch(deleteDraftChat(id));
      else dispatch(removeConversation(id));
      if (id === activeChatId) router.push("/");
    },
    [activeChatId, dispatch, router],
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
    // роутинг: чи вже є дані, щоб вирішити, показувати "not found"
    chatsLoaded: chatListStatus === "loaded",
    projectsLoaded: projectsStatus === "loaded",
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
    sendDisabled: !isLoggedIn || !accessTokenReady || restoringActiveChat,
    isNewChat,
    isExistingChat,
    dockHidden,
    // errors
    streamError,
    clearStreamError,
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
    handleStartNewChat,
    handleAddChatsToProject,
    handleRenameProject,
    handleDeleteProject,
    insertTemplate: draft.insertTemplate,
    handleSelectModel: selectModel,
    handleSelectChat,
    handleDeleteChat,
    handleRenameChat,
    handleSendClick,
    handleRetryStream,
    handleCancelPendingMessage,
    handleProjectSend,
    handleRemoveChatFromProject: projects.unlinkConversation,
    linkConversations: projects.linkConversations,
  };
}

export type HomeController = ReturnType<typeof useHomeController>;
