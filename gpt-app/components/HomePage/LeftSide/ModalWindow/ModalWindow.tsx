import React from 'react';
import styles from './ModalWindow.module.css';
import Image from 'next/image';
import { ModelType } from '@/types/types';
import { modelConfig, TOKENS_SUFFIX } from '@/config/models.config';

type Props = {
  selectedModelGroup: ModelType;
  setSelectedModelGroup: (group: ModelType) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
};

export default function ModalWindow({selectedModelGroup,
  setSelectedModelGroup,
  selectedModel,
  setSelectedModel}:Props) {
  return (
    <div className={styles.modalContainer}>
      <header className={styles.header}>
        <h2 className={styles.title}>Chat</h2>
        <div className={styles.btnsContainer}>
          {Object.keys(modelConfig).map((group) => (
            <button
              key={group}
              className={`${styles.btn} ${selectedModelGroup === group ? styles.active : ''}`}
              onClick={() => setSelectedModelGroup(group as ModelType)}
            >
              {group}
            </button>
          ))}
        </div>
      </header>

      <section className={styles.mainSection}>
        <h5 className={styles.title2}>Choose a model</h5>
        <div className={styles.btnsContainer2}>
          {modelConfig[selectedModelGroup].list.map((item) => (
            <button
              key={item.title}
              className={`${styles.btn2} ${selectedModel === item.title ? styles.active : ''}`}
              onClick={() => setSelectedModel(item.title)}
            >
              <div className={styles.mainContainerbtn2}>
                <p className={styles.btn2Paragraph}>{item.title}</p>
                <span className={styles.btn2Span1}>
                  {item.tokens} {TOKENS_SUFFIX}
                </span>
              </div>
              <span className={styles.btn2Span2}>{item.desc}</span>
            </button>
          ))}
        </div>
      </section>
        <footer>
            <article className={styles.gptBalance}>
            <h2 className={styles.title3}>Balance</h2>
            <div className={styles.balanceContainer}>
              <span className={styles.gptSpan1}>10 000</span>
             <Image width={24} height={24} src='/icons/badge.svg' alt='badge'></Image>
            </div>
          </article>
          <span className={styles.footerSpan}>* We show an approximate 
                      price based on a typical 30-word message. 
                      Real token usage depends on how much you write — shorter prompts cost less, 
                      longer ones cost more.
                      </span>
        </footer>
    </div>
  )
}
