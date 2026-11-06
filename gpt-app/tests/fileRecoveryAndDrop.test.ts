import test from 'node:test';
import assert from 'node:assert/strict';
import { isFileDrag, droppedFiles } from '../lib/files/drop';
import { checkSavedPreparation, prepareInBackground, type BackgroundPreparation } from '../lib/files/backgroundPreparation';
import { cannotResumePreparation } from '../lib/files/preparationFailure';

test('native file drops preserve all File identities; text and URLs are not file drops', () => {
  assert.equal(isFileDrag({types:['Files']}),true);
  assert.equal(isFileDrag({types:['text/plain','text/uri-list']}),false);
  const files=[new File(['a'],'a.pdf'),new File(['b'],'b.txt')];
  const transfer={files,items:[]} as unknown as DataTransfer;
  assert.deepEqual(droppedFiles(transfer),files);
  assert.equal(droppedFiles(transfer)[0],files[0]);
  assert.throws(()=>droppedFiles({files:[],items:[]} as unknown as DataTransfer),/No readable/);
  assert.throws(()=>droppedFiles({files,items:[{kind:'file',webkitGetAsEntry:()=>({isDirectory:true})}]} as unknown as DataTransfer),/Folders/);
});

test('permanent preparation failure retains structured status for checkpoint cleanup', async () => {
  for (const code of ['PDF_PAGE_LIMIT','OCR_PAGE_LIMIT']) {
    const failed: BackgroundPreparation={status:'failed',attempts:1,retryable:false,error:code};
    await assert.rejects(prepareInBackground({get:async()=>failed,start:async()=>{assert.fail('no retry');},progress:()=>{},signal:new AbortController().signal}),cannotResumePreparation);
    await assert.rejects(checkSavedPreparation(['saved-file'],async()=>failed),cannotResumePreparation);
  }
});

test('recovery checks all files and retains queued, ready, cancelled/retryable and offline drafts', async () => {
  const states: BackgroundPreparation[]=[{status:'queued',attempts:1,pollAfterMs:2000},{status:'not_required'},{status:'cancelled',attempts:1,retryable:true}];
  let calls=0;
  await checkSavedPreparation(['a','b','c'],async()=>{calls++;return states.shift()!;});
  assert.equal(calls,3);
  assert.equal(cannotResumePreparation(new Error('offline')),false);
  assert.equal(cannotResumePreparation({response:{data:{error:'OCR_PROCESSING_TIMEOUT'}}}),false);
  assert.equal(cannotResumePreparation({response:{data:{error:'PDF_PAGE_LIMIT'}}}),true);
  assert.equal(cannotResumePreparation({response:{data:{error:'FILE_UNAVAILABLE'}}}),false);
});
