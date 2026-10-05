import test from 'node:test';
import assert from 'node:assert/strict';
import {masterPresets,applyMaster} from '../src/master-presets.js';
import {dimensions} from '../src/layout.js';
test('selected references have provenance and switching keeps all edited copy',()=>{assert.equal(masterPresets.length,3);for(const p of masterPresets){assert.equal(p.group,'你选的三种');assert.ok(p.credit&&p.referenceImage);const previous={title:'我的书',subtitle:'副标题',kicker:'作者',body:'自己的腰封介绍',glyph:'字',serial:1};const next=applyMaster(previous,p,99);for(const key of ['title','subtitle','kicker','body','glyph'])assert.equal(next[key],previous[key]);assert.equal(next.combination,null);assert.equal(next.layout,99);assert.equal(next.ratio,p.ratio);assert.equal(dimensions(p.ratio,900).height,Math.round(900*p.bookHeight/p.bookWidth));}});
