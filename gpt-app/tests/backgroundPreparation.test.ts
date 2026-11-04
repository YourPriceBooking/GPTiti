import test from 'node:test';
import assert from 'node:assert/strict';
import { prepareInBackground, readBackgroundPreparation, waitForPoll, type BackgroundPreparation } from '../lib/files/backgroundPreparation';
import { encodePreparationDraft, readPreparationDraft, type PreparationDraft } from '../lib/files/preparationDraft';
import { AttachmentPreparation } from '../lib/files/preparation';
const ready = {status: 'ready', method: 'local_ocr', ocrPages: 1, textBytes: 20, scripts: ['Latin'], uncertain: true} as const;
const result = (): BackgroundPreparation => ({...ready, scripts: ['Latin']});
const signal = () => new AbortController().signal;
const queued: BackgroundPreparation = {status: 'queued', attempts: 0, pollAfterMs: 2000};
const noop = () => {};
test('background DTO validates terminal states, attempts, polling and ready content', () => {
  for (const p of [queued, {status: 'failed', attempts: 1, retryable: true, error: 'OCR_FAILED'}, {status:'cancelled', attempts:3, retryable:false}]) {
    assert.equal(readBackgroundPreparation({success:true, processing:{...p,method:'local_ocr'}}).status,p.status);
  }
  assert.equal(readBackgroundPreparation({success:true,processing:ready}).status,'ready');
  for (const p of [{...queued,pollAfterMs:0},{...queued,attempts:4},{status:'failed',attempts:1,retryable:true,error:'<script>'},{...ready,textBytes:Infinity},{status:'done'}]) {
    assert.throws(() => readBackgroundPreparation({success:true,processing:{method:'local_ocr',...p}}));
  }
});
test('queued and running poll serially and only ready permits completion', async () => {
  const events: string[] = [];
  const states: BackgroundPreparation[] = [{status:'not_started'}, {...queued,status:'running'}, result()];
  const out = await prepareInBackground({signal:signal(),get:async()=>{events.push('get');return states.shift()!;},
    start:async retry=>{assert.equal(retry,false);events.push('start');return queued;},
    progress:p=>events.push(p),wait:async ms=>{assert.equal(ms,2000);events.push('wait');}});
  assert.equal(out.status,'ready');
  assert.deepEqual(events,['get','start','queued','wait','get','recognizing','wait','get']);
});
test('saved running or ready job is reused without POST or a new upload', async () => {
  for (const state of [queued,result()]) {
    let calls=0;
    const out=await prepareInBackground({signal:signal(),get:async()=>++calls===1?state:result(),start:async()=>{throw new Error('must not enqueue');},progress:noop,wait:async()=>{}});
    assert.equal(out.status,'ready');
  }
});
test('explicit retry requeues once; another failure never automatically retries', async () => {
  let starts=0;
  const failed: BackgroundPreparation={status:'failed',attempts:1,error:'OCR_FAILED',retryable:true};
  await assert.rejects(prepareInBackground({signal:signal(),get:async()=>failed,start:async retry=>{assert.equal(retry,true);starts++;return failed;},progress:noop}),/without uploading/);
  assert.equal(starts,1);
  await assert.rejects(prepareInBackground({signal:signal(),get:async()=>({...failed,retryable:false}),start:async()=>{starts++;return result();},progress:noop}),/unavailable/);
  assert.equal(starts,1);
});
test('abort during polling prevents completion; abortable waiting stops promptly', async () => {
  const c=new AbortController(); let gets=0;
  await assert.rejects(prepareInBackground({signal:c.signal,get:async()=>{gets++;return queued;},start:async()=>queued,progress:noop,wait:async()=>c.abort()}));
  assert.equal(gets,1);
  const c2=new AbortController();const waiting=waitForPoll(30000,c2.signal);c2.abort();await assert.rejects(waiting);
});
test('network failure preserves the server job and does not enqueue blindly', async () => {
  await assert.rejects(prepareInBackground({signal:signal(),get:async()=>{throw new Error('offline');},start:async()=>{assert.fail('no retry POST');},progress:noop}),/offline/);
});
const draft = (): PreparationDraft => ({clientMessageId:'11111111-1111-4111-8111-111111111111',owner:'owner-a',conversationId:'b'.repeat(24),modelId:'model-a',text:'Read this',createdAt:Date.now(),files:[{
  fileId:'a'.repeat(24),originalName:'scan.pdf',mimetype:'application/pdf',size:100,expiresAt:null,url:'https://untrusted.example/file',
}]});
test('reload checkpoint strips URLs, validates owner, expiry, file IDs and metadata', () => {
  const d=draft(),encoded=encodePreparationDraft(d);
  assert.equal(encoded.includes('untrusted'),false);
  assert.equal(readPreparationDraft(encoded,'owner-a')?.files[0].url,'');
  assert.equal(readPreparationDraft(encoded,'owner-a')?.clientMessageId,d.clientMessageId);
  assert.equal(readPreparationDraft(encoded,'owner-b'),null);
  assert.equal(readPreparationDraft(encoded,'owner-a',d.createdAt+86400001),null);
  for(const changed of [{...d,files:[{...d.files[0],fileId:'../file'}]},{...d,files:[{...d.files[0],size:-1}]},{...d,files:[{...d.files[0],expiresAt:'2000-01-01'}]},{...d,createdAt:Infinity}]) {
    assert.equal(readPreparationDraft(JSON.stringify(changed),'owner-a'),null);
  }
});
test('upload batch retry reuses completed upload identities before OCR starts', async () => {
  const flow=new AttachmentPreparation(), files=[new File(['x'],'a.pdf'),new File(['y'],'b.pdf')];
  let calls=0, fail=true;
  const upload=async(f:File)=>{calls++;if(f.name==='b.pdf'&&fail)throw new Error('offline');return {...draft().files[0],originalName:f.name};};
  await assert.rejects(flow.uploadAll(files,upload,signal(),noop));fail=false;
  assert.equal((await flow.uploadAll(files,upload,signal(),noop)).length,2);
  assert.equal(calls,3);
});

