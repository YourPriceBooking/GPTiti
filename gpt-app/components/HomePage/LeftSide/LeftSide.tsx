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
              <svg width="11" height="6" viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.75 0.75L5.25 5.25L9.75 0.75" stroke="#FCFDFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </article>
            <p className={styles.paragraph}>approximate asking price 20 tokens*</p>
          </article>
          <article className={styles.gptBalance}>
            <h2 className={styles.title2}>Balance</h2>
            <div className={styles.balanceContainer}>
              <span className={styles.gptSpan1}>10 000</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="url(#paint0_linear_3336_102)" />
                <path d="M12 6C9.8 6 8 7.8 8 10C8 11.7 9 13.1 10.5 13.7L11 18H13L13.5 13.7C14 13.1 15 11.7 15 10C15 7.8 13.2 6 11 6H12Z" fill="white" />
                <defs>
                  <linearGradient id="paint0_linear_3336_102" x1="2" y1="2" x2="2" y2="482" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4E8CFF" />
                    <stop offset="1" stopColor="#1E60E8" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </article>
          <article className={styles.btnContainer}>
            <button className={styles.btn}>
              <div className={styles.iconWrapper}>
                <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16.25" cy="16.25" r="16.25" fill="#FCFDFF" />
                </svg>

                <svg className={styles.innerIcon} width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.5 0C2.925 0 0 2.925 0 6.5C0 9.2625 1.625 11.5375 4.0625 12.5125L4.875 19.5H8.125L8.9375 12.5125C9.75 11.5375 11.375 9.2625 11.375 6.5C11.375 2.925 8.45 0 4.875 0H6.5Z" fill="#4E8CFF" />
                </svg>
              </div>
              <span className={styles.btnSpan1}>Top up tokens</span>
            </button>
          </article>
        </section>
         <section className={styles.gptChats}>
          <article className={styles.gptNewChat}>
           <Image width={36} height={36} src='/icons/newChat.svg' alt='new chat'></Image>
            <span className={styles.chatsSpan}>Start New Chat</span>
            </article>
          <article className={styles.yourChats}>
           <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 12H26.8333M11 18.3333H20.5" stroke="#FCFDFF" strokeWidth="1.83333" strokeLinecap="round" />
              <path d="M6.3335 7.91665C6.3335 7.0422 7.04239 6.33331 7.91683 6.33331H30.0835C30.958 6.33331 31.6668 7.0422 31.6668 7.91665V22.1666C31.6668 23.0411 30.958 23.75 30.0835 23.75H12.6668L7.91683 28.5V23.75C7.04239 23.75 6.3335 23.0411 6.3335 22.1666V7.91665Z" stroke="#FCFDFF" strokeWidth="1.83333" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className={styles.labelWrapper}>
              <span className={styles.span}>Your Chats</span>
              <svg className={styles.icon} width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.75 5.625L7.5 9.375L11.25 5.625" stroke="#FCFDFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
                 </div>
                 <CustomScrollbar scrollTargetClass={styles.chatsScrollArea} />
          </article>
          <ul className={styles.chatsList}>
            {Array.from({ length: 8 }).map((_, i) => (
              <li key={i} className={styles.chatsListItem}>
                <span>My chat number {i + 1} and more ...</span>
                <span className={styles.dotsIcon}></span>
              </li>
            ))}
          </ul>
       </section>
        <section className={styles.gptUser}>
          <article className={styles.userInfo}>
              <svg
      width="27.11"
      height="35.65"
      viewBox="0 0 27.11 35.65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-2px); }
          }
          .ghost { animation: float 2.2s ease-in-out infinite; }
        `}
      </style>

      <g className="ghost">
        <path
          d="M13.55 0C6.07 0 0 6.07 0 13.55v11.2c0 3.2 2.6 5.8 5.8 5.8 2 0 3.8-.98 4.9-2.47 1.1 1.49 2.9 2.47 4.9 2.47s3.8-.98 4.9-2.47c1.1 1.49 2.9 2.47 4.9 2.47 3.2 0 5.8-2.6 5.8-5.8v-11.2C27.11 6.07 21.04 0 13.55 0z"
          fill="#AEE1FF"
        />

        <circle cx="9.5" cy="13" r="2.3" fill="#000" />
        <circle cx="17.5" cy="13" r="2.3" fill="#000" />

        <circle cx="10.1" cy="12.4" r="0.6" fill="white" />
        <circle cx="18.1" cy="12.4" r="0.6" fill="white" />

        <path
          className="smile"
          d="M9 19c1.2 1.4 3 2.1 4.6 2.1s3.4-.7 4.6-2.1"
          stroke="#000"
          strokeWidth={2}
          strokeLinecap="round"
        >
          <animate
            attributeName="d"
            dur="1.8s"
            repeatCount="indefinite"
            values="
              M9 19c1.2 1.4 3 2.1 4.6 2.1s3.4-.7 4.6-2.1;
              M9 19c1.4 2 3.2 2.8 4.6 2.8s3.2-.8 4.6-2.8;
              M9 19c1.2 1.4 3 2.1 4.6 2.1s3.4-.7 4.6-2.1
            "
          />
        </path>
      </g>
    </svg>
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