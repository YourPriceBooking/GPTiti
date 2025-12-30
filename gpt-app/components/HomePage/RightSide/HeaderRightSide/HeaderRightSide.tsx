import styles from "./HeaderRightSide.module.css";
import Image from "next/image";
import ModelGptitiTitleWithIcon from "@/components/ModelGptitiTitleWithIcon/ModelGptitiTitleWithIcon";
import { HeaderRightSideProps } from "@/types/types";
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

}) 

{ return ( 
<div className={styles.container}> 
  <div className={styles.containerGroupLogos}> 
    <Image className={styles.rabbitLogo} src="/icons/rabbit.svg" alt="logo-rabbit" width={47} height={47} /> 
    <Image className={styles.headerTextLogo} src="/icons/text-logo.svg" alt="text-gptiti-logo" width={92} height={27} /> 
    </div> 
    <ModelGptitiTitleWithIcon 
    modelRef={modelRef} 
    selectedModel={selectedModel} 
    isModalOpen={isModalOpen} 
    setIsModalOpen={setIsModalOpen} /> 
    <p className={styles.quickActionsContainer}
           onClick={onOpenQuickActions}
            style={{ opacity: hasFirstRequest ? 1 : 0.5 }}> 
            <Image src="/icons/quick-actions.svg" width={21} height={21} alt="quick-actions-icon" /> 
            <span className={styles.quickActionsSpan}>Quick actions</span> 
            </p> 
            </div> ); }

