import React from 'react';
import styles from './AddSomethingToInput.module.css';
import Image from 'next/image';

export default function AddSomethingToInput() {
  return (
      <div className={styles.addSomethingToInputContainer}>
            <div className={styles.addSomethingToInput}>
                <div className={styles.InfoContainer}>
                    <Image className={styles.InfoContainerIcon} width={14} height={14} src='/icons/file.png' alt='add file'/>
                    <div>
                    <p className={styles.InfoContainerParagraph}>Add files</p>
                    <span className={styles.InfoContainerSpan}>PDFs, docs, spreadsheets</span>
                    </div>
                </div>
                <div className={styles.InfoContainer}>
                    <Image className={styles.InfoContainerIcon} width={14} height={14} src='/icons/image1.png' alt='add image'/>
                    <div>
                    <p className={styles.InfoContainerParagraph}>Add image</p>
                    <span className={styles.InfoContainerSpan}>Screenshots or photos</span>
                    </div>
                    </div>
                <div className={styles.InfoContainer}> 
                    <Image className={styles.InfoContainerIcon} width={14} height={14} src='/icons/paste.png' alt='paste'/>
                    <div>
                    <p className={styles.InfoContainerParagraph}>Paste text</p>
                    <span className={styles.InfoContainerSpan}>Large texts or articles</span>
                    </div>
                    </div>
                <div className={styles.InfoContainer}>
                    <Image className={styles.InfoContainerIcon} width={14} height={14} src='/icons/link.png' alt='add link'/>
                    <div>
                    <p className={styles.InfoContainerParagraph}>Add link</p>
                    <span className={styles.InfoContainerSpan}>Analyze a web page </span>
                    </div>
                    </div>
                 </div>
                 <div className={styles.addSomethingToInputSpanContainer}>
                 <span className={styles.addSomethingToInputSpan}>Pricing depends on model content size </span>
                 </div>
          </div>
  )
}
