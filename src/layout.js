import {catalog} from './catalog.js';
export const layoutNames=catalog.map(entry=>entry.name);
export const palettes = [
 ['#e8d9b3','#24252e','#be6744'],['#222530','#eee2c4','#61bb99'],
 ['#be6744','#241f20','#ebd6af'],['#486171','#efe7ce','#bf714f'],
 ['#e7e4d9','#273934','#84a798'],['#39322e','#e6d1ad','#b9774e']
];
export function dimensions(ratio,width=900){
 const [a,b]=( /^\d{1,4}:\d{1,4}$/.test(ratio)&&ratio.split(':').every(n=>Number(n)>0)&&Number(ratio.split(':')[1])/Number(ratio.split(':')[0])<=3&&Number(ratio.split(':')[0])/Number(ratio.split(':')[1])<=3?ratio:'3:4').split(':').map(Number);
 return {width,height:Math.round(width*b/a)};
}
export function drawCard(previous,mode='random',random=Math.random,pool=layoutNames.map((_,i)=>i)){
 const others=pool.filter(x=>x!==previous.layout);
 const candidates=others.length?others:pool.length?pool:[previous.layout];
 const layout=mode==='random'?candidates[Math.floor(random()*candidates.length)]:Number(mode);
 const selected=catalog[layout];
 const [bg,fg,accent]=selected?.source==='observed'?selected.colors:palettes[Math.floor(random()*palettes.length)];
 return {...previous,layout,bg,fg,accent,variant:random(),serial:(previous.serial||0)+1};
}
