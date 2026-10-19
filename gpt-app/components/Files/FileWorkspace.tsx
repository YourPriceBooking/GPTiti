'use client';
/* eslint-disable @next/next/no-img-element -- Authenticated local Blob URLs must not use the image optimization proxy. */

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { loadPreview, loadOcr, downloadOcr, downloadFile, fileError, type Preview } from '@/lib/files/api';
import { extension, fileSize, tablePreview, type ManagedFile, type FileResult, type StructuredPreview, type PreviewCell } from '@/lib/files/types';
import MarkdownContent from '@/components/common/MarkdownContent/MarkdownContent';
import styles from './Files.module.css';
import { ocrSections, ocrError, type OcrPreview } from '@/lib/files/ocr';

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
function PreviewTable({ rows }: { rows: PreviewCell[][] }) {
  return <div className={styles.tableScroll}><table><tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => i === 0 ? <th scope="col" key={j}>{cell === null ? '' : String(cell)}</th> : <td key={j}>{cell === null ? '' : String(cell)}</td>)}</tr>)}</tbody></table></div>;
}
function OfficePreview({ data }: { data: StructuredPreview }) {
  const [sheet, setSheet] = useState(0);
  return <div className={styles.document}>
    <p className={styles.note}>{data.kind === 'document' ? 'Content preview. Download to see the document’s page layout.' : 'Data preview: up to 200 rows and 30 columns per sheet.'}</p>
    {data.truncated && <p className={styles.note}>Showing part of the content. Download the complete file.</p>}
    {data.kind === 'document' ? <>{data.title && <h2>{data.title}</h2>}{data.blocks.map((block, i) => block.type === 'table' ? <PreviewTable key={i} rows={block.rows} /> : block.type === 'heading' ? <h3 key={i}>{block.text}</h3> : block.type === 'bullet' ? <ul key={i}><li>{block.text}</li></ul> : <p key={i}>{block.text}</p>)}</> : <>
      <div className={styles.sheets} aria-label="Workbook sheets">{data.sheets.map((item, i) => <button type="button" key={i} aria-pressed={sheet === i} onClick={() => setSheet(i)}>{item.name}</button>)}</div>
      <PreviewTable rows={data.sheets[sheet]?.rows ?? []} />
    </>}
  </div>;
}
function RecognizedText({ file }: { file: ManagedFile }) {
  const [data, setData] = useState<OcrPreview | null>(null);
  const [error, setError] = useState(''); const [retry, setRetry] = useState(0);
  const [action, setAction] = useState(''); const [busy, setBusy] = useState(false);
  const [raw, setRaw] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    loadOcr(file.fileId, controller.signal).then(value => { if (!controller.signal.aborted) setData(value); })
      .catch(e => { if (!controller.signal.aborted) setError(ocrError(e) || fileError(e)); });
    return () => controller.abort();
  }, [file.fileId, retry]);
  if (error) return <div className={styles.ocrEmpty} role="status"><span aria-hidden="true">▤</span><h3>Recognized text is unavailable</h3><p>{error}</p><button className={styles.previewButton} onClick={() => { setError(''); setData(null); setRetry(n => n + 1); }}>Check again</button></div>;
  if (!data) return <div className={styles.ocrEmpty} role="status"><p>Loading saved text…</p></div>;
  return <div className={styles.ocrView}>
    <div className={styles.ocrBadge}><span aria-hidden="true">●</span> Saved extraction · No AI rewriting</div>
    <div className={styles.ocrNotice}><strong>{data.uncertain ? 'Some text may be inaccurate' : 'Check important details'}</strong><p>Recognition can misread names, dates, numbers and line order. This is the saved extraction, not a verified copy of the original.</p>{data.legacy && <p>This text was saved with an earlier recognition version.</p>}</div>
    <div className={styles.ocrTools}>
      <button className={styles.previewButton} disabled={busy} onClick={async () => {
        setBusy(true); setAction(''); try { await navigator.clipboard.writeText(data.text); setAction('Full saved text copied.'); } catch { setAction('Could not copy. Download the TXT file instead.'); } finally { setBusy(false); }
      }}>Copy all text</button>
      <button className={styles.download} disabled={busy} onClick={async () => {
        setBusy(true); setAction(''); try { await downloadOcr(file); setAction('TXT downloaded.'); } catch (e) { setAction(fileError(e)); } finally { setBusy(false); }
      }}>Download TXT</button>
    </div>
    <p className={styles.ocrCaption}>Copy and TXT include the full saved text and recognition notes. No model request or extra token charge.</p>
    <div role="status" className={styles.ocrFeedback}>{action}</div>
    <button className={styles.rawToggle} aria-pressed={raw} onClick={() => setRaw(v => !v)}>{raw ? 'Show pages' : 'Show raw text'}</button>
    {raw ? <pre dir="auto" className={styles.ocrText}>{data.text}</pre> : ocrSections(data.text).map((section, index) => <section className={styles.ocrPage} key={index}>{section.label === 'Recognition notes' ? <details><summary>Recognition notes</summary><pre dir="auto" className={styles.ocrText}>{section.text}</pre></details> : <><h3>{section.label}</h3><pre dir="auto" className={styles.ocrText}>{section.text}</pre></>}</section>)}
  </div>;
}
function PreviewPanel({ file, close }: { file: ManagedFile; close: () => void }) {
  const [retry, setRetry] = useState(0);
  const [tab, setTab] = useState<'file' | 'ocr'>('file');
  const hasOcr = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'].includes(file.mimetype);
  const state = usePreview(file, tab === 'file', retry);
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
    {hasOcr && <div className={styles.previewTabs} role="group" aria-label="Preview mode"><button aria-pressed={tab === 'file'} onClick={() => setTab('file')}>File</button><button aria-pressed={tab === 'ocr'} onClick={() => setTab('ocr')}>Recognized text</button></div>}
    <div className={styles.previewBody}>
      {tab === 'ocr' ? <RecognizedText file={file} /> : <>
      {!state.data && !state.error && <p role="status">Loading preview…</p>}
      {state.error && <div role="alert"><p>{state.error}</p><button className={styles.previewButton} onClick={() => setRetry(n => n + 1)}>Try again</button></div>}
      {state.data?.kind === 'image' && state.url && <img className={styles.image} src={state.url} alt={file.originalName} />}
      {state.data?.kind === 'text' && <>{state.data.truncated && <p className={styles.note}>Showing the first 64 KB. Download to view the full file.</p>}<TextPreview file={file} text={state.data.text} truncated={state.data.truncated} /></>}
      {(state.data?.kind === 'document' || state.data?.kind === 'workbook') && <OfficePreview data={state.data} />}
      {state.data?.kind === 'unavailable' && <div className={styles.ocrEmpty}><h3>Your original file</h3><p>Download to view the original layout.{hasOcr ? ' Open Recognized text to read the saved extraction.' : ''}</p></div>}
      </>}
    </div>
    <footer><Download file={file} /></footer>
  </aside>;
}
export default function FileWorkspace({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<ManagedFile | null>(null);
  const close = useCallback(() => setSelected(null), []);
  return <FileContext.Provider value={setSelected}><div className={`${styles.workspace} ${selected ? styles.open : ''}`}><div className={styles.chat}>{children}</div>{selected && <PreviewPanel key={selected.fileId} file={selected} close={close} />}</div></FileContext.Provider>;
}
