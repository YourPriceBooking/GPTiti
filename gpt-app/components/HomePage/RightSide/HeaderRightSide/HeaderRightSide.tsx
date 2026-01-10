import styles from "./HeaderRightSide.module.css";
import Image from "next/image";
import ModelGptitiTitleWithIcon from "@/components/ModelGptitiTitleWithIcon/ModelGptitiTitleWithIcon";
import { HeaderRightSideProps } from "@/types/types";
import { TOKENS_SUFFIX } from "@/config/models.config";
import { getModelGroupAndItem } from "@/functions/getModelGroupAndItem";
import LeftSide from "../../LeftSide/LeftSide";
import { useModelMode } from "@/hooks/useModelMode";
import { useChatContext } from "@/context/ChatContext";
import { useEffect, useState } from "react";
import {createPortal} from 'react-dom';

export default function HeaderRightSide({
  chatTitle,
  modelRef,
  selectedModel,
  setSelectedModel,
  selectedModelGroup,
  setSelectedModelGroup,
  isModalOpen,
  setIsModalOpen,
  onOpenQuickActions,
  hasFirstRequest,
}: HeaderRightSideProps & {
  onOpenQuickActions: () => void;
  hasFirstRequest: boolean;
}) {
  
  const result = getModelGroupAndItem(selectedModel);
  const {
      chatList,
      setActiveChatId,
      handleNewChat,
      deleteChat,
      renameChat,
      activeChatId
    } = useChatContext();
  
    const { modelMode, setModelMode} = useModelMode();
    const [isIconClicked, setIsIconClicked] = useState(false);
    useEffect(() => 
      { 
        if (isIconClicked) 
          { const timer = setTimeout(()=> {setIsIconClicked(false)},
        0);
      return () => clearTimeout(timer); } 
      }, 
        [activeChatId]);
  return (
    <div className={styles.container}>
      <Image 
      className={styles.openModal}
      src='/icons/open-icon.svg' 
      width={25} 
      height={25} 
      alt="open-modal"
      onClick= {() => setIsIconClicked(true)}
      />
    {isIconClicked && 
    createPortal ( 
    <div className={styles.modalOverlay} 
    onClick={() => setIsIconClicked(false)}> 
    <div className={styles.modalContent} 
    onClick={(e) => e.stopPropagation()}> 
    <button className={styles.closeButton} onClick={() => setIsIconClicked(false)}
        aria-label="Close modal"
      >
        <Image src='/icons/close.svg' width={20} height={20} alt="close-modal" />
      </button>
    <LeftSide onNewChat={handleNewChat} 
    isModalOpen={isModalOpen} 
    setIsModalOpen={setIsModalOpen} 
    modelMode={modelMode} 
    setModelMode={setModelMode} 
    chatList={chatList} 
    setActiveChatId={setActiveChatId} 
    deleteChat={deleteChat} 
    renameChat={renameChat} 
    modelRef={modelRef} 
    selectedModel={selectedModel} 
    setSelectedModel={setSelectedModel} 
    selectedModelGroup={selectedModelGroup} 
    setSelectedModelGroup={setSelectedModelGroup} /> 
    </div> 
    </div> ,
    document.body)}
    
      <div className={styles.containerGroupLogos}>
        <Image
          className={styles.rabbitLogo}
          src="/icons/rabbit.svg"
          alt="logo-rabbit"
          width={47}
          height={47}
        />
        <Image
          className={styles.headerTextLogo}
          src="/icons/text-logo.svg"
          alt="text-gptiti-logo"
          width={92}
          height={27}
        />
      </div>
      <div className={styles.modelGptitiWrapper}>
        <div className={styles.modelGptitiContainer}>
          <ModelGptitiTitleWithIcon
            modelRef={modelRef}
            selectedModel={selectedModel}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
          <p className={styles.paragraph}>
            {result?.model.tokens} {TOKENS_SUFFIX}
          </p>
        </div>
      </div>
      <p
        className={styles.quickActionsContainer}
        onClick={onOpenQuickActions}
        style={{ opacity: hasFirstRequest ? 1 : 0.5 }}
      >
        <Image
          src="/icons/quick-actions.svg"
          width={21}
          height={21}
          alt="quick-actions-icon"
          className={styles.quickActionsIcon}
        />
        <span className={styles.quickActionsSpan}>Quick actions</span>
      </p>
    </div>
  );
}
