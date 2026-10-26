import test from 'node:test';
import assert from 'node:assert/strict';
import {FILE_ACCEPT,inputKind,validateInputFiles} from '../lib/files/input';
import {readArchivePreview} from '../lib/files/archive';
import {AttachmentPreparation,readFilePreparation,preparationErrorMessage} from '../lib/files/preparation';
import type {UploadedFile} from '../types/api.types';
test('ZIP uses Add files and its own compressed limit',()=>{
 assert.ok(FILE_ACCEPT.split(',').includes('.zip'));assert.equal(inputKind({name:'folder.ZIP',size:100}),'zip');
 const limits={maxImages:0,maxImageSizeMb:5};assert.equal(validateInputFiles([{name:'archive.zip',size:8*1024**2}],limits),null);
 assert.match(validateInputFiles([{name:'archive.zip',size:11*1024**2}],limits)!,/10 MiB/);
});
test('archive preview validates bounded metadata, strips content, rejects unsafe paths',()=>{
 const preview=readArchivePreview({kind:'archive',entries:[{path:'звіт/data.csv',size:42,status:'read',content:'PRIVATE'}],truncated:false});
 assert.equal(preview?.entries[0].path,'звіт/data.csv');assert.equal(JSON.stringify(preview).includes('PRIVATE'),false);
 for(const path of ['../secret','/etc/passwd','a\\b'])assert.equal(readArchivePreview({kind:'archive',entries:[{path,size:1,status:'read'}],truncated:false}),null);
});
test('ZIP preparation supports larger extracted metadata without changing OCR limits',()=>{
 const response={success:true,processing:{status:'ready',method:'zip',ocrPages:0,textBytes:100000,scripts:[],uncertain:false}};
 assert.equal(readFilePreparation(response).status,'ready');assert.throws(()=>readFilePreparation({...response,processing:{...response.processing,method:'local_ocr'}}));
 assert.match(preparationErrorMessage({response:{data:{error:'ZIP_NOT_READY'}}}),/reused/);
});
test('preparation retry reuses ZIP upload and reports unpacking',async()=>{
 const preparation=new AttachmentPreparation(),file=new File(['zip'],'docs.zip',{type:'application/zip'});let uploads=0,prepares=0;const phases:string[]=[];
 const deps={upload:async()=>{uploads++;return {fileId:'507f1f77bcf86cd799439011',mimetype:'application/zip'} as UploadedFile;},
 prepare:async()=>{if(++prepares===1)throw new Error('still preparing');return {status:'ready' as const,method:'zip' as const,ocrPages:0,textBytes:10,scripts:[],uncertain:false};},
 progress:(p:{phase:string})=>{phases.push(p.phase);},warning:()=>{},signal:new AbortController().signal};
 await assert.rejects(preparation.run([file],'m',deps));await preparation.run([file],'m',deps);assert.equal(uploads,1);assert.equal(prepares,2);assert.ok(phases.includes('unpacking'));
});
