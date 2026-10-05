import test from 'node:test';
import assert from 'node:assert/strict';
import {dimensions, drawCard,layoutNames} from '../src/layout.js';
test('export dimensions match all supported ratios',()=>{
 assert.deepEqual(dimensions('3:4',2160),{width:2160,height:2880});
 assert.deepEqual(dimensions('1:1',2160),{width:2160,height:2160});
 assert.deepEqual(dimensions('9:16',2160),{width:2160,height:3840});
});
test('draw preserves user content and never repeats the previous random layout',()=>{
 const previous={layout:0,title:'在秩序里发现偶然',subtitle:'A quiet moment',ratio:'3:4'};
 const next=drawCard(previous,'random',()=>0);
 assert.equal(next.title,previous.title); assert.equal(next.subtitle,previous.subtitle); assert.equal(next.ratio,previous.ratio);
 assert.notEqual(next.layout,previous.layout);
});
test('fixed layout is respected and has a usable contrasting palette',()=>{
 const next=drawCard({title:'Hello'},'2',()=>0.5);
 assert.equal(next.layout,2);assert.notEqual(next.bg,next.fg);
});
test('random draw reaches all available layouts while preserving content',()=>{
 const reached=new Set();
 for(let i=0;i<layoutNames.length-1;i++){
  const next=drawCard({layout:0,title:'在秩序里\n发现偶然',subtitle:'Order & Chance',ratio:'9:16'},'random',()=>(i+.5)/(layoutNames.length-1));
  reached.add(next.layout);
  assert.equal(next.title,'在秩序里\n发现偶然');
  assert.equal(next.subtitle,'Order & Chance');
 }
 assert.deepEqual([...reached].sort((a,b)=>a-b),layoutNames.map((_,i)=>i).slice(1));
 const next=drawCard({layout:5},'random',()=>0);
 assert.equal(next.layout,0);
});
