export type Computation = { kind?: 'document'; status: 'completed' | 'partial'; runs: number; executionMs: number; reason: string | null };
export type DocumentJobProgress = {state: 'queued' | 'running' | 'finalizing'; processed: number; total: number; chunks: number; restarts: number};
export type ComputationStatus = { kind?: 'document'; stage: 'preparing' | 'executing' | 'computed' | 'answering'; runs: number; calls: number; job?: DocumentJobProgress };
// Match the backend's absolute DTO ceilings, not its current environment settings.
const MAX_RUNS = 24;
const MAX_CALLS = 32;
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const count = (v: unknown, max: number): v is number => typeof v === 'number' && Number.isSafeInteger(v) && v >= 0 && v <= max;
export function readComputation(v: unknown): Computation | null {
  if (!object(v) || (v.status !== 'completed' && v.status !== 'partial') || !count(v.runs, MAX_RUNS) || !count(v.executionMs, 600000)) return null;
  return { ...(v.kind === 'document' ? {kind: 'document' as const} : {}), status: v.status, runs: v.runs, executionMs: v.executionMs, reason: typeof v.reason === 'string' && /^[A-Z_]{1,64}$/.test(v.reason) ? v.reason : null };
}
export function readComputationStatus(v: unknown): ComputationStatus | null {
  if (!object(v) || !['preparing', 'executing', 'computed', 'answering'].includes(String(v.stage)) || !count(v.runs, MAX_RUNS) || !count(v.calls, MAX_CALLS)) return null;
  const j = v.job;
  const job = object(j) && ['queued','running','finalizing'].includes(String(j.state)) && count(j.processed,1048576) && count(j.total,1048576) && j.processed <= j.total && count(j.chunks,1048576) && count(j.restarts,10000)
    ? {state:j.state as DocumentJobProgress['state'],processed:j.processed,total:j.total,chunks:j.chunks,restarts:j.restarts} : undefined;
  return { ...(job ? {job} : {}), ...(v.kind === 'document' ? {kind: 'document' as const} : {}), stage: v.stage as ComputationStatus['stage'], runs: v.runs, calls: v.calls };
}
export const computationStageLabel = (stage: ComputationStatus['stage']) => ({ preparing: 'Preparing calculation…', executing: 'Running Python…', computed: 'Preparing results…', answering: 'Preparing response…' })[stage];
export const documentStageLabel = (stage: ComputationStatus['stage']) => ({ preparing: 'Preparing document…', executing: 'Inspecting or editing document…', computed: 'Preparing document results…', answering: 'Preparing response…' })[stage];
export function computationExplanation(reason: string | null, document = false): string {
  if (document) {
    switch (reason) {
      case 'USER_CANCELLED': return 'Processing was cancelled. Your original file is unchanged.';
      case 'XLSX_UNSUPPORTED': case 'XLSX_INVALID_DOCUMENT': return 'This workbook contains unsupported or invalid Excel features.';
      case 'XLSX_FILE_LIMIT': case 'XLSX_RESOURCE_LIMIT': case 'OFFICE_DOCUMENT_LIMIT': return 'This workbook exceeds the processing size or memory limit.';
      case 'XLSX_SOURCE_CHANGED': case 'XLSX_INSPECTION_REQUIRED': return 'The workbook must be inspected again before editing.';
      case 'DOCUMENT_JOB_EXPIRED': return 'The background job reached its recovery deadline. Your original file is unchanged.';
      case 'DOCUMENT_WORKER_CRASH': case 'DOCUMENT_JOB_TIMEOUT': case 'DOCUMENT_JOB_FAILED': return 'Background processing could not finish after recovery attempts. Your original file is unchanged.';
      case 'FILE_QUOTA_EXCEEDED': return 'There is not enough file storage to finish this copy.';
      case 'FILE_NOT_FOUND': return 'The source file was deleted or expired before processing finished.';
      case 'COMPUTE_BUDGET_LIMIT': return 'Document processing stopped because the next step would exceed its cost limit.';
      case 'DOCX_EDIT_UNSUPPORTED': return 'This document contains features that this editing mode cannot safely preserve.';
      case 'DOCX_SOURCE_CHANGED': case 'DOCX_INSPECTION_REQUIRED': return 'The document must be inspected again before these changes can be applied.';
      case 'DOCX_VERIFICATION_FAILED': return 'The edited document did not pass its structural checks.';
      case 'DOCX_PROCESSING_TIMEOUT': case 'COMPUTE_TIMEOUT': case 'COMPUTE_RUN_LIMIT': case 'COMPUTE_CALL_LIMIT': return 'Document processing reached its time or step limit.';
      case 'DOCX_PROCESSING_BUSY': return 'Document processing is temporarily busy. Try again later.';
      case 'DOCX_EDIT_FILE_LIMIT': return 'This editing mode supports DOCX files up to 5 MiB.';
      case 'DOCX_NEW_FILENAME_REQUIRED': return 'The edited copy needs a different filename to preserve its source.';
    }
  }
  switch (reason) {
    case 'COMPUTE_BUDGET_LIMIT': return 'The calculation reached its cost limit. Try a smaller task or fewer files.';
    case 'COMPUTE_TIMEOUT': case 'COMPUTE_RUN_LIMIT': case 'COMPUTE_CALL_LIMIT': return 'The calculation reached its time or step limit. Split the task into smaller parts.';
    case 'COMPUTE_CONTEXT_LIMIT': case 'COMPUTE_OUTPUT_LIMIT': return 'There was too much data to process or export in one task. Try fewer files or a smaller result.';
    case 'COMPUTE_ABORTED': case 'PROCESS_INTERRUPTED': return 'The calculation was interrupted. Review any available results before sending a new request.';
    case 'INSUFFICIENT_BALANCE': case 'BALANCE_LIMIT_EXCEEDED': return 'There was not enough available balance to continue. Check your balance before sending a new request.';
    default: return 'The calculation could not finish. Try simplifying the task or sending a new request later.';
  }
}
export function withoutComputationNotice(content: string, result?: Computation | null): string {
  if (result?.status !== 'partial' || !result.reason) return content;
  const exact = `Calculation stopped (${result.reason}). Only successfully completed computations and attached files are available; the task may be incomplete.`;
  return content === exact ? '' : content;
}
