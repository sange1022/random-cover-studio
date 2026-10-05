import {observedPresets} from './reference-presets.js';
import {renderObserved} from './observed-render.js';
const off={background:false,partition:false,lines:false,image:false,text:false,ornament:false,shape:false,window:false};
export function renderCombination(c,s,img,W,H){
 const combination=s.combination;
 const pass=(part,key)=>{
  if(s.layers?.[part]===false||key==='none')return;
  const p=observedPresets.find(p=>p.composition===`observed:${key}`);if(!p)return;
  const layers={...off,[part]:true};
  renderObserved(c,{...s,font:s.font==='auto'?combination.font:s.font,layers},img,W,H,p);
 };
 pass('partition',combination.partition);pass('image',combination.image);pass('shape',combination.shape);pass('lines',combination.lines);pass('window','photo-word');pass('ornament',combination.ornament);pass('text',combination.text);
}
