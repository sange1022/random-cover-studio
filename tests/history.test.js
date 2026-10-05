import test from 'node:test';
import assert from 'node:assert/strict';
import {packHistory,unpackHistory,historyLimit} from '../src/history.js';
test('stored random records restore seed, copy, colors and full original photos with deduplicated assets',async()=>{
 const image={src:'data:original-photo'},backgroundImage={src:'data:original-background'};
 const state={layout:86,title:'我的文字',freeSeed:1234,bg:'#123456',backgroundOpacity:42};
 const entries=Array.from({length:3},(_,i)=>({state:{...state,freeSeed:i},image,backgroundImage,thumbnail:'small-preview',userUploaded:true,copyEdited:true}));
 const packed=packHistory(entries,1);assert.equal(packed.assets.length,2);
 const restored=await unpackHistory(structuredClone(packed),async src=>({src}));assert.equal(restored.active,1);assert.equal(restored.entries.length,3);assert.deepEqual(restored.entries[1].state,entries[1].state);assert.equal(restored.entries[0].image,restored.entries[1].image);assert.equal(restored.entries[1].backgroundImage.src,backgroundImage.src);assert.equal(restored.entries[1].copyEdited,true);
});
test('history bounds storage and skips missing photos rather than restoring broken records',async()=>{
 const entries=Array.from({length:100},()=>({state:{layout:1},image:{src:'valid'},backgroundImage:null}));assert.equal(packHistory(entries,0).entries.length,historyLimit);
 assert.deepEqual(await unpackHistory(null,()=>{}),{entries:[],active:-1});
 const packed=packHistory(entries.slice(0,1),0);const failed=await unpackHistory(packed,async()=>{throw Error('unavailable');});assert.equal(failed.entries.length,0);assert.equal(failed.active,-1);
});
test('uploaded original file is stored instead of its revoked temporary URL',async()=>{
 const original=new Blob(['original bytes'],{type:'image/png'}),img={src:'blob:expired-url',historySource:original};
 const packed=packHistory([{state:{layout:2},image:img,backgroundImage:img}],0);assert.equal(packed.assets.length,1);assert.equal(await packed.assets[0].text(),'original bytes');
 const restored=await unpackHistory(structuredClone(packed),async source=>({historySource:source,src:'blob:new-url'}));assert.equal(await restored.entries[0].image.historySource.text(),'original bytes');
});
