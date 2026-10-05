// A seeded grid generator: vary composition first, then typography within safe boxes.
export const generativePreset={id:'generative-grid',source:'generative',group:'随机构图',name:'文字网格 · 随机构图',ratio:'3:4',font:'bold',colors:['#faf8ef','#171916','#7c8678'],referenceImage:'https://i.pinimg.com/736x/cd/41/08/cd410813651d36be3cea40e4bd3b2253.jpg',copy:{title:'不稳定边界\nUNSTABLE BOUNDARY',subtitle:'艺术家个展 / SOLO EXHIBITION',brand:'韩冰 / HAN BING b.1986',kicker:'2020.01.11 → 2020.03.10',freeParagraphs:'地址：上海市莫干山路50号\n17号楼2楼202室\n\n主办方：天线空间\nORGANIZER: ANTENNA SPACE\n\n边界之间，观看与被观看。\nBetween boundaries, seeing and being seen.'}};
export function seeded(seed){let n=(Number(seed)||1)>>>0;return ()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};}
export const structureNames=['紧密信息栈','双栏错位','分段阶梯','边角平衡','横纵交错','大字与小注','倾斜信息块','双色叠印','黑白字格','圆形与图文'];
export function generateComposition(s){
 const r=seeded(s.freeSeed??3011),pick=n=>Math.floor(r()*n),freedom=(s.freeFreedom??65)/100,family=s.freeRoute!==undefined&&s.freeRoute!=='auto'?Math.max(0,Math.min(9,Number(s.freeRoute))):pick(10),m=.05,gap=.026;
 const sections=String(s.freeParagraphs??'').split(/\n\s*\n/).map(t=>t.trim()).filter(Boolean);
 // Each paragraph stays whole. At most eight boxes; extra paragraphs share the last box.
 const paragraphs=sections.length>8?[...sections.slice(0,7),sections.slice(7).join('\n\n')]:sections;
 if(s.freePhoto)paragraphs.splice(pick(paragraphs.length+1),0,null);
 const items=[];const add=(kind,value,x,y,w,h,size,align='left',extra={})=>{if(String(value||'').trim())items.push({kind,value:String(value),x,y,w,h,size,align,...extra});};
 const titleH=.14+r()*.055*freedom;
 const titleW=family===2?.72+r()*.18:.9,titleX=family===2&&pick(2)? .95-titleW:m;
 add('title',s.title,titleX,family===5?.70:m,titleW,family===5?.14:titleH,.105+r()*.035*freedom,pick(3)===0?'right':'left');
 let top=family===5?m:m+titleH+gap;
 if(family===0){
  for(const [kind,value] of [['name',s.brand],['subtitle',s.subtitle],['date',s.kicker]]){if(!value)continue;const h=kind==='name'?.074:.058;add(kind,value,m,top,.9,h,kind==='name'?.061:.045,pick(3)===0?'right':'left');top+=h+gap*.6;}
  const step=Math.min(.11,(.84-top)/Math.max(paragraphs.length,1));paragraphs.forEach((value,i)=>{const h=Math.max(.02,step-gap*.5);if(value===null)items.push({kind:'photo',x:m,y:top+i*step,w:.9,h});else add('paragraph',value,m,top+i*step,.9,h,.041-r()*.012,pick(3)===0?'right':'left');});
 }else{
  add('name',s.brand,m,top,.9,.058,.05,pick(2)?'left':'right');top+=.058+gap;
  add('subtitle',s.subtitle,m,top,.58,.048,.024);add('date',s.kicker,.67,top,.28,.048,.024,'right');top+=.048+gap*1.8;
  const count=paragraphs.length,rows=Math.max(1,Math.ceil(count/(family===2||family===5||family===7?1:2))),available=(family===5?.67:.83)-top;
  const step=available/rows;
  paragraphs.forEach((value,i)=>{
   let x=m,w=.9,y=top+i*step,h=step-gap,size=.042,align='left',rotate=0;
   if(family===1){x=m+(i%2)*.475;y=top+Math.floor(i/2)*step;w=.425;size=.029+r()*.014*freedom;}
   if(family===2){w=.55+r()*.28*freedom;x=i%2?.95-w:m;size=.025+r()*.025*freedom;align=i%2?'right':'left';}
   if(family===3){x=m+(i%2)*.52;y=top+Math.floor(i/2)*step;w=.38;align=i%2?'right':'left';size=.025+r()*.012;}
   if(family===4){x=m+(i%2)*.5;y=top+Math.floor(i/2)*step;w=.4;size=.033;rotate=i===count-1&&count>1?90:0;}
   if(family===5){w=i===0?.9:.52;x=i===0?m:.95-w;size=i===0?.065:.025;align=i===0?'left':'right';}
   if(family===6){x=m+(i%2)*.49;y=top+Math.floor(i/2)*step;w=.41;size=.028+r()*.028*freedom;rotate=(r()-.5)*30*freedom;}
   if(family===7){x=m+(i%2)*.14;y=top+i*step;w=.76;size=i%2?.035:.052;}
   if(family===8){x=m+(i%2)*.47;y=top+Math.floor(i/2)*step;w=.43;size=.03+r()*.025;}
   if(family===9){x=m+(i%2)*.49;y=top+Math.floor(i/2)*step;w=.40;size=.031;}
   if(value===null)items.push({kind:'photo',x,y,w,h:Math.max(.025,h)});else add('paragraph',value,x,y,w,Math.max(.025,h),size,align,{rotate,index:i,ink:family===7&&i%2?'accent':family===8&&i%2?'bg':undefined,background:family===8&&i%2?'fg':undefined});
  });
 }
 // A quiet footer shares the same outer edges; no extra invented copy.
 if(s.brand)add('footer',s.brand,m,.925,.9,.025,.014,'right');
 if(family===7&&s.freeOverlay&&s.kicker)items.push({kind:'overlay',value:s.kicker,x:.08,y:.20,w:.84,h:.32,size:.055,ink:'accent',rotate:-8});
 if(family===9)items.unshift({kind:'circle',x:.52,y:.76,w:.37,h:.15});
 return {family,name:structureNames[family],items,rules:s.freeRules!==false,seed:s.freeSeed??3011};
}
