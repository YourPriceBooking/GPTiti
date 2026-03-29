"use client";

import React from "react";
import { createRequestId } from "@/lib/wsProtocol";
import { useWs } from "@/context/WsContext";
import { useWsChatActions } from "@/hooks/useWsChatActions";

export default function WsDebugPanel() {
  const { onMessage } = useWs();
  const { status, lastError, sendMessage } = useWsChatActions();
  const [log, setLog] = React.useState<string[]>([]);

  React.useEffect(() => {
    return onMessage((msg) => {
      setLog((prev) => {
        const line = `${new Date().toISOString()} <= ${msg.event}:${msg.type} ${msg.requestId ?? ""}`;
        return [line, ...prev].slice(0, 50);
      });
    });
  }, [onMessage]);

  const sendPingLike = async () => {
    const requestId = createRequestId("dbg");

    setLog((prev) => {
      const line = `${new Date().toISOString()} => chat:send ${requestId}`;
      return [line, ...prev].slice(0, 50);
    });

    if (status !== "connected") {
      setLog((prev) => {
        const line = `${new Date().toISOString()} !! not connected (status=${status})`;
        return [line, ...prev].slice(0, 50);
      });
      return;
    }

    try {
      const ack = await sendMessage(
        {
        chatId: "test-chat",
        message: "ping from GPTiti",
        model: "mock",
        temperature: 0.7,
        },
        { requestId }
      );

      setLog((prev) => {
        const line = `${new Date().toISOString()} <= ack ${ack.event}:${ack.type} ${ack.requestId ?? ""}`;
        return [line, ...prev].slice(0, 50);
      });
    } catch (e) {
      setLog((prev) => [`${new Date().toISOString()} !! ${(e as Error).message}`, ...prev]);
    }
  };

  return (
    <div style={{ padding: 12, border: "1px solid #243052", borderRadius: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
        <div>
          <div style={{ color: "#A9BEDC", fontSize: 12 }}>WS status</div>
          <div style={{ color: "#fff", fontSize: 14 }}>{status}</div>
          {lastError && <div style={{ color: "#ffb4b4", fontSize: 12 }}>{lastError}</div>}
        </div>
        <button
          type="button"
          onClick={sendPingLike}
          style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #243052" }}
        >
          Send test
        </button>
      </div>

      <div style={{ color: "#A9BEDC", fontSize: 12, marginBottom: 6 }}>Last messages</div>
      <div
        style={{
          maxHeight: 180,
          overflow: "auto",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace",
          fontSize: 12,
          color: "#D7E3F3",
          whiteSpace: "pre-wrap",
        }}
      >
        {log.length ? log.join("\n") : "(empty)"}
      </div>
    </div>
  );
}
