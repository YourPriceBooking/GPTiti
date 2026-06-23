import React from 'react';
import Image from 'next/image';
import styles from './DeleteModalWindow.module.css';

type DeleteModalWindowProps = {
  onCancel: () => void;
  onConfirm: () => void;
  type?: 'chat' | 'project';
};

export default function DeleteModalWindow({ onCancel, onConfirm, type = 'chat' }: DeleteModalWindowProps) {
  const label = type === 'project' ? 'project' : 'chat';
  return (
    <div className={styles.container}>
        <div className={styles.iconContainer}>
            <Image src="/icons/delete-modal.svg" alt="delete-modal" width={44} height={44} />
        </div>
        <div className={styles.infoContainer}>
        <h2 className={styles.title}>Delete this {label}?</h2>
        <p className={styles.paragraph}>This action can&apos;t be undone.</p>
        <p className={styles.paragraph}>The {label} will be permanently removed.</p>
        <div className={styles.buttonsContainer}>
            <button className={styles.cancelButton} onClick={onCancel}>
            <span className={styles.cancelButtonText}>Cancel</span>
            </button>
        <button className={styles.deleteButton} onClick={onConfirm}>
            <span className={styles.deleteButtonText}>Delete</span>
        </button>
        </div>
        </div>
    </div>
  )
}
