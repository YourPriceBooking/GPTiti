import { ModelType, ModelMode } from '@/types/types'; 
export type ModelProps = { 
    modelRef: React.RefObject<HTMLDivElement | null>; 
    modelMode: ModelMode; 
    setModelMode: React.Dispatch<React.SetStateAction<ModelMode>>; 
    selectedModel: string; 
    setSelectedModel: (model: string) => void; 
    selectedModelGroup: ModelType; 
    setSelectedModelGroup: (group: ModelType) => void; };