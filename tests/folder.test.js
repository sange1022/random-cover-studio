import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {folderPresets} from '../src/folder-presets.js';
import {masterFields} from '../src/master-presets.js';
import {catalog,filterCatalog} from '../src/catalog.js';
import {randomIndex,preserveCopy} from '../src/selection.js';
import {paletteLibrary,contrast} from '../src/palettes.js';
test('all 24 uploaded layouts have original references and editable text layers',()=>{
 assert.equal(folderPresets.length,24);assert.equal(filterCatalog('文件夹参考').length,24);
 for(const p of folderPresets){assert.ok(existsSync('.'+p.referenceImage),p.referenceImage);assert.ok(p.elements.length>=3,p.name);assert.ok(p.fields.includes('title'),p.name);for(const e of p.elements.filter(e=>e.type==='text')){assert.ok(masterFields.includes(e.field));assert.equal(typeof p.copy[e.field],'string');assert.ok(e.w>0&&e.h>0&&e.size>0,p.name);}}
});
test('random selection reaches the entire catalog without repeating and preserves all input fields',()=>{
 const previous=Object.fromEntries(masterFields.map(f=>[f,'我的 '+f]));const reached=new Set();
 for(let n=0;n<catalog.length-1;n++){const index=randomIndex(5,catalog.length,()=> (n+.5)/(catalog.length-1));reached.add(index);assert.notEqual(index,5);const next=preserveCopy(previous,{...folderPresets[0].copy,layout:index},masterFields);for(const f of masterFields)assert.equal(next[f],previous[f]);}
 assert.equal(reached.size,catalog.length-1);assert.equal(randomIndex(0,1),0);assert.equal(randomIndex(-1,5,()=>0),0);
});
test('named palette library contains video colors and contrasting curated families',()=>{
 assert.equal(paletteLibrary.length,58);assert.equal(paletteLibrary.filter(p=>p.origin==='saved-video-frame').length,10);
 for(const p of paletteLibrary.filter(p=>p.origin==='curated'))assert.ok(contrast(p.colors[0],p.colors[1])>=4.5,p.name);
});
