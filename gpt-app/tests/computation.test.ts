import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readComputation, readComputationStatus, withoutComputationNotice, computationExplanation } from '../lib/computation/status.js';
test('computation metadata validates counters and remains optional for legacy messages', () => {
 assert.equal(readComputation(undefined), null);
 assert.equal(readComputationStatus({stage:'unknown',runs:0,calls:0}), null);
 assert.equal(readComputationStatus({stage:'executing',runs:-1,calls:0}), null);
 assert.deepEqual(readComputationStatus({stage:'answering',runs:1,calls:1}),{stage:'answering',runs:1,calls:1});
 assert.equal(readComputation({status:'completed',runs:25,executionMs:0}),null);
 assert.deepEqual(readComputation({status:'partial',runs:0,executionMs:0,reason:'COMPUTE_BUDGET_LIMIT',secret:'ignore'}),{status:'partial',runs:0,executionMs:0,reason:'COMPUTE_BUDGET_LIMIT'});
});
test('only exact structured server notices are replaced; model content remains intact',()=>{
 const result=readComputation({status:'partial',runs:0,executionMs:0,reason:'COMPUTE_BUDGET_LIMIT'})!;
 const text='Calculation stopped (COMPUTE_BUDGET_LIMIT). Only successfully completed computations and attached files are available; the task may be incomplete.';
 assert.equal(withoutComputationNotice(text,result),'');
 assert.equal(withoutComputationNotice(text,null),text);
 assert.equal(withoutComputationNotice(text+' Additional result',result),text+' Additional result');
 assert.equal(withoutComputationNotice(text,{...result,status:'completed'}),text);
 assert.match(computationExplanation(result.reason),/cost limit/);
 assert.doesNotMatch(computationExplanation('UNKNOWN_CODE'),/UNKNOWN_CODE/);
});

test('document metadata survives history parsing without claiming Python execution',()=>{
 const result=readComputation({kind:'document',status:'completed',runs:2,executionMs:120,reason:null})!;
 assert.equal(result.kind,'document');
 assert.equal(readComputationStatus({kind:'document',stage:'executing',runs:1,calls:0})?.kind,'document');
 assert.match(computationExplanation('COMPUTE_BUDGET_LIMIT',true),/next step/);
 assert.equal(readComputation({...result,kind:'untrusted'})?.kind,undefined);
});


test('background progress is bounded, survives status parsing and never exposes worker identifiers',()=>{
 const job={state:'running',processed:3500,total:10000,chunks:7,restarts:1,leaseToken:'secret',id:'private'};
 const status=readComputationStatus({kind:'document',stage:'executing',runs:2,calls:1,job});
 assert.deepEqual(status?.job,{state:'running',processed:3500,total:10000,chunks:7,restarts:1});
 assert.equal(readComputationStatus({stage:'executing',runs:2,calls:1,job:{...job,processed:10001}})?.job,undefined);
 assert.match(computationExplanation('USER_CANCELLED',true),/cancelled/);
});


test('expanded computation counters preserve partial notices and background progress',()=>{
 const result=readComputation({kind:'document',status:'partial',runs:12,executionMs:300000,reason:'COMPUTE_BUDGET_LIMIT'});
 assert.equal(result?.runs,12);assert.equal(result?.reason,'COMPUTE_BUDGET_LIMIT');
 const status=readComputationStatus({kind:'document',stage:'executing',runs:12,calls:16,job:{state:'running',processed:5000,total:10000,chunks:10,restarts:0}});
 assert.equal(status?.runs,12);assert.equal(status?.calls,16);assert.equal(status?.job?.processed,5000);
 assert.equal(readComputationStatus({stage:'executing',runs:24,calls:32})?.calls,32);
 for(const calls of [33,-1,1.5,Infinity])assert.equal(readComputationStatus({stage:'executing',runs:1,calls}),null);
 assert.equal(readComputation({status:'completed',runs:24,executionMs:600000})?.runs,24);
});
