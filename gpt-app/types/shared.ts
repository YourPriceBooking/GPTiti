import { ModelType, ModelMode } from '@/types/types'; 
import { Chat } from '@/types/types';
export type ModelProps = { 
    modelRef: React.RefObject<HTMLDivElement | null>; 
    modelMode: ModelMode; 
    setModelMode: React.Dispatch<React.SetStateAction<ModelMode>>; 
    selectedModel: string; 
    setSelectedModel: (model: string) => void; 
    selectedModelGroup: ModelType; 
    setSelectedModelGroup: (group: ModelType) => void; };

    export type ChatContextType = { 
        chatList: Chat[]; 
        activeChatId: string | null; 
        activeChat?: Chat; 
        setActiveChatId: (id: string | null) => void; 

        handleNewChat: () => void; 
        deleteChat: (chatId: string) => void; 
        renameChat: (chatId: string, 
        newTitle: string) => void;

        hasInput: boolean; 
        inputSent: boolean; 
        isTyping: boolean; 
        inputRef: React.RefObject<HTMLTextAreaElement | null>; 
        templateTick: number; 

        handleChange: (e: React.ChangeEvent<HTMLTextAreaElement | null>) => void; 
        handleSendClick: (hasFirstRequest: boolean, imageUrls?: string[]) => Promise<void>;
        insertTemplate: (template: string) => void; 
    };