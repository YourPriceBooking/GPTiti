export type CorrelatedMessage = {
  id?: string;
  role: "user" | "assistant";
  content: string;
  clientMessageId?: string;
  turnId?: string;
};

export const messagesCorrelate = (
  left: CorrelatedMessage,
  right: CorrelatedMessage,
): boolean => {
  if (left.id && right.id && left.id === right.id) return true;
  if (left.role !== right.role) return false;
  if (
    left.role === "user" &&
    left.clientMessageId &&
    right.clientMessageId === left.clientMessageId
  ) {
    return true;
  }
  if (left.role === "assistant" && left.turnId && right.turnId === left.turnId) {
    return true;
  }
  return Boolean(
    left.role === "assistant" &&
      left.clientMessageId &&
      right.clientMessageId === left.clientMessageId,
  );
};

export const upsertCorrelatedMessage = <T extends CorrelatedMessage>(
  messages: readonly T[],
  incoming: T,
): T[] => {
  const index = messages.findIndex((message) =>
    messagesCorrelate(message, incoming),
  );
  if (index < 0) return [...messages, incoming];
  return messages.map((message, messageIndex) =>
    messageIndex === index ? ({ ...message, ...incoming } as T) : message,
  );
};

export const removeCorrelatedTurnMessages = <T extends CorrelatedMessage>(
  messages: readonly T[],
  clientMessageId: string,
): T[] =>
  messages.filter((message) => message.clientMessageId !== clientMessageId);

export const mergeServerMessages = <T extends CorrelatedMessage>(
  localMessages: readonly T[],
  serverMessages: readonly T[],
): T[] => {
  const matchedLocalIndexes = new Set<number>();
  const mergedServer = serverMessages.map((serverMessage) => {
    const localIndex = localMessages.findIndex(
      (localMessage, index) =>
        !matchedLocalIndexes.has(index) &&
        messagesCorrelate(localMessage, serverMessage),
    );
    if (localIndex < 0) return serverMessage;
    matchedLocalIndexes.add(localIndex);
    return { ...localMessages[localIndex], ...serverMessage } as T;
  });
  const localOnly = localMessages.filter(
    (_message, index) => !matchedLocalIndexes.has(index),
  );
  return [...mergedServer, ...localOnly];
};
