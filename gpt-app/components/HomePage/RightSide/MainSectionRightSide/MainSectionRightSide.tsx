import styles from "./MainSectionRightSide.module.css";
import Image from "next/image";
import { MainSectionRightSideProps } from "@/types/types";
import InputComposer from "@/components/HomePage/RightSide/InputComposer/InputComposer";
import { getModelFlow } from "@/config/modelFlows.config";

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
    onImagesChange,
    showEstimate,
    onChooseModel,
    estimateSupported = false,
    estimatedTokens,
    sendDisabled,
  } = props;

  const flow = getModelFlow(selectedModel);

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
              <span className={styles.additionalSectionSpan1}>
                Hide quick tasks
              </span>
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

          <h1 className={styles.additionalSectionTitle}>{flow.header}</h1>

          <span className={styles.additionalSectionSpan2}>{flow.subtitle}</span>

          <section className={styles.infoContainer}>
            {flow.buttons.map((button) => (
              <article
                key={button.label}
                className={styles.infoContainerCard}
                onClick={() => insertTemplate(button.template)}
              >
                <div className={styles.CardIconContainer}>
                  <svg
                    className={styles.cardIcon}
                    width={24}
                    height={24}
                    role="img"
                    aria-label={button.label}
                  >
                    <use href={`/icons/flow-sprite.svg#${button.icon}`} />
                  </svg>
                </div>
                <div className={styles.CardTextInfoContainer}>
                  <p className={styles.CardParapgraph}>{button.label}</p>
                  <span className={styles.CardSpan}>{button.desc}</span>
                </div>
              </article>
            ))}
          </section>

          <section className={styles.trySectionContainer}>
            <span className={styles.trySectionSpan}>Try one of these:</span>
            <div className={styles.trySectionParagraphsContainer}>
              {flow.examples.map((example) => (
                <p
                  key={example}
                  className={styles.trySectionParagraph}
                  onClick={() => insertTemplate(example)}
                >
                  {example}
                </p>
              ))}
            </div>
          </section>
        </section>
      ) : (
        <>
          <div className={styles.focusInputWrap}>
            <div className={styles.focusHeader}>
              <h2 className={styles.focusTitle}>{flow.header}</h2>
              <p className={styles.focusSubtitle}>{flow.subtitle}</p>
            </div>
            <InputComposer
              showDisclaimer
              hasInput={hasInput}
              onChange={onChange}
              onSend={onSend}
              inputRef={inputRef}
              onHideSection={onHideSection}
              templateTick={templateTick}
              setHasFirstRequest={setHasFirstRequest}
              hasFirstRequest={hasFirstRequest}
              selectedModel={selectedModel}
              onImagesChange={onImagesChange}
              showEstimate={showEstimate}
              estimateSupported={estimateSupported}
              estimatedTokens={estimatedTokens}
              onChooseModel={onChooseModel}
              sendDisabled={sendDisabled}
            />
          </div>
        </>
      )}
    </div>
  );
}
