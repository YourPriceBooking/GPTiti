import { computationExplanation, computationStageLabel, documentStageLabel, type Computation, type ComputationStatus } from '@/lib/computation/status';
import styles from './Computation.module.css';
export function ComputationProgress({ status }: { status: ComputationStatus }) {
  const job = status.job;
  const title = job ? ({queued:'Waiting to process your file…',running:'Processing your spreadsheet…',finalizing:'Checking and saving the result…'})[job.state] : status.kind === 'document' ? documentStageLabel(status.stage) : computationStageLabel(status.stage);
  return <div className={styles.progress} role="status" aria-live="polite"><span className={styles.spinner} aria-hidden="true" /><div><strong>{title}</strong>{job ? <><p>{job.processed.toLocaleString('en-US')} / {job.total.toLocaleString('en-US')} rows processed{job.restarts > 0 ? ' · Resumed from saved progress' : ''}</p><p>You can leave this page. Processing continues in the background.</p></> : <p>Working securely with your data</p>}</div></div>;
}
export function ComputationResult({ result }: { result?: Computation | null }) {
  if (!result) return null;
  if (result.status === 'completed') return <div className={styles.success}><span aria-hidden="true">✓</span> {result.kind === 'document' ? 'Document processing completed' : 'Calculated with Python'}</div>;
  return <div className={styles.notice}><strong>{result.kind === 'document' ? 'Document processing incomplete' : 'Calculation incomplete'}</strong><p>{computationExplanation(result.reason, result.kind === 'document')}</p><p>Only attached files and completed results are available. A new request may incur additional charges.</p>{result.reason && <details><summary>Technical details</summary><code>{result.reason}</code></details>}</div>;
}
