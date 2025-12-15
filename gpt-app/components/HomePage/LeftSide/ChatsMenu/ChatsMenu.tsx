import React from 'react'
import styles from './ChatsMenu.module.css';
import Image from 'next/image';

type ChatsMenuProps = {
  onRenameRequest: () => void;
  onDeleteRequest: () => void;
};

export default function ChatsMenu( { onRenameRequest, onDeleteRequest }: ChatsMenuProps) {
  return (
    <div className={styles.container}>
        <button className={styles.button} onClick={onRenameRequest}>
            <span className="icon">
                <Image src="/icons/pencil.svg" alt="Rename" width={14} height={15} />
            </span>
            <span className={styles.label1}>Rename</span>
        </button>
        <Image className={styles.separator} src="/icons/horizontal-line.svg" alt="Separator" width={180} height={1} />
         <button className={styles.button} onClick={onDeleteRequest}>
            <span className="icon">
                <Image src="/icons/trash.svg" alt="Delete" width={14} height={15} />
            </span>
            <span className={styles.label2}>Delete</span>
         </button>
    </div>
  )
}
