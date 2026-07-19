"use client";

import { useRef, useEffect, useCallback, useState, useMemo } from "react";

import type { Chat } from "@/types/types";

import { useModelMode } from "@/hooks/useModelMode";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import {
  getEstimatedTokens,
  modelSupportsEstimate,
} from "@/config/modelPricing.config";
import { getModelLimits } from "@/config/modelLimits.config";
import { getModelGroupAndItem } from "@/functions/getModelGroupAndItem";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectActiveChat,
  selectActiveChatId,
  selectChatList,
  selectSortedChatList,
  selectHasInput,
  selectInputSent,
  selectIsTyping,
  selectTemplateTick,
} from "@/redux/chat/selectors";
import {
  addConversation,
  appendAssistantChunk,
  appendUserMessage,
  bumpTemplateTick,
  deleteDraftChat,
  finishAssistantMessage,
  handleNewChat,
  isDraftId,
  promoteDraft,
  renameChat,
  setActiveChatId,
  setHasInput,
  setInputSent,
  setIsTyping,
  startAssistantMessage,
} from "@/redux/chat/slice";
import {
  createConversation,
  fetchConversationMessages,
  fetchConversations,
  removeConversation,
  renameConversation,
} from "@/redux/chat/operations";
import { selectIsLoggedIn, selectAccessToken } from "@/redux/auth/selectors";
import { useSocket } from "@/context/SocketContext";
import {
  selectSelectedModel,
  selectSelectedModelGroup,
} from "@/redux/model/selectors";
import { setSelectedModel, setSelectedModelGroup } from "@/redux/model/slice";
import {
  selectFocusMode,
  selectHasFirstRequest,
  selectIsModalOpen,
  selectIsCreateProjectModalOpen,
  selectActiveProjectId,
  selectAddChatsProjectId,
  selectIsOverlayOpen,
  selectIsSectionVisible,
  selectNewChatOpened,
} from "@/redux/ui/selectors";
import {
  setFocusMode,
  setIsSectionVisible,
  setNewChatOpened,
  setActiveProjectId,
} from "@/redux/ui/slice";
import { selectProjectList } from "@/redux/projects/selectors";
import {
  addProjectConversations,
  fetchProjects,
  fetchProject,
  removeProjectConversation,
} from "@/redux/projects/operations";
import { refreshError } from "@/redux/auth/slice";
import { setBalance } from "@/redux/tokens/slice";
import { isAuthExpiredError } from "@/lib/authError";
import { api } from "@/helpers/api";

