import { usesBackgroundOcr, fileCeilings, formatLimit, type FileLimits } from '@/lib/files/limits';
import styles from './AddSomethingToInput.module.css';
export default function LiveFileLimits({ limits, status, retry }: { limits: FileLimits | null; status: string; retry: () => void }) {
  if (!limits) return <div className={styles.limitsNotice} role="status">
    <p>{status === 'signed-out' ? 'Sign in to see the current file limits for your model.' : status === 'loading' ? 'Loading current file limits…' : 'Could not load file limits. Your draft is safe; text-only messages still work.'}</p>
    {status === 'error' && <button type="button" onClick={retry}>Retry limits</button>}
  </div>;
  const rows = [['PDF', 'pdf'], ['DOCX', 'docx'], ['XLSX', 'xlsx'], ['CSV / TSV', 'csv'], ['Text / code', 'txt'], ['Images', 'png'], ['ZIP', 'zip']];
  return <div className={styles.liveLimits}>
    <button className={styles.refreshLimits} type="button" onClick={retry}>Refresh limits</button>
    <div className={styles.storageQuota}><span>Private storage</span><strong>{formatLimit(limits.storage.maxBytes)}</strong><small>per account · up to {limits.storage.maxCount.toLocaleString('en-US')} files</small></div>
    <p>Storage and chat reading have different limits. This chat picker accepts files that fit both.</p>
    <table className={styles.limitsTable}><caption>Current limits for the selected model</caption><thead><tr><th>Format</th><th>Storage</th><th>Chat reading</th></tr></thead><tbody>
      {rows.map(([label, ext]) => { const caps = fileCeilings('file.' + ext, limits); return <tr key={ext}><th scope="row">{label}</th><td>{caps ? formatLimit(caps.upload) : 'Unavailable'}</td><td>{caps?.enabled ? formatLimit(caps.reading) : 'Disabled'}</td></tr>; })}
    </tbody></table>
    <ul><li>Up to {limits.message.maxAttachments} attachments and {formatLimit(limits.message.maxBytes)} total per message.</li>
      <li>Up to {formatLimit(limits.message.extractedTextBytes)} of combined extracted content, including earlier attachments still in context. The server checks the complete request.</li>
      <li>{limits.processing.ocr.enabled ? `OCR: up to ${limits.processing.ocr.maxOcrPages} scanned pages and ${formatLimit(limits.processing.ocr.maxTextBytes)} of recognized text per file.` : 'OCR is disabled for this model.'}</li>
      {usesBackgroundOcr(limits) && limits.preparation?.pageCheckpoints && <li>PDF preparation: up to {limits.processing.ocr.maxPdfPages} total pages, including up to {limits.processing.ocr.maxOcrPages} scanned pages. Text-layer pages count toward progress but do not need OCR. Completed pages are saved for continuation after an interruption.</li>}
    </ul>
    <p>Preparing and saving the full OCR text does not increase the message context limit. If the extracted content is too long, split the document; it will not be silently shortened.</p>
    <p>MB / GB use decimal bytes; KiB / MiB use binary bytes. Page count and document complexity are checked during preparation. A storage upload does not guarantee that the whole file can be read in chat.</p>
  </div>;
}
