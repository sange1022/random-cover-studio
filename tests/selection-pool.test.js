import test from 'node:test';
import assert from 'node:assert/strict';
import {sampleIndices} from '../src/selection.js';
import {filterStyles} from '../src/style-families.js';
test('random selection stays in the active family and source, excluding the active layout',()=>{
 const pool=filterStyles('图文','','新参考 · 40款').map(p=>p.index);
 assert.ok(pool.length>6);
 for(const random of [()=>0,()=>.5,()=>1]){
  const results=sampleIndices(pool,pool[0],6,random);
  assert.equal(results.length,6);assert.equal(new Set(results).size,6);
  assert.ok(results.every(i=>pool.includes(i)&&i!==pool[0]));
 }
});
test('small and empty pools stay bounded and do not duplicate candidates',()=>{
 assert.deepEqual(sampleIndices([],9,6),[]);
 assert.deepEqual(sampleIndices([9],9,6),[9]);
 assert.deepEqual(sampleIndices([2,2,9],9,6,()=>0),[2,9]);
 assert.deepEqual(sampleIndices([2,9],9,1,()=>0),[2]);
});
