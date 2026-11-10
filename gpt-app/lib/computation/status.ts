export type Computation = { kind?: 'document'; status: 'completed' | 'partial'; runs: number; executionMs: number; reason: string | null };
export type ComputationStatus = { kind?: 'document'; stage: 'preparing' | 'executing' | 'computed' | 'answering'; runs: number; calls: number };
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const count = (v: unknown, max: number): v is number => typeof v === 'number' && Number.isSafeInteger(v) && v >= 0 && v <= max;
export function readComputation(v: unknown): Computation | null {
  if (!object(v) || (v.status !== 'completed' && v.status !== 'partial') || !count(v.runs, 5) || !count(v.executionMs, 600000)) return null;
  return { ...(v.kind === 'document' ? {kind: 'document' as const} : {}), status: v.status, runs: v.runs, executionMs: v.executionMs, reason: typeof v.reason === 'string' && /^[A-Z_]{1,64}$/.test(v.reason) ? v.reason : null };
}
export function readComputationStatus(v: unknown): ComputationStatus | null {
  if (!object(v) || !['preparing', 'executing', 'computed', 'answering'].includes(String(v.stage)) || !count(v.runs, 5) || !count(v.calls, 6)) return null;
  return { ...(v.kind === 'document' ? {kind: 'document' as const} : {}), stage: v.stage as ComputationStatus['stage'], runs: v.runs, calls: v.calls };
}
export const computationStageLabel = (stage: ComputationStatus['stage']) => ({ preparing: 'Preparing calculation…', executing: 'Running Python…', computed: 'Preparing results…', answering: 'Preparing response…' })[stage];
export const documentStageLabel = (stage: ComputationStatus['stage']) => ({ preparing: 'Preparing document…', executing: 'Inspecting or editing document…', computed: 'Preparing document results…', answering: 'Preparing response…' })[stage];
export function computationExplanation(reason: string | null, document = false): string {
  if (document) {
    switch (reason) {
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
