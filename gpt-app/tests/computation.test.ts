import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readComputation, readComputationStatus, withoutComputationNotice, computationExplanation } from '../lib/computation/status.js';
test('computation metadata validates counters and remains optional for legacy messages', () => {
 assert.equal(readComputation(undefined), null);
 assert.equal(readComputationStatus({stage:'unknown',runs:0,calls:0}), null);
 assert.equal(readComputationStatus({stage:'executing',runs:-1,calls:0}), null);
 assert.deepEqual(readComputationStatus({stage:'answering',runs:1,calls:1}),{stage:'answering',runs:1,calls:1});
 assert.equal(readComputation({status:'completed',runs:6,executionMs:0}),null);
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
