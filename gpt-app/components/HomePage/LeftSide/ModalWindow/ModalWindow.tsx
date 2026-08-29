"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { modelConfig, TOKENS_SUFFIX } from "@/config/models.config";
import { getModelGroupAndItem } from "@/functions/getModelGroupAndItem";
import { useAppSelector } from "@/redux/hooks";
import { selectBalance } from "@/redux/tokens/selectors";
import { ModelType } from "@/types/types";
import TooltipModalWindow from "../../TooltipModalWindow/TooltipModalWindow";
import styles from "./ModalWindow.module.css";

type Props = {
  selectedModelGroup: ModelType;
  setSelectedModelGroup: (group: ModelType) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  setIsModalOpen: (open: boolean) => void;
};

const getDetailsId = (title: string) =>
  `model-details-${title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;

export default function ModalWindow({
  selectedModelGroup,
  setSelectedModelGroup,
  selectedModel,
  setSelectedModel,
  setIsModalOpen,
}: Props) {
  const appliedGroup =
    (getModelGroupAndItem(selectedModel)?.group as ModelType | undefined) ??
    selectedModelGroup;
  const balance = useAppSelector(selectBalance);
  const [viewGroup, setViewGroup] = useState<ModelType>(appliedGroup);
  const [visibleModel, setVisibleModel] = useState<string | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setViewGroup(appliedGroup);
  }, [appliedGroup]);

  useEffect(() => {
    const tabs = tabsRef.current;
    const activeTab = activeTabRef.current;

    if (
      !tabs ||
      !activeTab ||
      window.matchMedia("(min-width: 601px)").matches
    ) {
      return;
    }

    const tabsRect = tabs.getBoundingClientRect();
    const activeRect = activeTab.getBoundingClientRect();
    const edgePadding = 8;

    if (activeRect.left < tabsRect.left + edgePadding) {
      tabs.scrollLeft -= tabsRect.left + edgePadding - activeRect.left;
    } else if (activeRect.right > tabsRect.right - edgePadding) {
      tabs.scrollLeft += activeRect.right - tabsRect.right + edgePadding;
    }
  }, [viewGroup]);

  const selectModel = (title: string) => {
    setSelectedModel(title);
    setSelectedModelGroup(viewGroup);
    setIsModalOpen(false);
  };

  return (
    <div className={styles.modalContainer}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <h2 id="model-picker-title" className={styles.title}>
            Choose AI tools or a GPT model
          </h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={() => setIsModalOpen(false)}
            aria-label="Close model picker"
          >
            <Image width={24} height={24} src="/icons/close.svg" alt="" />
          </button>
        </div>

        <div
          ref={tabsRef}
          className={styles.btnsContainer}
          role="tablist"
          aria-label="Model groups"
        >
          {Object.keys(modelConfig).map((group) => (
            <button
              key={group}
              ref={viewGroup === group ? activeTabRef : undefined}
              type="button"
              className={clsx(
                styles.btn,
                viewGroup === group && styles.groupActive,
              )}
              role="tab"
              aria-selected={viewGroup === group}
              aria-controls="model-list-panel"
              onClick={() => {
                setViewGroup(group as ModelType);
                setSelectedModelGroup(group as ModelType);
                setVisibleModel(null);
              }}
            >
              <span className={styles.groupLabel}>
                {group}
                {group === "gpt-5.5" && (
                  <span className={styles.newBadge}>New</span>
                )}
              </span>
            </button>
          ))}
        </div>
      </header>

      <section
        id="model-list-panel"
        className={styles.mainSection}
        role="tabpanel"
        aria-label={`${viewGroup} models`}
      >
        <div className={styles.btnsContainer2}>
          {modelConfig[viewGroup].list.map((item) => {
            const detailsOpen = visibleModel === item.title;
            const detailsId = getDetailsId(item.title);

            return (
              <div key={item.title} className={styles.modelWrapper}>
                <button
                  type="button"
                  className={clsx(
                    styles.btn2,
                    selectedModel === item.title && styles.modelActive,
                  )}
                  onClick={() => selectModel(item.title)}
                  aria-pressed={selectedModel === item.title}
                >
                  <span className={styles.mainContainerbtn2}>
                    <span className={styles.btn2Paragraph}>{item.title}</span>
                    <span className={styles.btn2Span1}>
                      {item.amount ? `${item.amount} ≈ ` : ""}
                      {item.tokens.toLocaleString()} {TOKENS_SUFFIX}
                    </span>
                  </span>
                  <span className={styles.btn2Span2}>{item.desc}</span>
                  {item.subDesc && (
                    <span className={styles.btn2Span2}>{item.subDesc}</span>
                  )}
                </button>

                <button
                  type="button"
                  className={styles.eyeIcon}
                  onClick={() =>
                    setVisibleModel((current) =>
                      current === item.title ? null : item.title,
                    )
                  }
                  aria-label={`${detailsOpen ? "Hide" : "Show"} details for ${item.title}`}
                  aria-expanded={detailsOpen}
                  aria-controls={detailsId}
                >
                  <Image width={30} height={20} src="/icons/eye.svg" alt="" />
                </button>

                {detailsOpen && (
                  <div
                    id={detailsId}
                    className={styles.tooltipWrapper}
                    role="region"
                    aria-label={`Details for ${item.title}`}
                  >
                    <TooltipModalWindow
                      key={item.title}
                      onClose={() => setVisibleModel(null)}
                      tooltip={item.tooltip}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <footer className={styles.footer}>
        <article className={styles.gptBalance}>
          <h3 className={styles.title3}>Balance</h3>
          <div className={styles.balanceContainer}>
            <span className={styles.gptSpan1}>{balance.toLocaleString()}</span>
            <Link href="/top-up-your-tokens" className={styles.badgeLink}>
              <Image width={24} height={24} src="/icons/badge.svg" alt="" />
              <span className={styles.badgeText}>Top up tokens</span>
            </Link>
          </div>
        </article>

        <p className={styles.subscriptionsNote}>
          No subscriptions • Tokens never expire
        </p>
        <p className={styles.footerSpan}>
          * Approximate price for a typical 30-word message. Actual usage depends
          on prompt and response length.
        </p>
      </footer>
    </div>
  );
}
