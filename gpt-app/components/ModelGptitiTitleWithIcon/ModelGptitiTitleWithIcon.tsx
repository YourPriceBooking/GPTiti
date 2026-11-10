import { useAppSelector } from "@/redux/hooks";
import { selectCatalog } from "@/redux/model/selectors";
import { ModelGptitiTitleWithIconProps } from "@/types/types";
import styles from "./ModelGptitiTitleWithIcon.module.css";
import Image from "next/image";
import { getModelGroupAndItem } from "@/functions/getModelGroupAndItem";
export default function ModelGptitiTitleWithIcon({
  modelRef,
  selectedModel,
  setIsModalOpen,
}: ModelGptitiTitleWithIconProps) {
  const catalog = useAppSelector(selectCatalog);
  const result = getModelGroupAndItem(selectedModel, catalog);
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
          {result ? result.model.label : selectedModel || "Choose model"}
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
