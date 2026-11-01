export type Computation = { status: 'completed' | 'partial'; runs: number; executionMs: number; reason: string | null };
export type ComputationStatus = { stage: 'preparing' | 'executing' | 'computed' | 'answering'; runs: number; calls: number };
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const count = (v: unknown, max: number): v is number => typeof v === 'number' && Number.isSafeInteger(v) && v >= 0 && v <= max;
export function readComputation(v: unknown): Computation | null {
  if (!object(v) || (v.status !== 'completed' && v.status !== 'partial') || !count(v.runs, 5) || !count(v.executionMs, 600000)) return null;
  return { status: v.status, runs: v.runs, executionMs: v.executionMs, reason: typeof v.reason === 'string' && /^[A-Z_]{1,64}$/.test(v.reason) ? v.reason : null };
}
export function readComputationStatus(v: unknown): ComputationStatus | null {
  if (!object(v) || !['preparing', 'executing', 'computed', 'answering'].includes(String(v.stage)) || !count(v.runs, 5) || !count(v.calls, 6)) return null;
  return { stage: v.stage as ComputationStatus['stage'], runs: v.runs, calls: v.calls };
}
export const computationStageLabel = (stage: ComputationStatus['stage']) => ({ preparing: 'Preparing calculation…', executing: 'Running Python…', computed: 'Preparing results…', answering: 'Preparing response…' })[stage];
export function computationExplanation(reason: string | null): string {
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
