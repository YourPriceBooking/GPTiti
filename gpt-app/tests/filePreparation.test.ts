import test from 'node:test';
import assert from 'node:assert/strict';
import { AttachmentPreparation, readFilePreparation, preparationErrorMessage, OCR_ERROR_CODES, type FilePreparation } from '../lib/files/preparation';
import { readChatSendAck, readChatErrorEvent, readChatStatusAck } from '../lib/chat/chatProtocol';
import type { UploadedFile } from '../types/api.types';
const ready: FilePreparation = {status: 'ready', method: 'local_ocr', ocrPages: 1, textBytes: 100, scripts: ['Arabic'], uncertain: true};
const local = (name = 'scan.pdf') => new File(['pdf'], name, {type: 'application/pdf'});
const uploaded = (f: File, id = 'a'.repeat(24)): UploadedFile => ({fileId: id, url: '', mimetype: f.type, size: f.size, originalName: f.name, expiresAt: null});
const noop = () => {};
test('preparation rejects malformed success and uncertainty; accepts zero OCR pages and not-required', () => {
  assert.deepEqual(readFilePreparation({success: true, processing: ready}), ready);
  assert.deepEqual(readFilePreparation({success: true, processing: {status:'not_required'}}), {status:'not_required'});
  assert.equal(readFilePreparation({success: true, processing: {...ready, ocrPages: 0}}).status, 'ready');
  for (const processing of [{...ready, uncertain: undefined}, {...ready, textBytes: Infinity}, {...ready, ocrPages: 11}, {...ready, scripts: [3]}, {status:'processing'}]) {
    assert.throws(() => readFilePreparation({success: true, processing}));
  }
  assert.throws(() => readFilePreparation({success: false, processing: ready}));
});
test('failed OCR retries the identical upload ID; current model is checked again', async () => {
  const flow = new AttachmentPreparation(), file = local();
  let uploads = 0, attempts = 0;
  const ids: string[] = [], models: string[] = [], warnings: string[] = [];
  const deps = {signal: new AbortController().signal, progress: noop, warning: (n: string) => warnings.push(n),
    upload: async (f: File) => { uploads++; return uploaded(f); },
    prepare: async (id: string, model: string) => { ids.push(id); models.push(model); if (++attempts === 1) throw new Error('busy'); return ready; }};
  await assert.rejects(flow.run([file], 'model-a', deps));
  const result = await flow.run([file], 'model-b', deps);
  assert.equal(uploads, 1); assert.deepEqual(ids, ['a'.repeat(24), 'a'.repeat(24)]);
  assert.deepEqual(models, ['model-a','model-b']); assert.deepEqual(warnings, ['scan.pdf']);
  assert.equal(result[0].fileId, ids[0]);
});
test('partial batch failure preserves uploaded files and processes strictly sequentially', async () => {
  const flow = new AttachmentPreparation(), files = [local('a.pdf'), local('b.pdf')];
  const calls: string[] = []; let fail = true;
  const deps = {signal: new AbortController().signal, progress: noop, warning: noop,
    upload: async (f: File) => { calls.push('upload:'+f.name); return uploaded(f, f.name); },
    prepare: async (id: string) => { calls.push('prepare:'+id); if (id === 'b.pdf' && fail) throw new Error('busy'); return ready; }};
  await assert.rejects(flow.run(files, 'm', deps)); fail = false;
  await flow.run(files, 'm', deps);
  assert.deepEqual(calls, ['upload:a.pdf','prepare:a.pdf','upload:b.pdf','prepare:b.pdf','prepare:a.pdf','prepare:b.pdf']);
});
test('same filename and size never reuse another File object or another session cache', async () => {
  const a = local(), b = local(); let count = 0;
  const deps = {signal: new AbortController().signal, progress: noop, warning: noop,
    upload: async (f: File) => { count++; return uploaded(f); }, prepare: async () => ready};
  await new AttachmentPreparation().run([a,b], 'm', deps);
  await new AttachmentPreparation().run([a], 'm', deps);
  assert.equal(count, 3);
});
test('aborting during OCR prevents further files or successful admission', async () => {
  const controller = new AbortController(); let uploads = 0, warnings = 0;
  await assert.rejects(new AttachmentPreparation().run([local(),local()], 'm', {
    signal: controller.signal, progress: noop, warning: () => warnings++,
    upload: async f => { uploads++; return uploaded(f); },
    prepare: async () => { controller.abort(); return ready; },
  }));
  assert.equal(uploads, 1); assert.equal(warnings, 0);
});
test('text and Office uploads bypass OCR; not-required preserves the normal flow', async () => {
  const files = [new File(['text'], 'x.txt', {type:'text/plain'}), new File(['zip'], 'x.docx', {type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}), local()];
  let preparations = 0, warnings = 0;
  const result = await new AttachmentPreparation().run(files, 'm', {
    signal: new AbortController().signal, progress: noop, warning: () => warnings++,
    upload: async f => uploaded(f), prepare: async () => { preparations++; return {status:'not_required'}; },
  });
  assert.equal(result.length, 3); assert.equal(preparations, 1); assert.equal(warnings, 0);
});
test('HTTP OCR codes override generic Axios errors and network retries explain reuse', () => {
  for (const code of OCR_ERROR_CODES) assert.notEqual(preparationErrorMessage({message:'Request failed',response:{data:{error:code}}}), 'Request failed');
  assert.match(preparationErrorMessage({code:'ECONNABORTED'}), /reused/);
  assert.match(preparationErrorMessage({response:{data:{error:'FILE_NOT_FOUND'}}}), /attach the file again/);
});
test('all OCR and quota codes survive V2 ACK, event and status parsing', () => {
  const ids = {turnId:'11111111-1111-4111-8111-111111111111',clientMessageId:'22222222-2222-4222-8222-222222222222',conversationId:'a'.repeat(24),attempt:1};
  for (const code of OCR_ERROR_CODES) {
    const error = {code, message:'Server explanation', retryable:['OCR_NOT_READY','OCR_PROCESSING_BUSY'].includes(code)};
    const ack = readChatSendAck({ok:false, protocolVersion:2,error});
    assert.ok(ack && !ack.ok); assert.deepEqual(ack.error,error);
    assert.deepEqual(readChatErrorEvent({...ids,protocolVersion:2,event:'chat:error',type:'failed',payload:{error}})?.payload.error,error);
    const status = readChatStatusAck({ok:true,protocolVersion:2,turn:{...ids,status:'failed',lastSeq:0,partialContent:'',assistantMessage:null,billing:null,createdAt:'2026-10-18T00:00:00Z',updatedAt:'2026-10-18T00:00:00Z',error}});
    assert.ok(status?.ok); assert.deepEqual(status.turn.error,error);
  }
});
