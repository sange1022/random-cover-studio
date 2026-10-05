import test from 'node:test';
import assert from 'node:assert/strict';
import {catalog,groups,filterCatalog} from '../src/catalog.js';
import {drawCard} from '../src/layout.js';
test('catalog excludes removed experimental layouts from categories and the complete pool',()=>{
 assert.equal(catalog.length,126);assert.equal(new Set(catalog.map(p=>p.id)).size,126);
 assert.ok(!groups.includes('旧版原创实验'));assert.equal(filterCatalog('旧版原创实验').length,0);
 assert.ok(catalog.every(p=>['base','observed','master','folder','generative','recommendation'].includes(p.source)));
 assert.equal(filterCatalog('全部').length,126);
});
test('category and search pools constrain random draw including one-item results',()=>{
 const entries=filterCatalog('文件夹参考','网格');assert.ok(entries.length>0);const pool=entries.map(p=>p.index);
 for(let i=0;i<10;i++)assert.ok(pool.includes(drawCard({layout:0},'random',()=>i/10,pool).layout));
 assert.equal(drawCard({layout:15},'random',()=>0,[15]).layout,15);assert.equal(filterCatalog('全部','NO MATCH').length,0);
});
