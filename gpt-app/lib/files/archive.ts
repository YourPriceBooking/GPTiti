export type ArchivePreview = { kind: 'archive'; entries: {path: string; size: number; status: 'read' | 'created' | 'ignored'; reason?: string}[]; truncated: boolean };
export function readArchivePreview(data: unknown): ArchivePreview | null {
 if (!data || typeof data !== 'object') return null;
 const v=data as Record<string,unknown>;
 if(v.kind!=='archive'||!Array.isArray(v.entries)||v.entries.length>20||typeof v.truncated!=='boolean')return null;
 const entries: ArchivePreview['entries']=[];
 for(const raw of v.entries){
  if(!raw||typeof raw!=='object')return null;
  const e=raw as Record<string,unknown>;
  if(typeof e.path!=='string'||!e.path||e.path.length>240||/[\x00-\x1f\x7f\\]/.test(e.path)||e.path.startsWith('/')||e.path.split('/').some(p=>p==='..'||p==='.')||typeof e.size!=='number'||!Number.isSafeInteger(e.size)||e.size<0||e.size>25*1024**2||!['read','created','ignored'].includes(String(e.status)))return null;
  entries.push({path:e.path,size:e.size,status:e.status as ArchivePreview['entries'][number]['status'],...(typeof e.reason==='string'?{reason:e.reason.slice(0,200)}:{})});
 }
 return {kind:'archive',entries,truncated:v.truncated};
}
