import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveTypography} from '../src/typography.js';
test('auto typography adapts to layout without losing Chinese fallback',()=>{
 assert.match(resolveTypography('auto',0).family,/Songti SC/);
 assert.equal(resolveTypography('auto',6).weight,'200');
 assert.match(resolveTypography('auto',7).family,/PingFang SC/);
 assert.equal(resolveTypography('auto',7).weight,'800');
});
test('explicit typography is stable across layouts and unknown keys fall back',()=>{
 assert.deepEqual(resolveTypography('condensed',0),resolveTypography('condensed',8));
 assert.match(resolveTypography('condensed',8).family,/Arial Narrow/);
 assert.deepEqual(resolveTypography('unknown',0),resolveTypography('auto',0));
});
import {paperInk} from '../src/typography.js';
test('collage paper keeps title readable on pale accent colors',()=>{
 assert.equal(paperInk('#61bb99','#eee2c4','#222530'),'#222530');
 assert.equal(paperInk('#be6744','#241f20','#ebd6af'),'#241f20');
});
