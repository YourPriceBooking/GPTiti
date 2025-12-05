"use client";
import { useRef, useState, useEffect } from 'react';
import LeftSide from '@/components/HomePage/LeftSide/LeftSide';
import styles from './page.module.css';
import { Chat } from '@/types/types';
import MessageList from '@/components/HomePage/RightSide/MessageList/MessageList'
import InputBar from '@/components/HomePage/RightSide/InputBar/InputBar';
import { generateAIResponse } from '@/components/HomePage/RightSide/AIResponse/AIReaponse';

export default function Home() {
  const [hasInput, setHasInput] = useState(false);
  const [inputSent, setInputSent] = useState(false);
  const initialChatId = crypto.randomUUID();
  const [chatList, setChatList] = useState<Chat[]>([
  { id: initialChatId, title: null, messages: [] }
]);
const [activeChatId, setActiveChatId] = useState<string | null>(initialChatId);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
 
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [chatList, activeChatId]);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setHasInput(e.target.value.trim().length > 0);

    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

 function handleSendClick() {
  if (hasInput && inputRef.current) {
    const userText = inputRef.current.value.trim();
    if (!userText) return;

    const aiResponse = generateAIResponse(userText);
    const newMessage = { user: userText, ai: aiResponse };

   
    if (!activeChatId) {
      const newChatId = crypto.randomUUID();
      const newChat: Chat = {
        id: newChatId,
        title: userText, 
        messages: [newMessage]
      };
      setChatList(prev => [...prev, newChat]);
      setActiveChatId(newChatId);
    } else {
      setChatList(prev =>
        prev.map(chat =>
          chat.id === activeChatId
            ? {
                ...chat,
                title: chat.title ?? userText,
                messages: [...chat.messages, newMessage]
              }
            : chat
        )
      );
    }

    setInputSent(true);
    setHasInput(false);
    inputRef.current.value = '';
  }
}

  function handleNewChat() {
  const newChatId = crypto.randomUUID(); 
  const newChat: Chat = {
    id: newChatId,
    title: null,   
    messages: []
  };

  setChatList(prev => [...prev, newChat]);
  setActiveChatId(newChatId);
  setHasInput(false);
  setInputSent(false);
  if (inputRef.current) inputRef.current.value = '';
}

const activeChat = chatList.find(chat => chat.id === activeChatId);

  return (
    <div className={styles.appContainer}>
      <LeftSide onNewChat={handleNewChat}
        chatList={chatList}
        setActiveChatId={setActiveChatId} />
      <div className={styles.rightSection}>
        {activeChat && activeChat.messages.length > 0 && (
         <MessageList messages={activeChat.messages}/>
        )}
         <div className={inputSent ? styles.inputBottom : styles.inputWrapper}>
        <InputBar hasInput={hasInput} onChange={handleChange} onSend={handleSendClick} inputRef={inputRef} />
        {inputSent && (
          <div className={styles.spanContainer}>
            <span className={styles.inputSpan}>
              AI systems may make mistakes, so we recommend verifying important information.
            </span>
          </div>
        )}
        </div>
         <div ref={messagesEndRef} />
        </div>
    </div>
  );
}