import React from 'react';
import styles from './PaymentTokens.module.css';
import Image from 'next/image';

export default function page() {
  return (
    <div className={styles.paymentContainer}>
        <header className={styles.headerPayment}>
            <div className={styles.groupHeaderPaymentContent}>
            <h2 className={styles.headerPaymentTitle}>Complete your top-up</h2>
            <span className={styles.headerPaymentSpan1}>No subscriptions. Tokens never expire.</span>
            </div>
            <span className={styles.headerPaymentSpan2}>ORDER SUMMARY</span>
            <Image src='icons/close.svg' width={32} height={32} alt='close-icon'/>
           </header>
           <form className={styles.formPayment}>
            <fieldset className={styles.paymentOptions}> 
                <legend className={styles.paymentOptionsLegend}>PAYMENT</legend> 
                <div className={styles.expressInfo}> 
                    <span className={styles.expressInfoSpan}>Apple Pay / Google Pay</span> 
                    <button className={styles.expressInfoButton}>
                      <span className={styles.expressInfoButtonSpan}>Express</span>
                      </button> 
                    </div>
                    </fieldset> 
                    <fieldset className={styles.cardInformation}>
                      <legend className={styles.orText}>or pay with card</legend> 
                      <div className={styles.cardInformationContainer}>
                        <span className={styles.cardInformationSpan}>Card information</span>
                        <p className={styles.cardNumbersParagraph}>
                          <span className={styles.cardNumbersSpan}>4242 4242 4242 4242</span>
                        <Image src='/icons/three-circles.svg' width={86} height={18} alt='card-circles'/>
                        </p>
                        <div className={styles.cardInfoContainer}>
                        <p className={styles.cardInfoParagraph}>
                          <span className={styles.cardInfoSpan}>12 / 34</span>
                        </p>
                         <p className={styles.cardInfoParagraph}>
                          <span className={styles.cardInfoSpan}>CVC</span>
                        </p>
                        </div>
                        </div>
                    </fieldset>
                    <p className={styles.saveCardContainer}>
                       <Image src='/icons/check.svg' width={17} height={17} alt='check'/>
                      <span className={styles.saveCardSpan}>Save card for faster top-ups</span>
                     </p>
                     <div className={styles.paymentButtonContatiner}>
                      <button className={styles.paymentButton}>
                        <span className={styles.paymentButtonSpan}>Pay $6 → Get 1,000,000 tokens</span>
                        <Image src='/icons/payment-icon.svg' width={30} height={30} alt='payment-icon'/>
                      </button>
                     </div>
                     <p className={styles.secureParagraph}>
                      <Image src='/icons/secure.svg' width={16} height={20} alt='secure-icon'/>
                      <span className={styles.secureParagraphSpan}>Secure payment via Stripe • We never store your card details</span>
                     </p>
                     <span className={styles.downFormSpan}>By paying you agree to Terms & Conditions  and Privacy Policy• Powered by Stripe</span>
                    </form>
           <div className={styles.headerPaymentDivider}></div>
           <section className={styles.cardPlanSection}>
            <div className={styles.cardPlanSectionParagraphesContainer}>
            <p className={styles.cardPlanSectionParagraph1}>
              <span className={styles.cardPlanSectionSpan}>RECOMMENDED</span>
              </p>
            <p className={styles.cardPlanSectionParagraph2}>
              <span className={styles.cardPlanSectionSpan}>SAVE 25%</span>
              </p>
              </div>
              <div className={styles.cardPlanTokensContainer}>
                <Image src='/icons/payment-icon2.svg' width={36} height={36} alt='payment-icon'/>
                <div className={styles.tokensTextContainer}>
                <span className={styles.tokensTextSpan1}>1,000,000 tokens</span>
                <span className={styles.tokensTextSpan2}>Best for daily usage</span>
                </div>
              </div>
              <div className={styles.cardPlanPriceContainer}>
                <h2 className={styles.cardPlanPriceTitle}>$6</h2>
                <div className={styles.cardPlanPriceTextContainer}>
                <span className={styles.cardPlanPriceSpan}>One-time purchase</span>
                <span className={styles.cardPlanPriceSpan}>Shared across all models</span>
                </div>
              </div>
              <p className={styles.cardPlanParagraphContainer}>
                <span className={styles.cardPlanSpan}>Premium models may spend more tokens per request.</span>
                </p>
           </section>
           <section className={styles.cardPlanBenefits}>
            <p className={styles.cardPlanBenefitsParagraph}>WHAT YOU GET</p>
            <ul className={styles.cardPlanBenefitsList}>
              <li className={styles.cardPlanBenefitsItem}>
                <Image src='/icons/check2.svg' width={20} height={20} alt='check-icon'/>
                <span className={styles.cardPlanBenefitsSpan}>Access to GPT-5.1 / GPT-4o / O-series</span>
              </li>
              <li className={styles.cardPlanBenefitsItem}>
               <Image src='/icons/check2.svg' width={20} height={20} alt='check-icon'/>
                <span className={styles.cardPlanBenefitsSpan}>Transparent usage & token cost tracking</span>
              </li>
              <li className={styles.cardPlanBenefitsItem}>
                <Image src='/icons/check2.svg' width={20} height={20} alt='check-icon'/>
                <span className={styles.cardPlanBenefitsSpan}>Tokens never expire — use anytime</span>
              </li>
            </ul>
           </section>
    </div>
  )
}
