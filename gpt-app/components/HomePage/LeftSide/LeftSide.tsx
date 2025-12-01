import CustomScrollbar from '@/components/CustomScrollBar/CustomScrollBar';
import styles from './LeftSide.module.css';
import Link from 'next/link';
import Image from 'next/image';

export default function LeftSide() {
  return (
    <>
      <div className={styles.container}>
        <section className={styles.gptTokens}>
          <article className={styles.gptMini}>
            <article className={styles.titleContainer}>
              <h2 className={styles.title}>GPT-4o-mini</h2>
              <Image width={11} height={6} src='/icons/chevron-small.svg' alt='chevron-small'></Image>
            </article>
            <p className={styles.paragraph}>approximate asking price 20 tokens*</p>
          </article>
          <article className={styles.gptBalance}>
            <h2 className={styles.title2}>Balance</h2>
            <div className={styles.balanceContainer}>
              <span className={styles.gptSpan1}>10 000</span>
             <Image width={24} height={24} src='/icons/badge.svg' alt='badge'></Image>
            </div>
          </article>
          <article className={styles.btnContainer}>
            <button className={styles.btn}>
              <div className={styles.iconWrapper}>
                <Image width={33} height={33} src='/icons/circle-icon.svg' alt='circle-icon'></Image>
              </div>
              <span className={styles.btnSpan1}>Top up tokens</span>
            </button>
          </article>
        </section>
         <section className={styles.gptChats}>
          <article className={styles.gptNewChat} tabIndex={0}>
           <Image width={36} height={36} src='/icons/new-chat.svg' alt='new-chat'></Image>
            <span className={styles.chatsSpan}>Start New Chat</span>
            </article>
          <article className={styles.yourChats}>
           <Image width={38} height={38} src='/icons/chat-bubble.svg' alt='chat-bubble'></Image>
            <div className={styles.labelWrapper}>
              <span className={styles.span}>Your Chats</span>
            <div className={styles.icon}>
                  <Image width={15} height={15} src='/icons/chevron-down.svg' alt='chevron-down'></Image>
                  </div>
                 </div>
                 <CustomScrollbar scrollTargetClass={styles.chatsScrollArea} />
          </article>
          <ul className={styles.chatsList}>
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className={styles.chatsListItem} tabIndex={0}>
                <span>My chat number {i + 1} and more ...</span>
                <span className={styles.dotsIcon}></span>
              </li>
            ))}
          </ul>
       </section>
        <section className={styles.gptUser}>
          <article className={styles.userInfo}>
              <Image width={27.11} height={35.65} src='/icons/ghost-user.svg' alt='ghost-user'></Image>
            <span className={styles.gptUserEmail}>henrinkwinta@gmail.com</span>
          </article>
          <button className={styles.logoutBtn}>
            <span className={styles.logoutBtnSpan}> Log out </span>
            </button>
        </section>
        <footer>
          <ul className={styles.footerList}>
            <li className={styles.footerItem}><Link href='/' className={styles.footerLink}>Home</Link></li>
            <li className={styles.footerItem}><Link href='/our-mission' className={styles.footerLink}>Our Mission</Link></li>
            <li className={styles.footerItem}><Link href='/sign-in' className={styles.footerLink}>Sign in</Link></li>
            </ul>
            <ul className={styles.footerList1}>
            <li className={styles.footerItem}><Link href='/terms-conditions' className={styles.footerLink}>Terms & Conditions</Link></li>
            <li className={styles.footerItem}> <Link href='/privacy-policy' className={styles.footerLink}>Privacy Policy</Link></li>
           </ul>
           <section className={styles.footerSection}>
             <span className={styles.footerSpan}>* We show an approximate 
            price based on a typical 30-word message. 
            Real token usage depends on how much you write — shorter prompts cost less, 
            longer ones cost more.</span>
           <p className={styles.footerParagraph}>© 2025 Your Price Booking. All rights reserved.</p>
           </section>
          </footer>
      </div>
    </>
  )
}