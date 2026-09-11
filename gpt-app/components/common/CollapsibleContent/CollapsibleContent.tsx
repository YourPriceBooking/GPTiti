import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import Image from "next/image";

import styles from "./CollapsibleContent.module.css";

type CollapsibleContentProps = {
  children: ReactNode;
  maxHeight?: number;
  collapsible?: boolean;
  contentKey?: string | number | boolean;
  expandText?: string;
  collapseText?: string;
  className?: string;
  contentClassName?: string;
  buttonClassName?: string;
};

export default function CollapsibleContent({
  children,
  maxHeight,
  collapsible = true,
  contentKey,
  expandText = "Show full response",
  collapseText = "Collapse",
  className = "",
  contentClassName = "",
  buttonClassName = "",
}: CollapsibleContentProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const collapsingRef = useRef(false);

  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const [renderedKey, setRenderedKey] = useState(contentKey);

  const contentId = `${useId()}-collapsible`;

  if (renderedKey !== contentKey) {
    setRenderedKey(contentKey);
    setExpanded(false);
  }

  useEffect(() => {
    const element = contentRef.current;

    if (!collapsible || !element) return;

    const measure = () => {
      const node = contentRef.current;

      if (!node) return;

      const limit =
        parseFloat(
          getComputedStyle(node).getPropertyValue("--collapsed-max-height"),
        ) || maxHeight;

      if (!limit || !Number.isFinite(limit)) return;

      setOverflowing(node.scrollHeight > limit + 1);
    };

    measure();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [collapsible, contentKey, maxHeight]);

  useEffect(() => {
    if (!collapsingRef.current) return;
    collapsingRef.current = false;
    buttonRef.current?.scrollIntoView({ block: "nearest" });
  }, [expanded]);

  const toggle = () => {
    collapsingRef.current = expanded;
    setExpanded((value) => !value);
  };

  const canCollapse = collapsible && overflowing;
  const isCollapsed = canCollapse && !expanded;

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div
        ref={contentRef}
        id={contentId}
        className={`${styles.content} ${contentClassName} ${
          isCollapsed ? styles.collapsed : ""
        }`}
        style={
          maxHeight
            ? ({
                "--collapsed-max-height": `${maxHeight}px`,
              } as CSSProperties)
            : undefined
        }
      >
        {children}
      </div>

      {canCollapse && (
        <button
          ref={buttonRef}
          type="button"
          className={buttonClassName || styles.expandButton}
          onClick={toggle}
          aria-expanded={expanded}
          aria-controls={contentId}
        >
          <span>{expanded ? collapseText : expandText}</span>

          <Image
            className={`${styles.chevron} ${expanded ? styles.chevronUp : ""}`}
            width={15}
            height={15}
            src="/icons/chevron-down-dark.svg"
            alt=""
          />
        </button>
      )}
    </div>
  );
}
