import { ModelGptitiTitleWithIconProps } from "@/types/types";
import styles from "./ModelGptitiTitleWithIcon.module.css";
import Image from "next/image";
import { getModelGroupAndItem } from "@/functions/getModelGroupAndItem";
export default function ModelGptitiTitleWithIcon({
  modelRef,
  selectedModel,
  isModalOpen,
  setIsModalOpen,
}: ModelGptitiTitleWithIconProps) {
  const result = getModelGroupAndItem(selectedModel);
  return (
    <div
      ref={modelRef}
      className={styles.modelHoverWrapper}
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        setIsModalOpen(true);
      }}
    >
      <article className={styles.titleContainer}>
        <h2 className={styles.title}>
          {result ? result.model.title : selectedModel}
        </h2>
        <Image
          className={styles.chevronIcon}
          width={11}
          height={6}
          src="/icons/chevron-small.svg"
          alt="chevron-small"
        />
      </article>
    </div>
  );
}
