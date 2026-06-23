"use client";
import { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import styles from "./ModalWindow.module.css";
import Image from "next/image";
import Link from "next/link";
import { ModelType } from "@/types/types";
import { modelConfig, TOKENS_SUFFIX } from "@/config/models.config";
import { getModelGroupAndItem } from "@/functions/getModelGroupAndItem";
import TooltipModalWindow from "../../TooltipModalWindow/TooltipModalWindow";
import { useAppSelector } from "@/redux/hooks";
import { selectBalance } from "@/redux/tokens/selectors";

type Props = {
  selectedModelGroup: ModelType;
  setSelectedModelGroup: (group: ModelType) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  setIsModalOpen: (open: boolean) => void;
};

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

  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(
    () => () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    setViewGroup(appliedGroup);
  }, [appliedGroup]);

  // Стан для hover (desktop)
  const [hoveredModel, setHoveredModel] = useState<string | null>(null);
  // Стан для видимості тултіпа
  const [visibleModel, setVisibleModel] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  // Остання натиснута кнопка групи — тримає hover-ефект до перемикання
  const [clickedGroup, setClickedGroup] = useState<string | null>(null);

  const getGroupBtnClass = (group: string) =>
    clsx(
      styles.btn,
      appliedGroup === group && styles.groupActive,
      clickedGroup === group && styles.groupClicked,
    );

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 767);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    let showTimer: NodeJS.Timeout;
    let hideTimer: NodeJS.Timeout;

    if (hoveredModel) {
      // показати через 2 секунди
      showTimer = setTimeout(() => {
        setVisibleModel(hoveredModel);
      }, 2000);
    } else {
      // сховати через 1 секунду
      hideTimer = setTimeout(() => {
        setVisibleModel(null);
      }, 1000);
    }

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [hoveredModel, isMobile]);

  // Функція для мобільного кліку
  const toggleTooltip = (model: string) => {
    if (visibleModel === model) {
      setTimeout(() => setVisibleModel(null), 1000);
    } else {
      setTimeout(() => setVisibleModel(model), 2000);
    }
  };

  return (
    <div className={styles.modalContainer}>
      <header className={styles.header}>
        <h2 className={styles.title}>Choose a AI tools or model GPT Chat</h2>

        <div className={styles.btnsContainer}>
          {Object.keys(modelConfig).map((group) => (
            <button
              key={group}
              type="button"
              className={getGroupBtnClass(group)}
              onClick={() => {
                setViewGroup(group as ModelType);
                setSelectedModelGroup(group as ModelType);
                setClickedGroup(group);
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

      <section className={styles.mainSection}>
        <div className={styles.btnsContainer2}>
          {modelConfig[viewGroup].list.map((item) => (
            <div
              key={item.title}
              className={styles.modelWrapper}
              onMouseEnter={() => setHoveredModel(item.title)} // desktop
              onMouseLeave={() => setHoveredModel(null)} // desktop
            >
              <button
                type="button"
                className={`${styles.btn2} ${
                  selectedModel === item.title ? styles.modelActive : ""
                }`}
                onClick={() => {
                  setSelectedModel(item.title);
                  if (closeTimerRef.current)
                    clearTimeout(closeTimerRef.current);
                  closeTimerRef.current = setTimeout(
                    () => setIsModalOpen(false),
                    1000,
                  );
                }}
              >
                <div className={styles.mainContainerbtn2}>
                  <p className={styles.btn2Paragraph}>{item.title}</p>
                  <span className={styles.btn2Span1}>
                    {item.amount ? `${item.amount} ≈ ` : ""}
                    {item.tokens} {TOKENS_SUFFIX}
                  </span>
                </div>
                <span className={styles.btn2Span2}>{item.desc}</span>
                {item.subDesc && (
                  <span className={styles.btn2Span2}>{item.subDesc}</span>
                )}

                <span
                  className={styles.eyeIcon}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTooltip(item.title);
                  }}
                >
                  <Image
                    width={30}
                    height={20}
                    src="/icons/eye.svg"
                    alt="eye"
                  />
                </span>
              </button>

              {/* Tooltip */}
              {visibleModel === item.title && (
                <div className={styles.tooltipWrapper}>
                  <TooltipModalWindow
                    onClose={() => setVisibleModel(null)}
                    tooltip={item.tooltip}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <footer>
        <article className={styles.gptBalance}>
          <h2 className={styles.title3}>Balance</h2>
          <div className={styles.balanceContainer}>
            <span className={styles.gptSpan1}>{balance.toLocaleString()}</span>
            <Link href="/top-up-your-tokens" className={styles.badgeLink}>
              <Image
                width={24}
                height={24}
                src="/icons/badge.svg"
                alt="badge"
              />
              <span className={styles.badgeText}>Top up tokens</span>
            </Link>
          </div>
        </article>

        <p className={styles.subscriptionsNote}>
          No subscriptions • Tokens never expire •
        </p>

        <span className={styles.footerSpan}>
          * We show an approximate price based on a typical 30-word message.
          Real token usage depends on how much you write — shorter prompts cost
          less, longer ones cost more.
        </span>
      </footer>
    </div>
  );
}
