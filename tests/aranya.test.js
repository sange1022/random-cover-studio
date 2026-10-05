import test from 'node:test';
import assert from 'node:assert/strict';
import {aranyaPresets} from '../src/aranya-presets.js';
import {filterCatalog} from '../src/catalog.js';
import {drawCard} from '../src/layout.js';
test('40 reference compositions are editable and available in the complete random pool',()=>{
 const pool=filterCatalog('新参考 · 40款');assert.equal(pool.length,40);
 assert.equal(new Set(aranyaPresets.map(p=>JSON.stringify(p.elements.map(({field,font,color,...geometry})=>geometry)))).size,40);
 for(const p of aranyaPresets){assert.ok(p.fields.includes('title'));for(const f of p.fields)assert.equal(typeof p.copy[f],'string');assert.ok(p.elements.length>=6);}
 for(const entry of pool){const result=drawCard({layout:0},'random',()=>0,[entry.index]);assert.equal(result.layout,entry.index);}
});
