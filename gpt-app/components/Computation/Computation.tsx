import { computationExplanation, computationStageLabel, documentStageLabel, type Computation, type ComputationStatus } from '@/lib/computation/status';
import styles from './Computation.module.css';
export function ComputationProgress({ status }: { status: ComputationStatus }) {
  return <div className={styles.progress} role="status" aria-live="polite"><span className={styles.spinner} aria-hidden="true" /><div><strong>{status.kind === 'document' ? documentStageLabel(status.stage) : computationStageLabel(status.stage)}</strong><p>Working securely with your data</p></div></div>;
}
export function ComputationResult({ result }: { result?: Computation | null }) {
  if (!result) return null;
  if (result.status === 'completed') return <div className={styles.success}><span aria-hidden="true">✓</span> {result.kind === 'document' ? 'Document processing completed' : 'Calculated with Python'}</div>;
  return <div className={styles.notice}><strong>{result.kind === 'document' ? 'Document processing incomplete' : 'Calculation incomplete'}</strong><p>{computationExplanation(result.reason, result.kind === 'document')}</p><p>Only attached files and completed results are available. A new request may incur additional charges.</p>{result.reason && <details><summary>Technical details</summary><code>{result.reason}</code></details>}</div>;
}
