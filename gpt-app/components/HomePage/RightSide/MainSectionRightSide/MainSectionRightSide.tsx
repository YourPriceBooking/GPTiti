import styles from "./MainSectionRightSide.module.css";
import Image from "next/image";
import { MainSectionRightSideProps } from "@/types/types";
import InputBar from "@/components/HomePage/RightSide/InputBar/InputBar";

export default function MainSectionRightSide(props: MainSectionRightSideProps) {
  const {
    insertTemplate,
    setFocusMode,
    isSectionVisible,
    focusMode,
    hasInput,
    onChange,
    onSend,
    inputRef,
    onHideSection,
    templateTick,
    setHasFirstRequest,
    hasFirstRequest,
    isOverlay = false,
    selectedModel,
  } = props;

  if (!isSectionVisible) return null;

  return (
    <div
      className={`${styles.mainSectionContainer} ${
        focusMode ? styles.noneContainer : ""
      }`}
    >
      {!focusMode ? (
        <section className={styles.additionalSectionContainer}>
          {!isOverlay ? (
            <p
              className={styles.additionalSectionParagraphContainer}
              onClick={() => {
                setFocusMode(true);
              }}
            >
              <Image
                src="icons/green-circle.svg"
                width={12}
                height={12}
                alt="ready"
              />
              <span className={styles.additionalSectionSpan1}>Ready</span>
            </p>
          ) : (
            <button className={styles.closeButton}>
              <Image
                src="/icons/close2.svg"
                width={24}
                height={24}
                alt="close"
                onClick={onHideSection}
                style={{ cursor: "pointer" }}
              />
            </button>
          )}

          <h1 className={styles.additionalSectionTitle}>
            What do you want to do today?
          </h1>

          <span className={styles.additionalSectionSpan2}>
            Pick a quick action or type your request below.
          </span>

          <section className={styles.infoContainer}>
            <article
              className={styles.infoContainerCard}
              onClick={() =>
                insertTemplate(
                  "Summarize the following text into clear bullet points:"
                )
              }
            >
              <div className={styles.CardIconContainer}>
                <Image
                  src="icons/summarize.svg"
                  width={24}
                  height={24}
                  alt="summar"
                />
              </div>
              <div className={styles.CardTextInfoContainer}>
                <p className={styles.CardParapgraph}>Summarize</p>
                <span className={styles.CardSpan}>
                  Paste text → get a clean summary.
                </span>
              </div>
            </article>

            <article
              className={styles.infoContainerCard}
              onClick={() =>
                insertTemplate(
                  "Rewrite this to sound clearer and more professional (keep the meaning):"
                )
              }
            >
              <div className={styles.CardIconContainer}>
                <Image
                  src="icons/write.svg"
                  width={24}
                  height={24}
                  alt="write"
                />
              </div>
              <div className={styles.CardTextInfoContainer}>
                <p className={styles.CardParapgraph}>Write / Improve</p>
                <span className={styles.CardSpan}>
                  Rewrite, fix tone, make it clearer.
                </span>
              </div>
            </article>

            <article
              className={styles.infoContainerCard}
              onClick={() =>
                insertTemplate(
                  "Translate this to English. Keep the tone and formatting:"
                )
              }
            >
              <div className={styles.CardIconContainer}>
                <Image
                  src="icons/translate.svg"
                  width={24}
                  height={24}
                  alt="translate"
                />
              </div>
              <div className={styles.CardTextInfoContainer}>
                <p className={styles.CardParapgraph}>Translate</p>
                <span className={styles.CardSpan}>
                  Any language, preserving meaning.
                </span>
              </div>
            </article>

            <article
              className={styles.infoContainerCard}
              onClick={() =>
                insertTemplate(
                  "Create a step-by-step plan for this goal. Include time estimates and a checklist:"
                )
              }
            >
              <div className={styles.CardIconContainer}>
                <Image src="icons/plan.svg" width={24} height={24} alt="plan" />
              </div>
              <div className={styles.CardTextInfoContainer}>
                <p className={styles.CardParapgraph}>Plan</p>
                <span className={styles.CardSpan}>
                  Steps, checklist, timeline.
                </span>
              </div>
            </article>

            <article
              className={styles.infoContainerCard}
              onClick={() =>
                insertTemplate(
                  "Help me debug this. Explain the cause and suggest a fix:"
                )
              }
            >
              <div className={styles.CardIconContainer}>
                <Image
                  src="icons/code-helper.svg"
                  width={24}
                  height={24}
                  alt="code-helper"
                />
              </div>
              <div className={styles.CardTextInfoContainer}>
                <p className={styles.CardParapgraph}>Code helper</p>
                <span className={styles.CardSpan}>
                  Explain, debug, generate code.
                </span>
              </div>
            </article>

            <article
              className={styles.infoContainerCard}
              onClick={() => insertTemplate("Give me 15 creative ideas for:")}
            >
              <div className={styles.CardIconContainer}>
                <Image
                  src="icons/brain-storm.svg"
                  width={24}
                  height={24}
                  alt="brain-storm"
                />
              </div>
              <div className={styles.CardTextInfoContainer}>
                <p className={styles.CardParapgraph}>Brainstorm</p>
                <span className={styles.CardSpan}>Ideas, names, concepts.</span>
              </div>
            </article>
          </section>

          <section className={styles.trySectionContainer}>
            <span className={styles.trySectionSpan}>Try one of these:</span>
            <div className={styles.trySectionParagraphsContainer}>
              <p
                className={styles.trySectionParagraph}
                onClick={() => insertTemplate("Summarize this article…")}
              >
                Summarize this article…
              </p>
              <p
                className={styles.trySectionParagraph}
                onClick={() => insertTemplate("Make this more professional…")}
              >
                Make this more professional…
              </p>
              <p
                className={styles.trySectionParagraph}
                onClick={() => insertTemplate("Create a study plan for…")}
              >
                Create a study plan for…
              </p>
              <p
                className={styles.trySectionParagraph}
                onClick={() => insertTemplate("Explain this error…")}
              >
                Explain this error…
              </p>
            </div>
          </section>
        </section>
      ) : (
        // <section className={styles.hiddenSectionContainer}>
        //   <div className={styles.hiddenInfoContainer}>
        //     <p className={styles.InfoContainer}>
        //       <Image
        //         src="/icons/green-circle.svg"
        //         width={10}
        //         height={10}
        //         alt="focus"
        //       />
        //       <span className={styles.hiddenSpan}>Focus mode</span>
        //     </p>

        //     <Image
        //       className={styles.hiddenImg}
        //       src="icons/focus-toggle.svg"
        //       width={56}
        //       height={28}
        //       alt="focus-toggle"
        //       onClick={() => setFocusMode(false)}
        //       style={{ cursor: "pointer" }}
        //     />
        //   </div>

        //   <section className={styles.hiddenCenterSection}>
        //     <h2 className={styles.hiddenCenterTitle}>Ask anything</h2>
        //     <p className={styles.hiddenCenterParagraph}>
        //       Focus mode hides suggestions — just type and go.
        //     </p>

        //     <span className={styles.hiddenCenterSpan1}>
        //       Tip: press Enter to send • Shift+Enter for a new line
        //     </span>
        //     <span className={styles.hiddenCenterSpan2}>
        //       AI systems may make mistakes, we recommend verifying important
        //       information.
        //     </span>
        //   </section>
        // </section>
        <>
          <div className={styles.noneContainer}></div>
          <div className={styles.focusInputWrap}>
            <InputBar
              hasInput={hasInput}
              onChange={onChange}
              onSend={onSend}
              inputRef={inputRef}
              onHideSection={onHideSection}
              templateTick={templateTick}
              setHasFirstRequest={setHasFirstRequest}
              hasFirstRequest={hasFirstRequest}
              selectedModel={selectedModel}
            />
            <div className={styles.spanContainer}>
              <span className={styles.inputSpan}>
                AI systems may make mistakes, so we recommend verifying
                important information.
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
