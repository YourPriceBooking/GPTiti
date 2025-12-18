import styles from './LeftSide.module.css';
import FooterLeftSide from './FooterLeftSide/FooterLeftSide';
import { LeftSideProps } from '@/types/types';
import SectionGptUser from './SectionGptUser/SectionGptUser';
import SectionGptChats from './SectionGptChats/SectionGptChats';
import SectionGptTokens from './SectionGptTokens/SectionGptTokens';


export default function LeftSide({onNewChat,
  chatList,
  setActiveChatId,
  deleteChat,
  renameChat,
  modelRef,
  modelMode,
  setModelMode,
  selectedModel,
  setSelectedModel,
  selectedModelGroup,
  setSelectedModelGroup,
 }: LeftSideProps) {

return (
  <div className={styles.chatsScrollArea}>
    <div className={styles.container}>
    <SectionGptTokens
      modelRef={modelRef}
      modelMode={modelMode}
      setModelMode={setModelMode}
      selectedModel={selectedModel}
      setSelectedModel={setSelectedModel}
      selectedModelGroup={selectedModelGroup}
      setSelectedModelGroup={setSelectedModelGroup}
      />
    <SectionGptChats 
      onNewChat={onNewChat} 
      chatList={chatList} 
      setActiveChatId={setActiveChatId}
      deleteChat={deleteChat}       
      renameChat={renameChat}
      />
    <SectionGptUser/>
    <FooterLeftSide/>
</div>
</div>
  );
}