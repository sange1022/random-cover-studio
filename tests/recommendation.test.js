import test from 'node:test';
import assert from 'node:assert/strict';
import {recommendationPresets} from '../src/recommendation-presets.js';
import {catalog,filterCatalog} from '../src/catalog.js';
import {masterFields,applyMaster} from '../src/master-presets.js';
import {preserveCopy,randomIndex} from '../src/selection.js';
test('30 recommendation posters expose every rendered text field and enter the random pool',()=>{
 assert.equal(recommendationPresets.length,30);assert.equal(filterCatalog('推荐海报').length,30);
 const geometry=new Set();
 for(const p of recommendationPresets){
  geometry.add(JSON.stringify(p.elements));
  for(const e of p.elements.filter(e=>e.type==='text')){assert.ok(masterFields.includes(e.field));assert.ok(p.fields.includes(e.field));assert.equal(typeof p.copy[e.field],'string');assert.ok(e.w>0&&e.h>0&&e.size>0);}
  const index=catalog.indexOf(p);assert.ok(index>=0);assert.equal(randomIndex(-1,catalog.length,()=> (index+.5)/catalog.length),index);
  const copy=Object.fromEntries(masterFields.map(f=>[f,'自定义\n'+f]));const result=preserveCopy(copy,applyMaster({layers:{}},p,index),masterFields);
  for(const f of masterFields)assert.equal(result[f],copy[f]);
 }
 assert.equal(geometry.size,30);
});
