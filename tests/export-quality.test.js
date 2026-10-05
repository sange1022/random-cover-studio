import test from 'node:test';
import assert from 'node:assert/strict';
import {exportDimensions,exportLimits} from '../src/export-quality.js';
test('high resolution PNG targets 8K long edge across standard ratios',()=>{
 assert.deepEqual([exportDimensions('3:4').width,exportDimensions('3:4').height],[5760,7680]);
 assert.deepEqual([exportDimensions('9:16').width,exportDimensions('9:16').height],[4320,7680]);
 assert.deepEqual([exportDimensions('1:1').width,exportDimensions('1:1').height],[7680,7680]);
});
test('larger original sources increase output and are never modified by canvas limits',()=>{
 const image={naturalWidth:8000,naturalHeight:6000};const result=exportDimensions('3:4',[image]);assert.equal(result.height,8000);assert.equal(result.limited,false);assert.equal(image.naturalWidth,8000);
 const large={naturalWidth:24000,naturalHeight:16000};const limited=exportDimensions('9:16',[large]);assert.ok(limited.limited);assert.ok(limited.width*limited.height<=exportLimits.maximumPixels);assert.ok(Math.max(limited.width,limited.height)<=exportLimits.maximumSide);assert.equal(large.naturalWidth,24000);
});
test('2K and 4K use the long edge, while original retains the source resolution',()=>{
 const source={naturalWidth:6000,naturalHeight:4000};
 assert.deepEqual([exportDimensions('3:4',[source],undefined,'2k').width,exportDimensions('3:4',[source],undefined,'2k').height],[1536,2048]);
 assert.deepEqual([exportDimensions('3:4',[source],undefined,'4k').width,exportDimensions('3:4',[source],undefined,'4k').height],[3072,4096]);
 assert.equal(exportDimensions('3:4',[source],undefined,'original').height,6000);
 assert.equal(exportDimensions('3:4',[source],undefined,'highest').height,7680);
});
