import React from 'react';
import Image from 'next/image';
import styles from './SectionGptTokens.module.css';
import ModalWindow from '../ModalWindow/ModalWindow';
import { SectionGptTokensProps } from '@/types/types';
import { getModelGroupAndItem } from '@/functions/getModelGroupAndItem';
import Link from 'next/link';

export default function SectionGptTokens({modelRef, 
    modelMode, 
    setModelMode, 
    selectedModel, 
    setSelectedModel, 
    selectedModelGroup, 
    setSelectedModelGroup}: SectionGptTokensProps) {
     
const result = getModelGroupAndItem(selectedModel);
const capitalizeFirstThree = (text: string) => {
  return text.slice(0, 3).toUpperCase() + text.slice(3);
};
  return (
    <section className={styles.gptTokens}>
        <article className={styles.gptMini}>
          <div
            ref={modelRef}
            className={styles.modelHoverWrapper}
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              setModelMode(prev => (prev === 'click' ? 'idle' : 'click'));
            }}
          >
            <article className={styles.titleContainer}>
       <h2 className={styles.title}>
  {result ? capitalizeFirstThree(result.model.title) : capitalizeFirstThree(selectedModel)}
</h2>
              <Image
                width={11}
                height={6}
                src="/icons/chevron-small.svg"
                alt="chevron-small"
              />
            </article>
            {modelMode === 'click' && (
              <div
                className={styles.modalWrapper}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                <ModalWindow
                 selectedModelGroup={selectedModelGroup}
                 setSelectedModelGroup={setSelectedModelGroup}
                 selectedModel={selectedModel}
                 setSelectedModel={setSelectedModel}
                />
              </div>
            )}
          </div>

          <p className={styles.paragraph}>
            approximate asking price 20 tokens*
          </p>
        </article>

        <article className={styles.gptBalance}>
          <h2 className={styles.title2}>Balance</h2>
          <div className={styles.balanceContainer}>
            <span className={styles.gptSpan1}>10 000</span>
            <Image width={24} height={24} src="/icons/badge.svg" alt="badge" />
          </div>
        </article>

        <div className={styles.btnContainer}>
          <Link href='/top-up-your-tokens'>
          <button className={styles.btn}>
            <div className={styles.iconWrapper}>
              <Image
                width={33}
                height={33}
                src="/icons/circle-icon.svg"
                alt="circle-icon"
              />
            </div>
            <span className={styles.btnSpan1}>Top up tokens</span>
          </button>
          </Link>
        </div>
      </section>
  )
}
