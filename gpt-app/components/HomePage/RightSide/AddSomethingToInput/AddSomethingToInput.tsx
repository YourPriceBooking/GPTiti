import { useEffect, useId, useRef, useState } from 'react';
import styles from './AddSomethingToInput.module.css';
import { FILE_ACCEPT, IMAGE_ACCEPT, TEXT_EXTENSIONS } from '@/lib/files/input';

export default function AddSomethingToInput({ onImageSelect, onImageBlocked, isImageBlocked = false, onFileSelect, maxImages, maxImageSizeMb }: {
  onImageSelect: (files: File[]) => void;
  onImageBlocked?: () => void;
  isImageBlocked?: boolean;
  onFileSelect: (files: File[]) => void;
  maxImages: number;
  maxImageSizeMb: number;
}) {
  const imageInput = useRef<HTMLInputElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const infoButton = useRef<HTMLButtonElement>(null);
  const [info, setInfo] = useState(false);
  const [pinned, setPinned] = useState(false);
  const id = useId();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelClose = () => { if (timer.current) clearTimeout(timer.current); };
  const close = () => { cancelClose(); setInfo(false); setPinned(false); };
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const select = (event: React.ChangeEvent<HTMLInputElement>, images: boolean) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (files.length) (images ? onImageSelect : onFileSelect)(files);
  };
  return <div className={styles.menu} onKeyDown={event => {
    if (event.key === 'Escape' && info) { event.stopPropagation(); close(); infoButton.current?.focus(); }
  }}>
    <input ref={imageInput} type="file" accept={IMAGE_ACCEPT} multiple hidden onChange={e => select(e, true)} />
    <input ref={fileInput} type="file" accept={FILE_ACCEPT} multiple hidden onChange={e => select(e, false)} />
    <div className={styles.fileRow}>
      <button type="button" className={styles.item} onClick={() => fileInput.current?.click()}>
        <svg className={styles.icon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><path d="m8 12 6-6a3 3 0 0 1 4 4l-8 8a5 5 0 0 1-7-7l9-9"/><path d="m7 13 7-7"/></svg><span><strong>Add files</strong><small>Text, code, images</small></span>
      </button>
      <div className={styles.infoTrigger} onMouseEnter={() => { cancelClose(); setInfo(true); }} onMouseLeave={() => { if (!pinned) timer.current = setTimeout(() => setInfo(false), 250); }}>
        <button ref={infoButton} type="button" className={styles.infoButton} aria-label="Supported files, limits and pricing" aria-expanded={info} aria-controls={id}
          onClick={() => { cancelClose(); if (pinned) close(); else { setPinned(true); setInfo(true); } }}>ⓘ</button>
      </div>
    </div>
    <button type="button" className={styles.item} onClick={() => isImageBlocked ? onImageBlocked?.() : imageInput.current?.click()}>
      <svg className={styles.icon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8" cy="8" r="1.5"/><path d="m4 18 5-5 4 4 3-4 5 5"/></svg>
      <span><strong>Add image</strong><small>PNG, JPG, WEBP</small></span>
    </button>
    <p className={styles.footer}>Attachment content counts toward request cost.</p>
    {info && <section id={id} className={styles.infoPanel} aria-label="Attachment guide" onFocusCapture={() => { cancelClose(); setPinned(true); }} onMouseEnter={cancelClose} onMouseLeave={() => { if (!pinned) timer.current = setTimeout(() => setInfo(false), 250); }}>
      <header><strong>Files you can use</strong><button type="button" aria-label="Close attachment guide" onClick={() => { close(); infoButton.current?.focus(); }}>×</button></header>
      <div className={styles.infoBody} tabIndex={0}>
        <h3>Supported formats</h3>
        <p><b>Images:</b> PNG, JPG/JPEG, WEBP.</p>
        <p><b>Text & data:</b> TXT, MD, CSV, TSV, JSON, XML, YAML/YML, LOG.</p>
        <p><b>Code:</b> {TEXT_EXTENSIONS.filter(ext => !['txt', 'md', 'csv', 'tsv', 'json', 'xml', 'yaml', 'yml', 'log'].includes(ext)).join(', ').toUpperCase()}.</p>
        <h3>Size & quantity</h3>
        <ul><li>Up to 10 attachments per message, including images.</li><li>Text: 64 KiB per file; 128 KiB across text attachments in the request, including earlier files still in the conversation context.</li><li>{maxImages ? `Selected model: up to ${maxImages} images, ${maxImageSizeMb} MB each before compression.` : 'The selected model does not support images.'}</li><li>Up to 25 MiB of attachments per message. The server may enforce a lower configured limit.</li></ul>
        <h3>What you can ask</h3>
        <p>Summarize, translate, compare, find values, explain code, or create a new file from the attached content. Add a message describing what you need.</p>
        <h3>Reading & privacy</h3>
        <p>Text must use UTF-8. Code, HTML and spreadsheet formulas are not executed. File content is sent to the selected AI provider for your request. Saved files are private to your account.</p>
        <p>PDF, DOC/DOCX, XLS/XLSX, PPT/PPTX, ZIP and SVG cannot be read as attachments yet. Some of these can already be created as results.</p>
        <h3>Context & pricing</h3>
        <p>Earlier attachments can be included again within the last 20 messages and count toward cost again. Files outside that window are not automatically remembered.</p>
        <p>A token reserve is held before sending and may exceed the final charge. Final billing follows model usage; unused reserve is released. Limits and availability are checked again by the server.</p>
      </div>
    </section>}
  </div>;
}
