"use client";

import { useEffect } from "react";

import { handleNewChat } from "@/redux/chat/slice";
import { useAppDispatch } from "@/redux/hooks";

import AppShell from "./_home/AppShell";
import ChatView from "./_home/ChatView";

export default function Home() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(handleNewChat());
  }, [dispatch]);

  return <AppShell chatLayout>{(ctrl) => <ChatView ctrl={ctrl} />}</AppShell>;
}
