"use client"
import  { useState } from 'react';
import styles from './page.module.css';
import { motion } from "framer-motion";
import Image from 'next/image';
import { useTokensContext } from '@/context/TokensContext';
import Link from 'next/link';


export default function TokensPage() {
    const {balance, countdown, handleClaim} = useTokensContext();
    const [clicked, setClicked] = useState(false);
  return (
    <motion.div className={styles.container}
     initial={{ opacity: 0, y: 40 }}         
  animate={{ opacity: 1, y: 0 }}           
  exit={{ opacity: 0, y: -20 }}            
  transition={{ duration: 1.2, ease: "easeInOut" }}>
        <header className={styles.topUpHeader}>
            <Link href='/'> 
         <div className={styles.containerGroupLogos}>
        <Image className={styles.rabbitLogo} src='/icons/rabbit.svg' alt='logo-rabbit' width={59} height={75}/>
        <Image className={styles.headerTextLogo} src='/icons/text-logo.svg' alt='text-gptiti-logo' width={183} height={49}/>
        </div>
        </Link>  
        <div className={styles.textInfoContainer}>
        <h1 className={styles.title}>Top up your token balance</h1>
        <h1 className={styles.mobTitle}>Top up tokens</h1>
        <p className={styles.fullparagraph}>No subscriptions. Tokens never expire. Use them anytime.</p>
        <p className={styles.notFullparagraph}>No subscriptions. Tokens never expire</p>
        </div>
        <button className={styles.balanceButton}>
          <p className={styles.balanceInfo}>
  <span className={styles.span2}>
    Balance tokens
  </span>
  <span className={styles.strong}>{balance.toLocaleString("en-US")}</span>
  </p>
            <Image className={styles.balanceIcon} width={30} height={30} src="/icons/circle-icon2.svg" alt="balance-circle" />
            <Image className={styles.mobileBalanceIcon} width={26} height={26} src="/icons/blue-circle2.svg" alt="balance-circle" />
        </button>
        
       
        </header>
        <section className={styles.plansContainer}>
            <article className={styles.plansCard1}>
                <p className={styles.plansParagraph1}>PACKAGE</p>
                <h2 className={styles.tokensTitle}>500,000 tokens</h2>
                <p className={styles.plansParagraph2}>good for X–Y messages on GPT-4o-mini</p>
                <h2 className={styles.priceTitle}>$4</h2>
                <button className={styles.buyButton}>
                    <div className={styles.buyButtonContent}>
                    <span className={styles.buyButtonSpan}>Buy tokens</span>
                    <Image className={styles.buyButtonIcon} width={26} height={26} src="/icons/blue-circle.svg" alt="blue-circle"/>
                    </div>
                </button>
            </article>
            <article className={styles.plansCard2}>
                <div className={styles.recommendedContainer}>
                 <span className={styles.plansSpan2}>RECOMMENDED</span>
                 </div>
                 <p className={styles.plansRecommendedParagraph}>PACKAGE</p>
                <h2 className={styles.tokensTitle}>1,000,000 tokens</h2>
                <p className={`${styles.plansParagraph2} ${styles.addToPlansParagraph2}`}>best for daily usage</p>
                <h2 className={styles.priceTitle}>
                    <span className={styles.priceTitleSpan}>$6</span>
                    <span className={styles.saveSpan1}>Save 25%</span>
                    </h2>
                <button className={styles.buyButton2}>
                    <div className={styles.buyButtonContent}>
                    <span className={styles.buyButtonSpan}>Buy tokens</span>
                    <Image className={styles.buyButtonIcon} width={26} height={26} src="/icons/blue-circle.svg" alt="blue-circle"/>
                    </div>
                </button>
            </article>
            <article className={styles.plansCard3}>
                <div className={styles.bestValueContainer}>
                <span className={styles.plansSpan3}>BEST VALUE</span>
                </div>
                 <p className={styles.plansParagraph1}>PACKAGE</p>
                <h2 className={styles.tokensTitle}>3,000,000 tokens</h2>
                <p className={styles.plansParagraph2}>best for power users</p>
                <h2 className={styles.priceTitle}>
                    <span>$12</span>
                    <span className={styles.saveSpan2}>Save 50%</span>
                    </h2>
                <button className={styles.buyButton3}>
                    <div className={styles.buyButtonContent}>
                    <span className={styles.buyButtonSpan}>Buy tokens</span>
                    <Image className={styles.buyButtonIcon} width={26} height={26} src="/icons/blue-circle.svg" alt="blue-circle"/>
                    </div>
                </button>
            </article>
        </section>
        <hr className={styles.horizontalLine}/>
        <section className={styles.freeTokens}>
            <div className={styles.freeTokensInfo}>
                <div className={styles.groupfreeTokensInfo}>
                    
            <p className={styles.freeTokensParagraph}>
                <Image src='/icons/present.png' alt='present' width={20} height={30}/>
                <span>Free weekly tokens</span>
                </p>
                
                <p className={styles.freeTokensReward}>
                    <span className={styles.freeTokensRewardSpan}>WEEKLY REWARD</span>
                   </p>
                   </div>
            <span className={styles.freeTokensSpan}>Claim 10,000 tokens once per week.</span>
            <span className={styles.freeTokensSpan2}>Make the most of premium models — on your schedule.</span>
            <p className={styles.presentParagraph}>
                <span className={styles.freeTokensSpan3}> NEXT CLAIM IN: 
                <span className={styles.freeTokensSpan4}>
                {countdown}
                </span> 
                </span>
                </p>
            </div>
            <article className={styles.weeklyClaim}>
                <div className={styles.claimTextContainer}>
                <h5 className={styles.claimTitle}>WEEKLY CLAIM</h5>
                      <button
                          className={`${styles.claimButton} ${clicked ? styles.clicked : ''}`}
                          onClick={
                            () => {
                                setClicked(true)
                                handleClaim()}
                        }
                        disabled = {clicked}
                      >
                    <div className={styles.buyButtonContent}>
                    { clicked ? (
                        <>
                         <span className={styles.buyButtonSpan}>Claimed ✓</span>
                         <Image className={styles.claimButtonIcon} width={26} height={26} src="/icons/white-circle.svg" alt="claimed-tokens"/>
                        </>
                    ): (
                        <>
                       <span className={styles.buyButtonSpan}>Claim 10K Tokens</span>
                       <Image className={styles.claimButtonIcon} width={26} height={26} src="/icons/blue-circle.svg" alt="claim-tokens"/>
                       </>
                    )}
                    </div>
                  </button>
                <p className={styles.claimParagraph}> Next claim in: {countdown}</p>
                </div>
                </article>
        </section>
        <footer className={styles.footer}>
            <span className={styles.footerSpan}>
                * We show an approximate request cost based on a 
                typical 30-word message. Actual token usage depends on how much you write. 
                </span>
                <span className={styles.adaptiveFooterSpan}>* Approximate request price 
                    is based on a typical 30-word message. 
                </span>
            <span className={styles.footerSpan}>* Different models may 
                consume tokens at different rates. 
                Your balance is shared across all models. 
                </span>
                <span className={styles.adaptiveFooterSpan}>
                    * Different models consume tokens at different rates. 
                    </span>
                    <nav className={styles.nav}>
      <Link href="/" className={`${styles.link} ${styles.linkHome}`}>Home</Link>
  <Link href="/our-mission" className={`${styles.link} ${styles.linkMission}`}>Our Mission</Link>
    <Link href="/sign-in" className={`${styles.link} ${styles.linkSignIn}`}>Sign in</Link>
  <Link href="/terms-conditions" className={`${styles.link} ${styles.linkTerms}`}>Terms & Conditions</Link>
  <Link href="/privacy-policy" className={`${styles.link} ${styles.linkPrivacy}`}>Privacy Policy</Link>

    </nav>
    <span className={styles.gptitiRights}>© {new Date().getFullYear()} Your Price Booking OÜ. All rights reserved. 
        GPTiti™ is a trademark of Your Price Booking OÜ.</span>
        </footer>
    </motion.div>
  )
}
