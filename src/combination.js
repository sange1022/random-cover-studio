import {observedPresets} from './reference-presets.js';
export const componentOptions={image:['right-photo','paper-strip','third-photo','pale-rays','photo-word','specimen'],text:observedPresets.map(p=>p.composition.slice(9)),partition:['none','paper-strip','blue-rail','green-footer','clash'],shape:['none','spiral','clash'],lines:['none','pale-rays','third-photo','paper-strip'],ornament:['none','paper-strip','third-photo','pale-rays','spiral']};
export const layerNames={background:'底色',partition:'分区',lines:'线条',image:'图片',text:'文本',ornament:'装饰',shape:'图形',window:'字窗'};
export const defaultLayers={background:true,partition:false,lines:true,image:true,text:true,ornament:true,shape:false,window:false};
export function composeCard(previous,random=Math.random,fontPool=['editorial','light','bold','condensed','script']){
 const pick=items=>items[Math.min(items.length-1,Math.floor(random()*items.length))],old=previous.combination||{image:previous.referenceKey||'right-photo',text:previous.referenceKey||'right-photo'},locks=previous.locks||{},combination={};
 for(const [part,items] of Object.entries(componentOptions))combination[part]=locks[part]&&old[part]?old[part]:pick(items);
 if(previous.experimental===false){combination.text=combination.image;combination.partition='none';combination.shape='none';}
 combination.font=locks.text&&old.font?old.font:pick(fontPool.length?fontPool:['editorial']);
 const preset=pick(observedPresets),[bg,fg,accent]=locks.color?[previous.bg,previous.fg,previous.accent]:preset.colors;
 return {...previous,combination,bg,fg,accent,layers:{...defaultLayers,...previous.layers},locks:{...locks},serial:(previous.serial||0)+1};
}