test('page checkpoints survive DTO parsing and are reported after resuming a saved job', async () => {
  const pages={completedPages:12,totalPages:30,ocrPages:30,failedPage:null};
  const running=readBackgroundPreparation({success:true,processing:{...queued,status:'running',method:'local_ocr',progress:pages}});
  let gets=0;
  const reported: unknown[]=[];
  await prepareInBackground({signal:signal(),get:async()=>++gets===1?running:result(),start:async()=>{assert.fail('must reuse job');},
    progress:(phase,p)=>reported.push([phase,p]),wait:async()=>{}});
  assert.deepEqual(reported,[['recognizing',pages]]);
  for(const change of [{completedPages:31},{totalPages:101},{ocrPages:31},{failedPage:0},{failedPage:31},{completedPages:NaN}]){
    assert.throws(()=>readBackgroundPreparation({success:true,processing:{...queued,method:'local_ocr',progress:{...pages,...change}}}));
  }
});
test('ready paged OCR accepts 30 pages and 1 MiB; ZIP bounds remain unchanged', () => {
  assert.equal(readBackgroundPreparation({success:true,processing:{...ready,ocrPages:30,textBytes:1048576}}).status,'ready');
  for(const change of [{ocrPages:31},{textBytes:1048577},{method:'zip',ocrPages:11},{method:'zip',textBytes:131073}])
    assert.throws(()=>readBackgroundPreparation({success:true,processing:{...ready,...change}}));
});

test('explicit Cancel retry keeps saved page progress and starts only once', async () => {
  const pages={completedPages:8,totalPages:30,ocrPages:30,failedPage:9};
  let starts=0,gets=0;
  const reports:unknown[]=[];
  const cancelled=readBackgroundPreparation({success:true,processing:{status:'cancelled',method:'local_ocr',attempts:1,retryable:true,progress:pages}});
  await prepareInBackground({signal:signal(),get:async()=>++gets===1?cancelled:result(),
    start:async retry=>{assert.equal(retry,true);starts++;return {...queued,progress:pages};},
    progress:(_,p)=>reports.push(p),wait:async()=>{}});
  assert.equal(starts,1);
  assert.deepEqual(reports,[pages]);
});
