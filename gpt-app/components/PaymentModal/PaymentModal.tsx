"use client";

import { useEffect, useState } from "react";
import IMask from "imask";
import { IMaskInput } from "react-imask";
import Image from "next/image";
import styles from "./PaymentModal.module.css";
import type { Plan } from "@/types/types";
import { motion } from "framer-motion";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
};

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modal = {
  hidden: { opacity: 0, y: 24, scale: 0.985 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 18, scale: 0.985 },
};

export default function PaymentModal({ isOpen, onClose, plan }: Props) {
  const [cardNumber, setCardNumber] = useState<string>("");

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  const tokensText = plan?.tokens ? plan.tokens.toLocaleString("en-US") : "";
  const priceText = plan?.price ?? "";
  const subtitle = plan?.subtitle ?? "";

  const handleBackdropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Pay for plan:", plan, "cardNumber:", cardNumber);
  };

  return (
    <motion.div
      className={styles.backdrop}
      onMouseDown={handleBackdropMouseDown}
      variants={backdrop}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <motion.div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        variants={modal}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.25, ease: "easeOut" }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={styles.paymentContainer}>
          <header className={styles.headerPayment}>
            <div className={styles.groupHeaderPaymentContent}>
              <h2 className={styles.headerPaymentTitle}>
                Complete your top-up
              </h2>
              <span className={styles.headerPaymentSpan1}>
                No subscriptions. Tokens never expire.
              </span>
            </div>

            <span className={styles.headerPaymentSpan2}>ORDER SUMMARY</span>

            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close"
            >
              <Image
                className={styles.headerCloseIcon}
                src="/icons/close.svg"
                width={32}
                height={32}
                alt="close-icon"
              />
            </button>
          </header>

          <form className={styles.formPayment} onSubmit={handleSubmit}>
            <fieldset className={styles.paymentOptions}>
              <legend className={styles.paymentOptionsLegend}>PAYMENT</legend>

              <div className={styles.expressInfo}>
                <span className={styles.expressInfoSpan}>
                  Apple Pay / Google Pay
                </span>
                <button type="button" className={styles.expressInfoButton}>
                  <span className={styles.expressInfoButtonSpan}>Express</span>
                </button>
              </div>
            </fieldset>

            <fieldset className={styles.cardInformation}>
              <legend className={styles.orText}>or pay with card</legend>

              <div className={styles.cardInformationContainer}>
                <span className={styles.cardInformationSpan}>
                  Card information
                </span>

                <div className={styles.cardNumbersParagraph}>
                  <IMaskInput
                    mask="0000 0000 0000 0000"
                    placeholder="4242 4242 4242 4242"
                    inputMode="numeric"
                    className={styles.cardNumbersInput}
                    unmask={true}
                    value={cardNumber}
                    onAccept={(value) => setCardNumber(String(value))}
                  />
                  <Image
                    src="/icons/three-circles.svg"
                    width={86}
                    height={18}
                    alt="card-circles"
                  />
                </div>

                <div className={styles.cardInfoContainer}>
                  <div className={styles.cardInfoParagraph1}>
                    <IMaskInput
                      mask="MM / YY"
                      blocks={{
                        MM: {
                          mask: IMask.MaskedRange,
                          from: 1,
                          to: 12,
                          maxLength: 2,
                        },
                        YY: {
                          mask: IMask.MaskedRange,
                          from: 0,
                          to: 99,
                          maxLength: 2,
                        },
                      }}
                      placeholder="MM / YY"
                      inputMode="numeric"
                      className={styles.cardInfoInput1}
                    />
                  </div>

                  <div className={styles.cardInfoParagraph2}>
                    <input
                      className={styles.cardInfoInput2}
                      placeholder="CVC"
                      type="password"
                      maxLength={3}
                      inputMode="numeric"
                    />
                  </div>
                </div>
              </div>
            </fieldset>

            <div className={styles.paymentButtonContatiner}>
              <button type="submit" className={styles.paymentButton}>
                <span className={styles.paymentButtonSpan}>
                  Pay ${priceText} → Get {tokensText} tokens
                </span>
                <Image
                  src="/icons/payment-icon.svg"
                  width={30}
                  height={30}
                  alt="payment-icon"
                />
              </button>
            </div>

            <p className={styles.secureParagraph}>
              <Image
                src="/icons/secure.svg"
                width={16}
                height={20}
                alt="secure-icon"
              />
              <span className={styles.secureParagraphSpan}>
                Secure payment via Stripe • We never store your card details
              </span>
            </p>

            <span className={styles.downFormSpan}>
              By paying you agree to Terms &amp; Conditions and Privacy Policy •
              Powered by Stripe
            </span>
          </form>

          <div className={styles.headerPaymentDivider} />

          <span className={styles.mobileHeaderPaymentSpan2}>ORDER SUMMARY</span>

          <section className={styles.cardPlanSection}>
            <div className={styles.cardPlanSectionParagraphesContainer}>
              {plan?.badge ? (
                <p className={styles.cardPlanSectionParagraph1}>
                  <span className={styles.cardPlanSectionSpan}>
                    {plan.badge}
                  </span>
                </p>
              ) : null}

              {plan?.saveText ? (
                <p className={styles.cardPlanSectionParagraph2}>
                  <span className={styles.cardPlanSectionSpan}>
                    {plan.saveText}
                  </span>
                </p>
              ) : null}
            </div>

            <div className={styles.cardPlanTokensContainer}>
              <Image
                src="/icons/payment-icon2.svg"
                width={36}
                height={36}
                alt="payment-icon"
              />
              <div className={styles.tokensTextContainer}>
                <span className={styles.tokensTextSpan1}>
                  {tokensText} tokens
                </span>
                <span className={styles.tokensTextSpan2}>{subtitle}</span>
              </div>
            </div>

            <div className={styles.cardPlanPriceContainer}>
              <h2 className={styles.cardPlanPriceTitle}>${priceText}</h2>
              <div className={styles.cardPlanPriceTextContainer}>
                <span className={styles.cardPlanPriceSpan}>
                  One-time purchase
                </span>
                <span className={styles.cardPlanPriceSpan}>
                  Shared across all models
                </span>
              </div>
            </div>

            <p className={styles.cardPlanParagraphContainer}>
              <span className={styles.cardPlanSpan}>
                Premium models may spend more tokens per request.
              </span>
            </p>
          </section>

          <section className={styles.cardPlanBenefits}>
            <p className={styles.cardPlanBenefitsParagraph}>WHAT YOU GET</p>
            <ul className={styles.cardPlanBenefitsList}>
              <li className={styles.cardPlanBenefitsItem}>
                <Image
                  src="/icons/check2.svg"
                  width={20}
                  height={20}
                  alt="check"
                />
                <span className={styles.cardPlanBenefitsSpan}>
                  Access to GPT-5.1 / GPT-4o / O-series
                </span>
              </li>
              <li className={styles.cardPlanBenefitsItem}>
                <Image
                  src="/icons/check2.svg"
                  width={20}
                  height={20}
                  alt="check"
                />
                <span className={styles.cardPlanBenefitsSpan}>
                  Transparent usage &amp; token cost tracking
                </span>
              </li>
              <li className={styles.cardPlanBenefitsItem}>
                <Image
                  src="/icons/check2.svg"
                  width={20}
                  height={20}
                  alt="check"
                />
                <span className={styles.cardPlanBenefitsSpan}>
                  Tokens never expire — use anytime
                </span>
              </li>
            </ul>
          </section>
        </div>
      </motion.div>
    </motion.div>
  );
}
