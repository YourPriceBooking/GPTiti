"use client";
import { LIBRARY_ENABLED } from "@/lib/files/library";
import { readLibraryDraft, writeLibraryDraft, clearLibraryDraft, subscribeLibraryDraft } from "@/lib/files/libraryDraft";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { getModelLimits } from "@/config/modelLimits.config";
import {
  getEstimatedTokens,
  modelSupportsEstimate,
} from "@/config/modelPricing.config";
import {
  bumpTemplateTick,
  setHasInput,
  setInputSent,
} from "@/redux/chat/slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectSelectedModel } from "@/redux/model/selectors";
import { selectIsOverlayOpen } from "@/redux/ui/selectors";
import { selectUser } from "@/redux/auth/selectors";
import {
  clearTokenHistoryDraft,
  registerTokenHistoryDraft,
  takeTokenHistoryDraft,
} from "@/lib/tokenHistoryDraft";

export function useInputDraft() {
  const dispatch = useAppDispatch();
  const selectedModel = useAppSelector(selectSelectedModel);
  const isOverlayOpen = useAppSelector(selectIsOverlayOpen);
  const ownerId = useAppSelector(selectUser)?.id;
  const pathname = usePathname();

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pendingTemplateRef = useRef<string | null>(null);
  const latestTextRef = useRef("");

  const [inputCharCount, setInputCharCount] = useState(0);
  const [inputImageCount, setInputImageCount] = useState(0);

  const syncFromValue = useCallback(
    (value: string) => {
      latestTextRef.current = value;
      if (LIBRARY_ENABLED) writeLibraryDraft(ownerId,pathname,{text:value});
      dispatch(setHasInput(value.trim().length > 0));
      setInputCharCount(value.length);
    },
    [dispatch,ownerId,pathname],
  );

  const clipToModelLimit = useCallback(
    (text: string) => {
      const maxChars = getModelLimits(selectedModel).maxTextChars;
      return maxChars !== null && text.length > maxChars
        ? text.slice(0, maxChars)
        : text;
    },
    [selectedModel],
  );

  const applyTemplate = useCallback(
    (textarea: HTMLTextAreaElement, value: string) => {
      textarea.value = value;
      textarea.scrollTop = 0;
      textarea.focus();
      syncFromValue(value);
      dispatch(bumpTemplateTick());
    },
    [dispatch, syncFromValue],
  );

  useLayoutEffect(() => {
    if (!LIBRARY_ENABLED || !ownerId) return;
    const restore = () => {
      const textarea = inputRef.current;
      const saved = readLibraryDraft(ownerId,pathname);
      if (textarea && !textarea.value && saved.text) {
        textarea.value = saved.text;
        latestTextRef.current = saved.text;
        setInputCharCount(saved.text.length);
        dispatch(setHasInput(!!saved.text.trim()));
        dispatch(bumpTemplateTick());
      }
    };
    const frame = requestAnimationFrame(restore);
    const unsubscribe = subscribeLibraryDraft(restore);
    return () => { cancelAnimationFrame(frame); unsubscribe(); };
  }, [ownerId,pathname,dispatch,isOverlayOpen]);

  useLayoutEffect(() => {
    if (!ownerId) {
      clearTokenHistoryDraft();
      return;
    }
    return registerTokenHistoryDraft(() => {
      const textarea = inputRef.current;
      const text = textarea?.value ?? latestTextRef.current;
      return {
        ownerId,
        pathname,
        text,
        selectionStart: textarea?.selectionStart ?? text.length,
        selectionEnd: textarea?.selectionEnd ?? text.length,
      };
    });
  }, [ownerId, pathname]);

  useLayoutEffect(() => {
    const textarea = inputRef.current;
    if (!ownerId || !textarea) return;
    const frame = requestAnimationFrame(() => {
      // Wait for the uncontrolled composer to mount; Strict Mode can cancel
      // this frame without consuming the saved draft.
      if (textarea.value) return;
      const saved = takeTokenHistoryDraft(ownerId, pathname);
      if (!saved) return;
      const text = LIBRARY_ENABLED ? saved.text : clipToModelLimit(saved.text);
      textarea.value = text;
      textarea.setSelectionRange(
        Math.min(saved.selectionStart, text.length),
        Math.min(saved.selectionEnd, text.length),
      );
      syncFromValue(text);
      dispatch(bumpTemplateTick());
    });
    return () => cancelAnimationFrame(frame);
  }, [ownerId, pathname, isOverlayOpen, clipToModelLimit, syncFromValue, dispatch]);

  useEffect(() => {
    if (LIBRARY_ENABLED) return;
    const textarea = inputRef.current;
    if (!textarea) return;
    const clipped = clipToModelLimit(textarea.value);
    if (clipped === textarea.value) return;
    textarea.value = clipped;
    syncFromValue(clipped);
    dispatch(bumpTemplateTick());
  }, [clipToModelLimit, syncFromValue, dispatch]);

  useEffect(() => {
    if (isOverlayOpen) return;
    const pending = pendingTemplateRef.current;
    const textarea = inputRef.current;
    if (!pending || !textarea) return;
    pendingTemplateRef.current = null;
    applyTemplate(textarea, pending);
  }, [isOverlayOpen, applyTemplate]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | null>) => {
      syncFromValue(e.target?.value ?? "");
    },
    [syncFromValue],
  );

  const insertTemplate = useCallback(
    (template: string) => {
      const clipped = clipToModelLimit(template);
      const textarea = inputRef.current;
      if (!textarea) {
        pendingTemplateRef.current = clipped;
        return;
      }
      applyTemplate(textarea, clipped);
    },
    [clipToModelLimit, applyTemplate],
  );

  const readDraftText = useCallback(
    () => inputRef.current?.value.trim() ?? "",
    [],
  );

  const resetFields = useCallback(() => {
    clearTokenHistoryDraft();
    if (LIBRARY_ENABLED) clearLibraryDraft(ownerId,pathname);
    latestTextRef.current = "";
    if (inputRef.current) inputRef.current.value = "";
    setInputCharCount(0);
    setInputImageCount(0);
    dispatch(setHasInput(false));
  }, [dispatch,ownerId,pathname]);

  const consumeDraft = useCallback(() => {
    resetFields();
    dispatch(setInputSent(true));
  }, [resetFields, dispatch]);

  const clearDraft = useCallback(() => {
    resetFields();
    dispatch(bumpTemplateTick());
  }, [resetFields, dispatch]);

  const estimatedTokens = useMemo(
    () => getEstimatedTokens(selectedModel, inputCharCount, inputImageCount),
    [selectedModel, inputCharCount, inputImageCount],
  );

  return {
    inputRef,
    handleChange,
    insertTemplate,
    readDraftText,
    consumeDraft,
    clearDraft,
    setInputImageCount,
    estimatedTokens,
    showEstimate: estimatedTokens !== null,
    estimateSupported: modelSupportsEstimate(selectedModel),
  };
}

export type InputDraft = ReturnType<typeof useInputDraft>;
