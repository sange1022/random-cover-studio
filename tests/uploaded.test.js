import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {uploadedPresets} from '../src/uploaded-presets.js';
import {catalog,filterCatalog} from '../src/catalog.js';
import {masterFields} from '../src/master-presets.js';
import {randomIndex,preserveCopy} from '../src/selection.js';
test('nine supplied references keep original ratios, editable text and clean photographic slot assets',()=>{
 assert.equal(uploadedPresets.length,9);assert.equal(filterCatalog('本次上传').length,9);
 for(const p of uploadedPresets){assert.ok(existsSync('.'+p.referenceImage));assert.ok(p.ratio.includes(':'));for(const asset of p.photoAssets)assert.ok(existsSync('.'+asset),asset);
  for(const e of p.elements.filter(e=>e.type==='text')){assert.ok(masterFields.includes(e.field));assert.ok(p.fields.includes(e.field));assert.equal(typeof p.copy[e.field],'string');}
  for(const e of p.elements.filter(e=>e.type==='photo'))assert.ok(p.photoAssets[e.slot]);
  const index=catalog.indexOf(p);assert.equal(randomIndex(-1,catalog.length,()=> (index+.5)/catalog.length),index);
  const custom=Object.fromEntries(masterFields.map(k=>[k,'自定义 '+k]));assert.equal(preserveCopy(custom,p.copy,masterFields).title,custom.title);
 }
});
