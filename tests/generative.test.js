import test from 'node:test';
import assert from 'node:assert/strict';
import {generateComposition} from '../src/generative.js';
const copy={title:'不稳定边界\nUNSTABLE BOUNDARY',brand:'自然展览',subtitle:'ART EXHIBITION',kicker:'2026.10.04',freeParagraphs:'第一段，观看与秩序。\n段内换行保留。\n\n第二段，留白与边界。\n\n第三段，主办方信息。'};
test('generative plans are stable for export and history, and cover all structures',()=>{
 const families=new Set();for(let seed=1;seed<=500;seed++){const s={...copy,freeSeed:seed*991};const a=generateComposition(s);assert.deepEqual(a,generateComposition(s));families.add(a.family);assert.deepEqual(a.items.filter(e=>e.kind==='paragraph').map(e=>e.value),copy.freeParagraphs.split('\n\n'));}assert.equal(families.size,10);
});
test('variable paragraph plans stay inside margins and do not overlap',()=>{
 for(let seed=1;seed<200;seed++)for(const count of [0,1,3,8,10]){const s={...copy,freeSeed:seed*1703,freeParagraphs:Array.from({length:count},(_,i)=>'段落 '+i).join('\n\n'),freePhoto:true};const items=generateComposition(s).items.filter(e=>e.kind!=='circle'&&e.kind!=='overlay');
 for(const e of items){assert.ok(e.x>=0&&e.y>=0&&e.x+e.w<=1&&e.y+e.h<=1,JSON.stringify(e));}
 for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++){const a=items[i],b=items[j];assert.ok(a.x+a.w<=b.x+.0001||b.x+b.w<=a.x+.0001||a.y+a.h<=b.y+.0001||b.y+b.h<=a.y+.0001,`${seed}: ${a.kind} overlaps ${b.kind}`);}}
});
