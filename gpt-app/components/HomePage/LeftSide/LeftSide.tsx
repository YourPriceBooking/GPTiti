import CustomScrollbar from '@/components/CustomScrollBar/CustomScrollBar';
import styles from './LeftSide.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { Chat, ModelType, ModelMode } from '@/types/types';
import ModalWindow from './ModalWindow/ModalWindow';
import { modelConfig } from '@/config/models.config';

type Props = {
  onNewChat: () => void;
  chatList: Chat[];
  setActiveChatId: (id: string) => void;

  modelRef: React.RefObject<HTMLDivElement | null>;
  modelMode: ModelMode;
  setModelMode: React.Dispatch<React.SetStateAction<ModelMode>>;

  selectedModel: string;
  setSelectedModel: (model: string) => void;

  selectedModelGroup: ModelType;
  setSelectedModelGroup: (group: ModelType) => void;
};

export default function LeftSide({
  onNewChat,
  chatList,
  setActiveChatId,
  modelRef,
  modelMode,
  setModelMode,
  selectedModel,
  setSelectedModel,
  selectedModelGroup,
  setSelectedModelGroup,
}: Props) {

const getModelGroupAndItem = (selectedModel: string) => {
  for (const [group, config] of Object.entries(modelConfig)) {
    const found = config.list.find(item => item.title === selectedModel);
    if (found) {
      return { group: group as ModelType, model: found };
    }
  }
  return null;
};
const result = getModelGroupAndItem(selectedModel);
const capitalizeFirstThree = (text: string) => {
  return text.slice(0, 3).toUpperCase() + text.slice(3);
};

  return (
    <div className={styles.container}>
      <section className={styles.gptTokens}>
        <article className={styles.gptMini}>
          <div
            ref={modelRef}
            className={styles.modelHoverWrapper}
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              setModelMode(prev => (prev === 'click' ? 'idle' : 'click'));
            }}
          >
            <article className={styles.titleContainer}>
       <h2 className={styles.title}>
  {result ? capitalizeFirstThree(result.model.title) : capitalizeFirstThree(selectedModel)}
</h2>
              <Image
                width={11}
                height={6}
                src="/icons/chevron-small.svg"
                alt="chevron-small"
              />
            </article>
            {modelMode === 'click' && (
              <div
                className={styles.modalWrapper}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                <ModalWindow
                 selectedModelGroup={selectedModelGroup}
                 setSelectedModelGroup={setSelectedModelGroup}
                 selectedModel={selectedModel}
                 setSelectedModel={setSelectedModel}
                />
              </div>
            )}
          </div>

          <p className={styles.paragraph}>
            approximate asking price 20 tokens*
          </p>
        </article>

        <article className={styles.gptBalance}>
          <h2 className={styles.title2}>Balance</h2>
          <div className={styles.balanceContainer}>
            <span className={styles.gptSpan1}>10 000</span>
            <Image width={24} height={24} src="/icons/badge.svg" alt="badge" />
          </div>
        </article>

        <div className={styles.btnContainer}>
          <button className={styles.btn}>
            <div className={styles.iconWrapper}>
              <Image
                width={33}
                height={33}
                src="/icons/circle-icon.svg"
                alt="circle-icon"
              />
            </div>
            <span className={styles.btnSpan1}>Top up tokens</span>
          </button>
        </div>
      </section>

      <div className={styles.chatsScrollArea}>
        <section className={styles.gptChats}>
          <article className={styles.gptNewChat} tabIndex={0}>
            <Image width={36} height={36} src="/icons/new-chat.svg" alt="new-chat" />
            <button className={styles.chatsSpan} onClick={onNewChat}>
              Start New Chat
            </button>
          </article>

          <article className={styles.yourChats}>
            <Image width={38} height={38} src="/icons/chat-bubble.svg" alt="chat-bubble" />
            <div className={styles.labelWrapper}>
              <button className={styles.span}>Your Chats</button>
              <div className={styles.icon}>
                <Image width={15} height={15} src="/icons/chevron-down.svg" alt="chevron-down" />
              </div>
            </div>
          </article>

          <ul className={styles.chatsList}>
            {chatList
              .filter(chat => chat.title !== null)
              .map(chat => (
                <li
                  key={chat.id}
                  className={styles.chatsListItem}
                  tabIndex={0}
                  onClick={() => setActiveChatId(chat.id)}
                >
                  <span>
                    {chat.title && chat.title.length > 24
                      ? chat.title.slice(0, 24) + '...'
                      : chat.title}
                  </span>
                  <span className={styles.dotsIcon}></span>
                </li>
              ))}
          </ul>

          <CustomScrollbar scrollTargetClass={styles.chatsScrollArea} />
        </section>
      </div>

      <section className={styles.gptUser}>
        <article className={styles.userInfo}>
          <Image
            width={27.11}
            height={35.65}
            src="/icons/ghost-user.svg"
            alt="ghost-user"
          />
          <span className={styles.gptUserEmail}>henrinkwinta@gmail.com</span>
        </article>

        <div className={styles.logoutBtnContainer}>
          <button className={styles.logoutBtn}>
            <span className={styles.logoutBtnSpan}>Log out</span>
          </button>
        </div>
      </section>

      <footer className={styles.footer}>
        <ul className={styles.footerList}>
          <li className={styles.footerItem}>
            <Link href="/" className={styles.footerLink}>Home</Link>
          </li>
          <li className={styles.footerItem}>
            <Link href="/our-mission" className={styles.footerLink}>Our Mission</Link>
          </li>
          <li className={styles.footerItem}>
            <Link href="/sign-in" className={styles.footerLink}>Sign in</Link>
          </li>
        </ul>

        <ul className={styles.footerList1}>
          <li className={styles.footerItem}>
            <Link href="/terms-conditions" className={styles.footerLink}>Terms & Conditions</Link>
          </li>
          <li className={styles.footerItem}>
            <Link href="/privacy-policy" className={styles.footerLink}>Privacy Policy</Link>
          </li>
        </ul>

        <section className={styles.footerSection}>
          <span className={styles.footerSpan}>
            * We show an approximate price based on a typical 30-word message.
            Real token usage depends on how much you write — shorter prompts cost less,
            longer ones cost more.
          </span>
          <p className={styles.footerParagraph}>
            © 2025 Your Price Booking. All rights reserved.
          </p>
        </section>
      </footer>
    </div>
  );
}