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
        <h3>Supported formats</h3>
        <p><b>Images:</b> PNG, JPG/JPEG, WEBP.</p>
        <p><b>Documents & spreadsheets:</b> PDF, DOCX, XLSX.</p>
        <p><b>Text & data:</b> TXT, MD, CSV, TSV, JSON, XML, YAML/YML, LOG.</p>
        <p><b>Code:</b> {TEXT_EXTENSIONS.filter(ext => !['txt', 'md', 'csv', 'tsv', 'json', 'xml', 'yaml', 'yml', 'log'].includes(ext)).join(', ').toUpperCase()}.</p>
        <h3>ZIP archives</h3>
        <p>Add a ZIP using the same Add files button. Ask naturally: “Compare the documents in this ZIP” or “Create the results as a ZIP with a report and CSV”. No format selector is required.</p>
        <p><b>Input:</b> up to 10 MiB compressed, 20 files, 100 entries including folders, 5 MiB per expanded file and 25 MiB expanded in total. Text/code files still have a 64 KiB limit each. Extracted ZIP content, paths and notes must fit within 128 KiB and share the conversation’s existing 128 KiB attachment budget.</p>
        <p>Supported inside ZIP: the text/code formats listed above, DOCX, XLSX, PDF and PNG/JPG/WEBP. Images are read as OCR text only; the model does not see their visual content. At most two files requiring OCR and ten recognized pages per archive. Existing PDF and Office limits still apply.</p>
        <p>Password-protected archives, ZIP64, symbolic links, unsafe or duplicate paths, nested archives and unsupported files are rejected. Nothing is silently omitted, except macOS metadata (.DS_Store and __MACOSX), which is marked as ignored. Filenames must use UTF-8.</p>
        <p><b>Output:</b> one ZIP with up to ten generated text/code, SVG, PDF, DOCX or XLSX files. It cannot contain generated photos, audio or video. Preview lists paths and sizes; Download saves the full archive.</p>
        <p>Preparation is private and may take longer with scans. If it is still running, send again after a short wait; the uploaded file is reused. Prepared content is cached and included in context and pricing like other attachments. ZIP contents and scripts are never executed.</p>
        <h3>Size & quantity</h3>
        <ul><li>Up to 10 attachments per message, including images.</li><li>Text: 64 KiB per file. PDF/DOCX/XLSX: 5 MiB per file, up to 64 KiB of extracted text each. The server checks the extracted size.</li><li>Up to 128 KiB of combined text and extracted document content in the request, including earlier attachments still in context. Large content is rejected, not silently cut off.</li><li>PDF: up to 50 pages, including at most 10 pages that need OCR. Scanned pages are recognized automatically.</li><li>XLSX: up to 20 sheets and 10,000 stored cells, including empty cells with formatting. Additional document complexity limits apply.</li><li>{maxImages ? `Selected model: up to ${maxImages} images, up to ${Math.min(5, maxImageSizeMb)} MiB each for OCR.` : 'Images are read as text through OCR for this model; visual understanding is not available.'}</li><li>Up to 25 MiB of attachments per message. The server may enforce a lower configured limit.</li></ul>
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
        <h3>Text recognition (OCR)</h3>
        <p>Scanned PDFs and static PNG, JPG/JPEG and WEBP images are recognized automatically before your message is sent. No language selection is required. Original images are uploaded without automatic compression; the server may resize them for recognition.</p>
        <p>OCR: up to 5 MiB per file, 16 million pixels per image, and no side over 10,000 pixels. Up to 64 KiB of recognized text and page markers per file; the shared 128 KiB context limit still applies. Animated images are not supported.</p>
        <p>Automatic recognition uses 33 writing-system models: Arabic, Armenian, Bengali, Canadian Aboriginal, Cherokee, Cyrillic, Devanagari, Ethiopic, Fraktur, Georgian, Greek, Gujarati, Gurmukhi, simplified and traditional Han, Hangul, Hebrew, Japanese, Kannada, Khmer, Lao, Latin, Malayalam, Myanmar, Oriya, Sinhala, Syriac, Tamil, Telugu, Thaana, Thai, Tibetan and Vietnamese.</p>
        <p>This covers many languages, not every language or handwriting style. The dominant writing system is detected per page; short text, mixed scripts, rotated or vertical text and unclear scans may be inaccurate. We show a warning when detection is uncertain. OCR can also mix up line order, drop characters or add digits, especially in small print, tables, stamps and handwriting. A warning is not a guarantee that every error was detected. Always verify names, dates, identifiers, quantities and amounts against the original.</p>
        <p>Preparation may take up to about 55 seconds per file. If it fails, your draft is kept: send again to retry with the same uploaded files. Removing and adding a file again starts a new upload. Recognition can be disabled for individual models by the service.</p>
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