export function useHomeController() {
  const dispatch = useAppDispatch();

  const chatList = useAppSelector(selectChatList);
  const sortedChatList = useAppSelector(selectSortedChatList);
  const activeChat = useAppSelector(selectActiveChat);
  const activeChatId = useAppSelector(selectActiveChatId);
  const hasInput = useAppSelector(selectHasInput);
  const inputSent = useAppSelector(selectInputSent);
  const isTyping = useAppSelector(selectIsTyping);
  const templateTick = useAppSelector(selectTemplateTick);

  const selectedModel = useAppSelector(selectSelectedModel);
  const selectedModelGroup = useAppSelector(selectSelectedModelGroup);

  const focusMode = useAppSelector(selectFocusMode);
  const isSectionVisible = useAppSelector(selectIsSectionVisible);
  const isModalOpen = useAppSelector(selectIsModalOpen);
  const isCreateProjectModalOpen = useAppSelector(
    selectIsCreateProjectModalOpen,
  );
  const activeProjectId = useAppSelector(selectActiveProjectId);
  const addChatsProjectId = useAppSelector(selectAddChatsProjectId);
  const projectList = useAppSelector(selectProjectList);
  const activeProject = projectList.find((p) => p.id === activeProjectId);
  const addChatsProject = projectList.find((p) => p.id === addChatsProjectId);

  const projectChats = useMemo<Chat[]>(
    () =>
      (activeProject?.conversationIds ?? []).map((conv) => {
        const loaded = chatList.find((c) => c.id === conv._id);
        return {
          id: conv._id,
          title: conv.title ?? loaded?.title ?? null,
          modelId: conv.modelId ?? loaded?.modelId,
          lastMessageAt: conv.lastMessageAt ?? loaded?.lastMessageAt,
          createdAt: conv.createdAt ?? loaded?.createdAt,
          messages: loaded?.messages ?? [],
          messagesLoaded: loaded?.messagesLoaded,
        };
      }),
    [activeProject?.conversationIds, chatList],
  );

  console.log("projectChats", projectChats);
  const availableChatsForProject = useMemo(() => {
    const inProject = new Set(
      (addChatsProject?.conversationIds ?? []).map((c) => c._id),
    );
    return chatList.filter(
      (c) => !isDraftId(c.id) && c.title !== null && !inProject.has(c.id),
    );
  }, [chatList, addChatsProject?.conversationIds]);
  const isOverlayOpen = useAppSelector(selectIsOverlayOpen);
  const hasFirstRequest = useAppSelector(selectHasFirstRequest);
  const newChatOpened = useAppSelector(selectNewChatOpened);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const accessToken = useAppSelector(selectAccessToken);

  const { modelMode, setModelMode, modelRef } = useModelMode();
  const { socket } = useSocket();

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pendingTemplateRef = useRef<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pendingConvIdRef = useRef<string | null>(null);
  const restoredActiveChatRef = useRef(false);

  const [inputCharCount, setInputCharCount] = useState(0);
  const [inputImageCount, setInputImageCount] = useState(0);

  const [restoringActiveChat, setRestoringActiveChat] = useState(() => {
    if (!isLoggedIn) return false;
    if (!activeChatId || isDraftId(activeChatId)) return false;
    const chat = chatList.find((c) => c.id === activeChatId);
    return !chat?.messagesLoaded;
  });

  const estimatedTokens = useMemo(
    () => getEstimatedTokens(selectedModel, inputCharCount, inputImageCount),
    [selectedModel, inputCharCount, inputImageCount],
  );
  const showEstimate = estimatedTokens !== null;
  const estimateSupported = modelSupportsEstimate(selectedModel);

  useScrollDirection(scrollContainerRef);

  const activeChatLoading =
    !!activeChat && !isDraftId(activeChat.id) && !activeChat.messagesLoaded;
  const isNewChat =
    !activeChatLoading && (!activeChat || activeChat.messages.length === 0);
  const isExistingChat = !!activeChat && !newChatOpened;

  const dockHidden = (isSectionVisible && focusMode) || isOverlayOpen;

  useEffect(() => {
    if (activeChat && activeChat.messages.length > 0) {
      const t = setTimeout(() => dispatch(setNewChatOpened(false)), 0);
      return () => clearTimeout(t);
    }
  }, [activeChat?.messages.length, activeChat, dispatch]);

  const scrollChatId = activeChat?.id;
  const scrollMessageCount = activeChat?.messages.length ?? 0;

  useEffect(() => {
    if (restoringActiveChat) return;
    if (!scrollChatId || scrollMessageCount === 0) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
  }, [scrollChatId, scrollMessageCount, restoringActiveChat]);

  useEffect(() => {
    const empty = !activeChat || activeChat.messages.length === 0;
    const t = setTimeout(() => {
      dispatch(setIsSectionVisible(empty));
      dispatch(setFocusMode(false));
    }, 0);
    return () => clearTimeout(t);
  }, [activeChatId, activeChat?.messages.length, activeChat, dispatch]);

  useEffect(() => {
    if (!activeChat || isDraftId(activeChat.id)) return;
    const model = activeChat.modelId;
    if (!model || model === selectedModel) return;
    const found = getModelGroupAndItem(model);
    if (!found) return;
    dispatch(setSelectedModel(model));
    dispatch(setSelectedModelGroup(found.group));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChat?.id, activeChat?.modelId, selectedModel, dispatch]);

  useEffect(() => {
    const maxChars = getModelLimits(selectedModel).maxTextChars;
    if (maxChars === null) return;
    const textarea = inputRef.current;
    if (!textarea) return;
    const current = textarea.value;
    if (current.length <= maxChars) return;

    const clipped = current.slice(0, maxChars);
    textarea.value = clipped;
    dispatch(setHasInput(clipped.trim().length > 0));
    setInputCharCount(clipped.length);
    dispatch(bumpTemplateTick());
  }, [selectedModel, dispatch]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | null>) => {
      const value = e.target?.value ?? "";
      dispatch(setHasInput(value.trim().length ? true : false));
      setInputCharCount(value.length);
    },
    [dispatch],
  );

  const insertTemplate = useCallback(
    (template: string) => {
      if (!inputRef.current) return;
      const maxChars = getModelLimits(selectedModel).maxTextChars;
      const clipped =
        maxChars !== null && template.length > maxChars
          ? template.slice(0, maxChars)
          : template;
      inputRef.current.value = clipped;
      inputRef.current.scrollTop = 0;
      dispatch(setHasInput(clipped.trim().length > 0));
      setInputCharCount(clipped.length);
      dispatch(bumpTemplateTick());
      inputRef.current.focus();
    },
    [dispatch, selectedModel],
  );

  const handleSelectModel = useCallback(
    (model: string) => {
      const changed = model !== selectedModel;
      dispatch(setSelectedModel(model));
      if (changed && activeChat && activeChat.messages.length > 0) {
        dispatch(handleNewChat());
        if (inputRef.current) inputRef.current.value = "";
        setInputCharCount(0);
        setInputImageCount(0);
        dispatch(setHasInput(false));
        dispatch(bumpTemplateTick());
      }
    },
    [dispatch, selectedModel, activeChat],
  );

  const deliverMessage = useCallback(
    async (
      convId: string,
      userText: string,
      imageUrls: string[],
      imageFiles: File[],
    ) => {
      dispatch(
        appendUserMessage({
          chatId: convId,
          content: userText,
          images: imageUrls,
        }),
      );
      dispatch(setInputSent(true));
      dispatch(setHasInput(false));
      dispatch(setIsTyping(true));
      if (inputRef.current) inputRef.current.value = "";
      setInputCharCount(0);
      setInputImageCount(0);

      dispatch(
        startAssistantMessage({ chatId: convId, modelId: selectedModel }),
      );
      pendingConvIdRef.current = convId;

      try {
        const uploadedFiles = await Promise.all(
          imageFiles.map((file) => api.uploadImage(file).then((r) => r.file)),
        );

        socket?.emit("chat:send", {
          event: "chat:send",
          type: "send-request",
          payload: {
            message: userText,
            conversationId: convId,
            modelId: selectedModel,
            ...(uploadedFiles.length > 0 && { files: uploadedFiles }),
          },
        });
      } catch {
        dispatch(finishAssistantMessage({ chatId: convId }));
        dispatch(setIsTyping(false));
        pendingConvIdRef.current = null;
      }
    },
    [dispatch, selectedModel, socket],
  );

  const handleSendClick = useCallback(
    async (
      _hasFirstRequest: boolean,
      imageUrls: string[] = [],
      imageFiles: File[] = [],
    ) => {
      if (!inputRef.current || !activeChatId) return;
      const userText = inputRef.current.value.trim();
      if (!userText && imageUrls.length === 0) return;

      let convId = activeChatId;
      if (isDraftId(convId)) {
        try {
          const conv = await dispatch(
            createConversation({
              modelId: selectedModel,
              title: userText.slice(0, 60) || undefined,
            }),
          ).unwrap();
          dispatch(
            promoteDraft({
              draftId: convId,
              realId: conv._id,
              title: conv.title ?? (userText || null),
              modelId: conv.modelId ?? selectedModel,
            }),
          );
          convId = conv._id;
        } catch {
          return;
        }
      }

      await deliverMessage(convId, userText, imageUrls, imageFiles);
    },
    [dispatch, activeChatId, selectedModel, deliverMessage],
  );

  const handleProjectSend = useCallback(
    async (imageUrls: string[] = [], imageFiles: File[] = []) => {
      if (!inputRef.current || !activeProjectId) return;
      const userText = inputRef.current.value.trim();
      if (!userText && imageUrls.length === 0) return;

      const projectId = activeProjectId;
      let conv;
      try {
        conv = await dispatch(
          createConversation({
            modelId: selectedModel,
            title: userText.slice(0, 60) || undefined,
          }),
        ).unwrap();
      } catch {
        return;
      }

      dispatch(
        addConversation({
          id: conv._id,
          title: conv.title ?? (userText || null),
          modelId: conv.modelId ?? selectedModel,
        }),
      );
      dispatch(
        addProjectConversations({
          projectId,
          conversationIds: [conv._id],
        }),
      )
        .unwrap()
        .then(() => dispatch(fetchConversations()))
        .catch(() => {});
      dispatch(setActiveProjectId(null));

      await deliverMessage(conv._id, userText, imageUrls, imageFiles);
    },
    [dispatch, activeProjectId, selectedModel, deliverMessage],
  );

  const handleSelectChat = useCallback(
    (id: string) => {
      dispatch(setActiveProjectId(null));
      dispatch(setActiveChatId(id));
      if (isDraftId(id)) return;
      const chat = chatList.find((c) => c.id === id);
      if (chat && !chat.messagesLoaded) {
        dispatch(fetchConversationMessages(id));
      }
    },
    [dispatch, chatList],
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

  useEffect(() => {
    if (isLoggedIn && accessToken) {
      dispatch(fetchConversations());
      dispatch(fetchProjects());
    }
  }, [isLoggedIn, accessToken, dispatch]);

  useEffect(() => {
    if (isLoggedIn && activeProjectId) dispatch(fetchProject(activeProjectId));
  }, [isLoggedIn, activeProjectId, dispatch]);

  const prefetchedMessagesRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (!isLoggedIn || !activeProjectId) return;
    projectChats.forEach((chat) => {
      if (
        chat.messagesLoaded ||
        isDraftId(chat.id) ||
        prefetchedMessagesRef.current.has(chat.id)
      ) {
        return;
      }
      prefetchedMessagesRef.current.add(chat.id);
      dispatch(fetchConversationMessages(chat.id));
    });
  }, [isLoggedIn, activeProjectId, projectChats, dispatch]);

  useEffect(() => {
    if (isLoggedIn && addChatsProjectId) {
      dispatch(fetchProject(addChatsProjectId));
    }
  }, [isLoggedIn, addChatsProjectId, dispatch]);

  const handleRemoveChatFromProject = useCallback(
    (conversationId: string) => {
      if (!activeProjectId) return;
      dispatch(
        removeProjectConversation({
          projectId: activeProjectId,
          conversationId,
        }),
      )
        .unwrap()
        .then(() => dispatch(fetchConversations()))
        .catch(() => {});
    },
    [dispatch, activeProjectId],
  );

  useEffect(() => {
    if (restoredActiveChatRef.current) return;
    if (chatList.length === 0) return;

    if (!activeChatId || isDraftId(activeChatId)) {
      if (!chatList.some((c) => c.id === activeChatId)) {
        dispatch(setActiveChatId(chatList[0].id));
      }
      restoredActiveChatRef.current = true;
      return;
    }

    const chat = chatList.find((c) => c.id === activeChatId);
    if (!chat) return;
    restoredActiveChatRef.current = true;
    if (!chat.messagesLoaded) dispatch(fetchConversationMessages(activeChatId));
  }, [activeChatId, chatList, dispatch]);

  useEffect(() => {
    if (!restoringActiveChat) return;
    if (
      !isLoggedIn ||
      !activeChatId ||
      isDraftId(activeChatId) ||
      activeChat?.messagesLoaded
    ) {
      setRestoringActiveChat(false);
    }
  }, [
    restoringActiveChat,
    isLoggedIn,
    activeChatId,
    activeChat?.messagesLoaded,
  ]);

  useEffect(() => {
    if (!restoringActiveChat) return;
    const t = setTimeout(() => setRestoringActiveChat(false), 6000);
    return () => clearTimeout(t);
  }, [restoringActiveChat]);

  useEffect(() => {
    if (!socket) return;

    const onStream = (data: { chunk?: string }) => {
      const chatId = pendingConvIdRef.current;
      if (!chatId || !data?.chunk) return;
      dispatch(appendAssistantChunk({ chatId, chunk: data.chunk }));
    };
    const onEnd = (data?: {
      payload?: {
        appTokensSpent?: number;
        totalTokens?: number;
        balance?: number;
      };
    }) => {
      const chatId = pendingConvIdRef.current;
      const tokens = data?.payload?.appTokensSpent;
      if (chatId) dispatch(finishAssistantMessage({ chatId, tokens }));
      if (typeof data?.payload?.balance === "number") {
        dispatch(setBalance(data.payload.balance));
      }
      dispatch(setIsTyping(false));
      pendingConvIdRef.current = null;
    };
    const onError = (err: unknown) => {
      const chatId = pendingConvIdRef.current;
      if (chatId) dispatch(finishAssistantMessage({ chatId }));
      dispatch(setIsTyping(false));
      pendingConvIdRef.current = null;

      if (isAuthExpiredError(err)) dispatch(refreshError());
    };

    socket.on("chat:stream", onStream);
    socket.on("chat:end", onEnd);
    socket.on("chat:error", onError);
    return () => {
      socket.off("chat:stream", onStream);
      socket.off("chat:end", onEnd);
      socket.off("chat:error", onError);
    };
  }, [socket, dispatch]);

  const insertTemplateToInput = (template: string) => {
    const maxChars = getModelLimits(selectedModel).maxTextChars;
    const clipped =
      maxChars !== null && template.length > maxChars
        ? template.slice(0, maxChars)
        : template;
    if (inputRef.current) {
      inputRef.current.value = clipped;
      inputRef.current.focus();
      handleChange({
        target: inputRef.current,
      } as React.ChangeEvent<HTMLTextAreaElement>);
      dispatch(bumpTemplateTick());
    } else {
      pendingTemplateRef.current = clipped;
    }
  };

  useEffect(() => {
    if (!isOverlayOpen && pendingTemplateRef.current && inputRef.current) {
      inputRef.current.value = pendingTemplateRef.current;
      inputRef.current.focus();
      handleChange({
        target: inputRef.current,
      } as React.ChangeEvent<HTMLTextAreaElement>);
      dispatch(bumpTemplateTick());
      pendingTemplateRef.current = null;
    }
  }, [isOverlayOpen, handleChange, dispatch]);

  return {
    dispatch,
    // data / selectors
    activeChat,
    activeProject,
    addChatsProject,
    addChatsProjectId,
    availableChatsForProject,
    projectChats,
    sortedChatList,
    selectedModel,
    selectedModelGroup,
    // ui flags
    isModalOpen,
    isCreateProjectModalOpen,
    isOverlayOpen,
    isSectionVisible,
    focusMode,
    newChatOpened,
    inputSent,
    hasInput,
    hasFirstRequest,
    isTyping,
    templateTick,
    restoringActiveChat,
    isNewChat,
    isExistingChat,
    dockHidden,
    // estimate
    showEstimate,
    estimateSupported,
    estimatedTokens,
    // model mode
    modelMode,
    setModelMode,
    modelRef,
    // refs
    inputRef,
    messagesEndRef,
    scrollContainerRef,
    // setters
    setInputImageCount,
    // handlers
    handleChange,
    insertTemplate,
    insertTemplateToInput,
    handleSelectModel,
    handleSelectChat,
    handleDeleteChat,
    handleRenameChat,
    handleSendClick,
    handleProjectSend,
    handleRemoveChatFromProject,
  };
}

export type HomeController = ReturnType<typeof useHomeController>;
