'use client';
/* eslint-disable @next/next/no-img-element -- Authenticated local Blob URLs must not use the image optimization proxy. */

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { loadPreview, downloadFile, fileError, type Preview } from '@/lib/files/api';
import { extension, fileSize, tablePreview, type ManagedFile, type FileResult } from '@/lib/files/types';
import MarkdownContent from '@/components/common/MarkdownContent/MarkdownContent';
import styles from './Files.module.css';

const FileContext = createContext<(file: ManagedFile) => void>(() => {});
function usePreview(file: ManagedFile, enabled = true, retry = 0) {
  const [state, setState] = useState<{ id: string; data?: Preview; url?: string; error?: string }>({ id: '' });
  useEffect(() => {
    if (!enabled || file.status !== 'ready') return;
    const controller = new AbortController(); let url: string | undefined;
    loadPreview(file.fileId, controller.signal).then(data => {
      if (controller.signal.aborted) return;
      if (data.kind === 'image') url = URL.createObjectURL(data.blob);
      setState({ id: file.fileId, data, url });
    }).catch(error => { if (!controller.signal.aborted) setState({ id: file.fileId, error: fileError(error) }); });
    return () => { controller.abort(); if (url) URL.revokeObjectURL(url); };
  }, [file.fileId, file.status, enabled, retry]);
  return state.id === file.fileId ? state : { id: file.fileId };
}
function Thumbnail({ file }: { file: ManagedFile }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting)) { setVisible(true); observer.disconnect(); } });
    observer.observe(ref.current); return () => observer.disconnect();
  }, []);
  const state = usePreview(file, visible && file.mimetype.startsWith('image/'));
  return <div ref={ref} className={styles.thumbnail}>{state.url ? <img src={state.url} alt="" /> : <span>{extension(file.originalName).toUpperCase()}</span>}</div>;
}
function Download({ file }: { file: ManagedFile }) {
  const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  return <div className={styles.downloadWrap}>
    <button type="button" className={styles.download} disabled={busy || file.status !== 'ready'} onClick={async () => {
      setBusy(true); setError(''); try { await downloadFile(file); } catch (e) { setError(fileError(e)); } finally { setBusy(false); }
    }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M4 15v5h16v-5" /></svg>{busy ? 'Downloading…' : 'Download'}</button>
    {error && <span role="alert" className={styles.error}>{error}</span>}
  </div>;
}
export function FileCards({ files = [], result }: { files?: ManagedFile[]; result?: FileResult | null }) {
  const open = useContext(FileContext);
  if (!files.length && result?.status !== 'failed') return null;
  return <div className={styles.cards}>
    {files.map(file => <div key={file.fileId} className={styles.card}>
      <Thumbnail file={file} />
      <div className={styles.details}><strong title={file.originalName}>{file.originalName}</strong><span>{extension(file.originalName).toUpperCase()} · {fileSize(file.size)}</span>
        {file.status !== 'ready' && <span role="status">{file.status === 'deleted' ? 'File deleted' : 'File expired'}</span>}
      </div>
      {file.status === 'ready' && <div className={styles.actions}><button type="button" className={styles.previewButton} onClick={() => open(file)}>Preview</button><Download file={file} /></div>}
    </div>)}
    {result?.status === 'failed' && <div role="alert" className={styles.failure}><strong>Could not create {result.filename}</strong><p>{result.error === 'FILE_QUOTA_EXCEEDED' ? 'Your file storage limit has been reached.' : 'The generated file could not be saved. You can send a new request.'}</p><small>{result.error}</small></div>}
  </div>;
}
function TextPreview({ file, text, truncated }: { file: ManagedFile; text: string; truncated: boolean }) {
  const ext = extension(file.originalName);
  if (ext === 'csv' || ext === 'tsv') {
    const rows = tablePreview(text, ext === 'csv' ? ',' : '\t', truncated);
    return <><p className={styles.note}>Preview: up to 200 rows and 50 columns. Download for the complete file.</p><div className={styles.tableScroll}><table><tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div></>;
  }
  if (ext === 'md') return <MarkdownContent content={text} disableImages />;
  if (ext === 'txt' || ext === 'log') return <pre className={styles.plain}>{text}</pre>;
  let code = text;
  if (ext === 'json' && !truncated) { try { code = JSON.stringify(JSON.parse(text), null, 2); } catch { /* A partial preview stays readable. */ } }
  // A fence longer than every run in the content prevents escape into Markdown/HTML.
  const fence = '`'.repeat(Math.max(3, ...Array.from(code.matchAll(/`+/g), m => m[0].length + 1)));
  return <MarkdownContent content={`${fence}${ext}\n${code}\n${fence}`} disableImages />;
}
function PreviewPanel({ file, close }: { file: ManagedFile; close: () => void }) {
  const [retry, setRetry] = useState(0);
  const state = usePreview(file, true, retry);
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    ref.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); close(); }
      if (event.key !== 'Tab' || !window.matchMedia('(max-width: 1100px)').matches) return;
      const buttons = ref.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], [tabindex="0"]');
      if (!buttons?.length) return;
      const first = buttons[0], last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('keydown', key); previous?.focus(); };
  }, [close]);
  return <aside ref={ref} className={styles.panel} role="dialog" aria-label={`Preview ${file.originalName}`}>
    <header><div><h2>{file.originalName}</h2><p>{extension(file.originalName).toUpperCase()} · {fileSize(file.size)}</p></div><button type="button" onClick={close} aria-label="Close preview" className={styles.close}>×</button></header>
    <div className={styles.previewBody}>
      {!state.data && !state.error && <p role="status">Loading preview…</p>}
      {state.error && <div role="alert"><p>{state.error}</p><button className={styles.previewButton} onClick={() => setRetry(n => n + 1)}>Try again</button></div>}
      {state.data?.kind === 'image' && state.url && <img className={styles.image} src={state.url} alt={file.originalName} />}
      {state.data?.kind === 'text' && <>{state.data.truncated && <p className={styles.note}>Showing the first 64 KB. Download to view the full file.</p>}<TextPreview file={file} text={state.data.text} truncated={state.data.truncated} /></>}
      {state.data?.kind === 'unavailable' && <p>Preview is not available for this format. You can download the file.</p>}
    </div>
    <footer><Download file={file} /></footer>
  </aside>;
}
export default function FileWorkspace({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<ManagedFile | null>(null);
  const close = useCallback(() => setSelected(null), []);
  return <FileContext.Provider value={setSelected}><div className={`${styles.workspace} ${selected ? styles.open : ''}`}><div className={styles.chat}>{children}</div>{selected && <PreviewPanel key={selected.fileId} file={selected} close={close} />}</div></FileContext.Provider>;
}
