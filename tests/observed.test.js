import test from 'node:test';
import assert from 'node:assert/strict';
import {catalog,filterCatalog} from '../src/catalog.js';
import {drawCard} from '../src/layout.js';
test('default picker only shows templates backed by actual captured video frames',()=>{const list=filterCatalog();assert.ok(list.length>=10);assert.ok(list.every(p=>p.source==='observed'&&p.referenceImage&&Number.isFinite(p.time)));assert.ok(!list.some(p=>/^风格\d+/.test(p.name)));});
test('drawing a video template preserves the reference palette rather than random recoloring',()=>{const p=catalog.find(p=>p.source==='observed');assert.ok(p);const next=drawCard({layout:0,title:'自己的标题'},String(catalog.indexOf(p)),()=>0);assert.equal(next.bg,p.colors[0]);assert.equal(next.fg,p.colors[1]);assert.equal(next.title,'自己的标题');});
