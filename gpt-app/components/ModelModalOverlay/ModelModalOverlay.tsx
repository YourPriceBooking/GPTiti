"use client"; 
import { ModelModalOverlayProps } from '@/types/types'; 
import styles from './ModelModalOverlay.module.css'; 
import ModalWindow from '@/components/HomePage/LeftSide/ModalWindow/ModalWindow'; 
export default function ModelModalOverlay(
    { isModalOpen, setIsModalOpen, selectedModel, setSelectedModel, selectedModelGroup, setSelectedModelGroup, }: ModelModalOverlayProps) 
    { if (!isModalOpen) return null; 
        return ( 
        <div className={styles.modalOverlay}> 
        <div className={styles.backdrop} 
        onClick={() => setIsModalOpen(false)} /> 
        <div className={styles.modalWrapper} 
        onMouseDown={(e) => 
            e.stopPropagation()} 
            onClick={(e) => e.stopPropagation()} > 
            <ModalWindow 
            selectedModelGroup={selectedModelGroup} 
            setSelectedModelGroup={setSelectedModelGroup} 
            selectedModel={selectedModel} 
            setSelectedModel={setSelectedModel} 
            setIsModalOpen={setIsModalOpen} />
             </div> 
             </div> ); 
             }