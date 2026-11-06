import { useEffect, useId, useRef, useState } from 'react';
import LiveFileLimits from './LiveFileLimits';
import { formatLimit, type FileLimits } from '@/lib/files/limits';
import styles from './AddSomethingToInput.module.css';
import { FILE_ACCEPT, IMAGE_ACCEPT, TEXT_EXTENSIONS } from '@/lib/files/input';

export default function AddSomethingToInput({ onImageSelect, onImageBlocked, isImageBlocked = false, onFileSelect, fileLimits, limitsStatus, onRetryLimits }: {
  onImageSelect: (files: File[]) => void;
  onImageBlocked?: () => void;
  isImageBlocked?: boolean;
  onFileSelect: (files: File[]) => void;
  fileLimits: FileLimits | null;
  limitsStatus: string;
  onRetryLimits: () => void;
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
  return <div className={styles.menu} onMouseEnter={cancelClose} onMouseLeave={() => { cancelClose(); if (!pinned) timer.current = setTimeout(() => setInfo(false), 250); }} onKeyDown={event => {
    if (event.key === 'Escape' && info) { event.stopPropagation(); close(); infoButton.current?.focus(); }
  }}>
    <input ref={imageInput} type="file" accept={IMAGE_ACCEPT} multiple hidden onChange={e => select(e, true)} />
    <input ref={fileInput} type="file" accept={FILE_ACCEPT} multiple hidden onChange={e => select(e, false)} />
    <div className={styles.fileRow}>
      <button type="button" className={styles.item} onClick={() => fileInput.current?.click()}>
        <svg className={styles.icon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><path d="m8 12 6-6a3 3 0 0 1 4 4l-8 8a5 5 0 0 1-7-7l9-9"/><path d="m7 13 7-7"/></svg><span><strong>Add files</strong><small>ZIP, PDF, DOCX, XLSX, text, code, images</small></span>
      </button>
      <div className={styles.infoTrigger} onMouseEnter={() => { cancelClose(); setInfo(true); }}>
        <button ref={infoButton} type="button" className={styles.infoButton} aria-label="Supported files, limits and pricing" aria-expanded={info} aria-controls={id}
          onClick={() => { cancelClose(); if (pinned) close(); else { setPinned(true); setInfo(true); } }}>ⓘ</button>
      </div>
    </div>
    <button type="button" className={styles.item} onClick={() => isImageBlocked ? onImageBlocked?.() : imageInput.current?.click()}>
      <svg className={styles.icon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8" cy="8" r="1.5"/><path d="m4 18 5-5 4 4 3-4 5 5"/></svg>
      <span><strong>Add image</strong><small>PNG, JPG, WEBP</small></span>
    </button>
    <p className={styles.footer}>Attachment content counts toward request cost.</p>
    {info && <section id={id} className={styles.infoPanel} aria-label="Attachment guide" onFocusCapture={() => { cancelClose(); setPinned(true); }} onMouseEnter={cancelClose}>
      <header><strong>Files you can use</strong><button type="button" aria-label="Close attachment guide" onClick={() => { close(); infoButton.current?.focus(); }}>×</button></header>
      <div className={styles.infoBody} tabIndex={0}>
        <h3>Current file limits</h3>
        <LiveFileLimits limits={fileLimits} status={limitsStatus} retry={onRetryLimits} />
        <h3>Supported formats</h3>
        <p><b>Images:</b> PNG, JPG/JPEG, WEBP.</p>
        <p><b>Documents & spreadsheets:</b> PDF, DOCX, XLSX.</p>
        <p><b>Text & data:</b> TXT, MD, CSV, TSV, JSON, XML, YAML/YML, LOG.</p>
        <p><b>Code:</b> {TEXT_EXTENSIONS.filter(ext => !['txt', 'md', 'csv', 'tsv', 'json', 'xml', 'yaml', 'yml', 'log'].includes(ext)).join(', ').toUpperCase()}.</p>
        <h3>ZIP archives</h3>
        <p>Add a ZIP using the same Add files button. Ask naturally: “Compare the documents in this ZIP” or “Create the results as a ZIP with a report and CSV”. No format selector is required.</p>
        {fileLimits && <p><b>Reading a ZIP:</b> up to {formatLimit(fileLimits.processing.zip.inputBytes)} compressed, {fileLimits.processing.zip.entries} files, {fileLimits.processing.zip.records} entries including folders, {formatLimit(fileLimits.processing.zip.entryBytes)} per expanded file and {formatLimit(fileLimits.processing.zip.expandedBytes)} expanded in total. Text/code files also have the {formatLimit(fileLimits.processing.text.maxBytes)} reading limit. Extracted ZIP content, paths and notes must fit within {formatLimit(fileLimits.processing.zip.textBytes)} and share the conversation’s attachment budget. Individual reader opt-outs still apply inside ZIP.</p>}
        <p>Supported inside ZIP: the text/code formats listed above, DOCX, XLSX, PDF and PNG/JPG/WEBP. Images are read as OCR text only; the model does not see their visual content. At most two files requiring OCR and ten recognized pages per archive. Existing PDF and Office limits still apply.</p>
        <p>Password-protected archives, ZIP64, symbolic links, unsafe or duplicate paths, nested archives and unsupported files are rejected. Nothing is silently omitted, except macOS metadata (.DS_Store and __MACOSX), which is marked as ignored. Filenames must use UTF-8.</p>
        <p><b>Output:</b> one ZIP with up to ten generated text/code, SVG, PDF, DOCX or XLSX files. It cannot contain generated photos, audio or video. Preview lists paths and sizes; Download saves the full archive.</p>
        <p>Preparation is private and may take longer with scans. If it is still running, send again after a short wait; the uploaded file is reused. Prepared content is cached and included in context and pricing like other attachments. ZIP contents and scripts are never executed.</p>
        <p>Additional complexity limits apply: PDF up to 50 physical pages; XLSX up to 20 sheets and 10,000 stored cells, including formatted empty cells. Larger files may fit storage but still need splitting before chat reading.</p>
        <h3>What you can ask</h3>
        <p>Read or transcribe text, summarize, translate, compare, find values, explain code, or create a new file from the attached content. Add a message describing what you need.</p>
        <h3>Getting the full text</h3>
        <p>Text is extracted automatically when you send a supported attachment. You do not need to type “OCR” or “recognize” or choose a language.</p>
        <p>For a transcription, try: “Copy all the document text here, page by page, without summarizing. Preserve names, dates and numbers as supplied. Do not guess unclear characters.” For a summary, ask for a summary instead.</p>
        <p>The chat reply is generated by your selected model from the extracted text. Models may shorten or change it; a reply is not a certified copy of the original. Check that all requested pages and details are present. If a reply is marked as partial, ask to continue from the indicated passage.</p>
        <h3>Reading documents</h3>
        <p><b>PDF:</b> extracted text with physical page numbers (page 1, 2, etc.), which may differ from printed page labels. Layout, columns and tables may read in a different order. Embedded images and diagrams on text-layer pages, annotations and form values are not read.</p>
        <p>Pages without readable text are processed with OCR and marked with their page numbers. Existing text layers are preserved. Images embedded on a page with a readable text layer are not additionally recognized. A PDF with no readable text after OCR is rejected.</p>
        <p>For scans, use clear, upright pages. For protected PDFs, use an unencrypted copy you are authorized to use. Split documents that exceed the page, file-size or extracted-text limits.</p>
        <p><b>DOCX:</b> main document text and table cells in source order. Images, drawings, headers, footers, footnotes, comments and deleted revisions are not read; original page layout is not preserved.</p>
        <p><b>XLSX:</b> sheet names, cell addresses and stored values. Hidden sheets, rows and cells are included. Formulas are read as text, never executed; saved results can be stale or missing. Dates may be passed as Excel serial numbers with their number format and date system. Charts and images are not read.</p>
        <p>Encrypted, macro-enabled or damaged documents, embedded objects and external data sources are not supported. Uploaded PDF/DOCX/XLSX files can be downloaded; their preview is not available yet. Generated Office files keep their existing previews.</p>
        <h3>Saved recognized text</h3>
        <p>Open a file’s Preview → Recognized text to read its saved extraction page by page, copy all text or download a TXT. These actions do not call the AI model, repeat recognition or add a token charge. The saved text includes recognition notes and may contain OCR errors; compare important details with the original. If no saved extraction exists yet, send the file in a message first.</p>
        <h3>Calculations and file processing</h3>
        <p>Ask for calculations, data analysis, tables or charts in your own words. When available for the selected model, Python can be used automatically — no special command or language selection is needed.</p>
        <p>For example: “Create an XLSX table of numbers and their squares, and a PNG chart.” Download finished files from the response cards. Saved files remain available when you reopen the chat.</p>
        <p>Python runs in an isolated environment without internet access. Only files selected for the task are provided to it; uploading code does not automatically execute it. Time, memory, execution and cost limits apply. Large tasks may need to be split into smaller requests.</p>
        <p>If a calculation stops, only completed results and attached files are available. Model calls used for the task count toward its cost; sending a new request may incur additional charges. Check important results.</p>
        <p>You can also drag one or several files onto the message field. Review the attachments and enter your request before sending. Folders must be packaged as ZIP files first.</p>
        <h3>Text recognition (OCR)</h3>
        <p>Scanned PDFs and static PNG, JPG/JPEG and WEBP images are recognized automatically before your message is sent. No language selection is required. Original images are uploaded without automatic compression; the server may resize them for recognition.</p>
        <p>The current OCR file, page and text limits are shown above. Images must also fit within 16 million pixels with no side over 10,000 pixels. Animated images are not supported.</p>
        <p>Automatic recognition uses 33 writing-system models: Arabic, Armenian, Bengali, Canadian Aboriginal, Cherokee, Cyrillic, Devanagari, Ethiopic, Fraktur, Georgian, Greek, Gujarati, Gurmukhi, simplified and traditional Han, Hangul, Hebrew, Japanese, Kannada, Khmer, Lao, Latin, Malayalam, Myanmar, Oriya, Sinhala, Syriac, Tamil, Telugu, Thaana, Thai, Tibetan and Vietnamese.</p>
        <p>This covers many languages, not every language or handwriting style. The dominant writing system is detected per page; short text, mixed scripts, rotated or vertical text and unclear scans may be inaccurate. We show a warning when detection is uncertain. OCR can also mix up line order, drop characters or add digits, especially in small print, tables, stamps and handwriting. A warning is not a guarantee that every error was detected. Always verify names, dates, identifiers, quantities and amounts against the original.</p>
        {fileLimits?.preparation?.async && <p>Background recognition shows “Waiting for recognition…” while queued, then “Recognizing text…”. You can cancel before sending. Refreshing this tab does not cancel the server job: reopen the same chat and choose “Continue and send” to reuse the uploaded files. For PDFs with page checkpoints, completed pages are reused when you continue; an unfinished page may be processed again. Nothing is sent to the model automatically after a reload. Recovery is limited to this browser tab and account, for up to 24 hours or until the files expire. Keep the tab open while the initial uploads finish.</p>}
        <p>A recognition attempt can take up to about 55 seconds per page. Multi-page PDFs, retries and queue waiting can take several minutes. If it fails, your draft is kept: send again to retry with the same uploaded files. Removing and adding a file again starts a new upload. Recognition can be disabled for individual models by the service.</p>
        <h3>Reading & privacy</h3>
        <p>Text must use UTF-8. Code, HTML and spreadsheet formulas are not executed. OCR runs privately on our server. Recognized text is sent to the selected AI provider for your request; images are also sent when the model supports vision. Saved files are private to your account.</p>
        <p>DOC, XLS, DOCM/XLSM, PPT/PPTX and SVG cannot be read as attachments yet. Some of these can already be created as results.</p>
        <h3>Context & pricing</h3>
        <p>Earlier attachments can be included again within the last 20 messages and count toward cost again. Files outside that window are not automatically remembered.</p>
        <p>Recognized text and page markers count toward the token reserve and model usage, including when reused from chat history. There is no separate external OCR API charge. A token reserve is held before sending and may exceed the final charge. Final billing follows model usage; unused reserve is released. Limits and availability are checked again by the server.</p>
      </div>
    </section>}
  </div>;
}
