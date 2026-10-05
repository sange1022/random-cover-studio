import {renderGenerative} from './generative-render.js';
import {renderFolder} from './folder-render.js';
import {renderMaster} from './master-render.js';
import {renderCombination} from './combination-render.js';
import {renderObserved} from './observed-render.js';
import {catalog} from './catalog.js';
import {dimensions} from './layout.js';
import {resolveTypography,paperInk} from './typography.js';
const serif='"Bodoni 72", "Didot", "Songti SC", "Noto Serif CJK SC", serif';
const sans='"Helvetica Neue", "PingFang SC", sans-serif';
function lines(ctx,text,width){
 const out=[];
 for(const paragraph of text.split('\n')){
  let line='';
  const parts=paragraph.match(/[A-Za-z0-9]+(?:[^\S\n]+)?|[^\x00-\x7F]|.|\s/g)||[''];
  for(const part of parts){
   if(ctx.measureText(line+part).width>width&&line){out.push(line.trimEnd());line='';}
   if(ctx.measureText(part).width>width){for(const c of part){if(ctx.measureText(line+c).width>width&&line){out.push(line);line='';}line+=c;}}
   else line+=part;
  }out.push(line.trimEnd());
 }return out;
}
function text(ctx,content,x,y,w,h,size,color,family=serif,weight='400',align='left'){
 let rows,step;
 do{ctx.font=`${weight} ${size}px ${family}`;rows=lines(ctx,content,w);step=size*1.13;if(rows.length*step<=h)break;size-=2;}while(size>10);
 ctx.fillStyle=color;ctx.textBaseline='top';ctx.textAlign=align;
 rows.forEach((row,i)=>ctx.fillText(row,align==='right'?x+w:align==='center'?x+w/2:x,y+i*step));
 ctx.textAlign='left';return rows.length*step;
}
function photo(ctx,img,x,y,w,h,s){
 const zoom=Number(s.zoom)||1;
 const scale=Math.max(w/img.naturalWidth,h/img.naturalHeight)*zoom;
 const dw=img.naturalWidth*scale,dh=img.naturalHeight*scale;
 ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
 ctx.drawImage(img,x+(w-dw)*(Number(s.pan)/100),y+(h-dh)/2,dw,dh);ctx.restore();
}
export function render(canvas,s,img,width=900,backgroundImage=null,photoSlots=[]){
 const d=dimensions(s.ratio,width);canvas.width=d.width;canvas.height=d.height;
 const c=canvas.getContext('2d');c.scale(width/900,width/900);
 const W=900,H=d.height*900/width,m=54,fs=Number(s.fontSize)||110;
 const type=resolveTypography(s.font,s.layout);
 const heading=(t,x,y,w,h,size,color=s.fg,align='left')=>text(c,t,x,y,w,h,size,color,type.family,type.weight,align);
 c.fillStyle=s.layers?.background===false?'#f1ede2':s.bg;c.fillRect(0,0,W,H);
 if(backgroundImage){const iw=backgroundImage.naturalWidth||backgroundImage.width,ih=backgroundImage.naturalHeight||backgroundImage.height,scale=Math.max(W/iw,H/ih);c.save();c.globalAlpha=Math.min(100,Math.max(0,Number(s.backgroundOpacity??100)))/100;c.drawImage(backgroundImage,(W-iw*scale)/2,(H-ih*scale)/2,iw*scale,ih*scale);c.restore();}
 if(s.combination){renderCombination(c,s,img,W,H);return;}
 const label=(t,x,y,w=360,align='left')=>text(c,t,x,y,w,58,14,s.fg,sans,'500',align);
 const rule=(x,y,w)=>{c.strokeStyle=s.fg;c.globalAlpha=.35;c.lineWidth=1;c.beginPath();c.moveTo(x,y);c.lineTo(x+w,y);c.stroke();c.globalAlpha=1;};
 const preset=catalog[s.layout];
 if(preset?.source==='generative'){renderGenerative(c,s,img,W,H);return;}
 if(['folder','recommendation'].includes(preset?.source)){renderFolder(c,s,img,W,H,preset,photoSlots);return;}
 if(preset?.source==='master'){renderMaster(c,s,img,W,H,preset);return;}
 if(preset?.source==='observed'){renderObserved(c,s,img,W,H,preset);return;}
 if(s.layout===0){
  photo(c,img,m,H*.24,W-m*2,H*.63,s);
  heading(s.title,m,H*.078,W-m*2,H*.31,fs*1.3);
  c.fillStyle=s.bg;c.fillRect(m,H*.88,W-m*2,H*.075);
  text(c,s.subtitle,m,H*.89,W*.55,H*.08,18,s.fg,sans);
  label('IMAGE / TYPE / CHANCE',m,m);label(String(s.serial).padStart(3,'0'),W-m-140,m,140,'right');
  label(s.kicker,m,H-40);label('LAYOUT STUDY',W-m-200,H-40,200,'right');
 }else if(s.layout===1){
  c.fillStyle=s.accent;c.fillRect(0,0,W*.22,H);
  c.save();c.translate(34,H-60);c.rotate(-Math.PI/2);text(c,'IN ORDER, FIND CHANCE.',0,0,H-110,50,20,s.fg,sans);c.restore();
  label('VISUAL NOTES',W*.28,m);label('NO. '+String(s.serial).padStart(3,'0'),W-230,m,180,'right');
  const iy=H*.2,ih=H*.4;
  photo(c,img,W*.48,iy,W*.46,ih,s);
  heading(s.title,W*.28,iy+ih*.54,W*.39,H*.32,fs*.61);
  rule(W*.28,H*.76,W*.65);
  text(c,s.subtitle,W*.28,H*.78,W*.65,H*.1,20,s.fg,sans);
  text(c,s.kicker,W*.28,H*.91,W*.63,H*.05,15,s.fg,sans);
 }else if(s.layout===2){
  const top=H*(.48+s.variant*.13);photo(c,img,0,0,W,top,s);
  c.fillStyle=s.bg;c.fillRect(0,top,W,H-top);
  label('NO. '+String(s.serial).padStart(3,'0'),m,top+34);
  rule(m,top+68,W-m*2);
  heading(s.title,m,top+90,W-m*2,(H-top)*.46,fs);
  text(c,s.subtitle,m,H-114,W-m*2,66,20,s.fg,sans);
  label(s.kicker,m,H-40);label('FORM & FRAME',W-280,H-40,226,'right');
 }else if(s.layout===3){
  const split=W*(.43+s.variant*.08),py=H*.15,ph=H*.68;
  photo(c,img,split,py,W-split-m,ph,s);
  c.fillStyle=s.accent;c.fillRect(split,py+ph+12,W-split-m,5);
  label('COMPOSITION / 04',m,m);label('NO. '+String(s.serial).padStart(3,'0'),W-234,m,180,'right');
  rule(m,H*.105,W-m*2);
  heading(s.title,m,H*.24,split-m-26,H*.36,fs*.77);
  text(c,s.subtitle,m,H*.66,split-m-26,H*.15,22,s.fg,sans);
  rule(m,H*.88,W-m*2);
  text(c,s.kicker,m,H*.91,W*.7,H*.06,15,s.fg,sans);
  label('TWO SIDES / ONE STORY',W-294,H-40,240,'right');
 }else if(s.layout===4){
  label('TYPE AS A WINDOW',m,m);label('NO. '+String(s.serial).padStart(3,'0'),W-234,m,180,'right');
  rule(m,H*.105,W-m*2);
  const compact=s.title.replace(/\s+/g,''),hasCJK=/[\u3000-\u9fff]/.test(compact);
  const glyphs=Array.from(compact||'GO').slice(0,hasCJK?2:5).join('').toUpperCase();
  const x=m,y=H*.16,w=W-m*2,h=H*.49;
  const layer=document.createElement('canvas');layer.width=d.width;layer.height=d.height;
  const mask=layer.getContext('2d');mask.scale(width/900,width/900);
  photo(mask,img,x,y,w,h,s);
  mask.globalCompositeOperation='destination-in';
  let size=h*1.32;
  mask.font=`${type.weight} ${size}px ${type.family}`;
  const metrics=mask.measureText(glyphs);
  const actualH=metrics.actualBoundingBoxAscent+metrics.actualBoundingBoxDescent;
  size*=Math.min(w/Math.max(metrics.width,1),h/Math.max(actualH,1));
  mask.font=`${type.weight} ${size}px ${type.family}`;
  const fit=mask.measureText(glyphs);
  mask.textBaseline='alphabetic';mask.fillStyle='#000';
  mask.fillText(glyphs,x+(w-fit.width)/2,y+(h-fit.actualBoundingBoxAscent-fit.actualBoundingBoxDescent)/2+fit.actualBoundingBoxAscent);
  c.drawImage(layer,0,0,W,H);
  heading(s.title,m,H*.70,W-m*2,H*.15,fs*.66);
  text(c,s.subtitle,m,H*.86,W*.64,H*.08,20,s.fg,sans);
  label(s.kicker,m,H-40);label('LETTER / IMAGE',W-250,H-40,196,'right');
 }else if(s.layout===5){
  const border=32,x=border+22,y=H*.18,w=W-x*2,h=H*.51;
  c.strokeStyle=s.fg;c.lineWidth=1.5;c.strokeRect(border,border,W-border*2,H-border*2);
  label('A MOMENT, FRAMED',m,54);label('NO. '+String(s.serial).padStart(3,'0'),W-234,54,180,'right');
  photo(c,img,x,y,w,h,s);
  c.strokeStyle=s.fg;c.globalAlpha=.35;c.strokeRect(x-8,y-8,w+16,h+16);c.globalAlpha=1;
  heading(s.title,m,H*.73,W-m*2,H*.15,fs*.77,s.fg,'center');
  text(c,s.subtitle,m,H*.88,W-m*2,H*.055,18,s.fg,sans,'400','center');
  text(c,s.kicker,m,H-56,W-m*2,22,12,s.fg,sans,'500','center');
 }else if(s.layout===6){
  label('SPACE BEYOND WORDS',m,m);label('NO. '+String(s.serial).padStart(3,'0'),W-234,m,180,'right');
  const x=W*.61,iy=H*(.21+s.variant*.07);
  photo(c,img,x,iy,W*.31,H*.40,s);
  text(c,s.subtitle,m,H*.31,W*.38,H*.16,20,s.fg,sans);
  rule(m,H*.62,W*.38);
  text(c,s.kicker,m,H*.65,W*.4,H*.06,13,s.fg,sans);
  heading(s.title,m,H*.78,W-m*2,H*.17,fs*1.14);
 }else if(s.layout===7){
  const x=W*.18,w=W*.64,y=H*.045,card=H*.58,ink=paperInk(s.accent,s.fg,s.bg);
  c.fillStyle=s.accent;c.fillRect(x+10,y+10,w,card);
  c.fillStyle=s.bg;c.globalAlpha=.12;c.fillRect(x,y,w,card);c.globalAlpha=1;
  text(c,'DRAWING FILE / 08',x+28,y+28,w-56,40,14,ink,sans,'500');
  text(c,s.kicker,x+28,y+card*.55,w-56,card*.08,13,ink,sans);
  heading(s.title,x+28,y+card*.65,w-56,card*.26,fs*.68,ink);
  const iy=y+card+18,ih=H-iy-70;
  photo(c,img,x,iy,w,ih,s);
  c.fillStyle=s.bg;
  for(let k=0;k<=w;k+=32){c.beginPath();c.arc(x+k,iy,7,0,Math.PI*2);c.fill();}
  text(c,s.subtitle,x,H-42,w,32,14,s.fg,sans);
  c.save();c.translate(40,H-70);c.rotate(-Math.PI/2);text(c,'FINDING CHANCE IN STRUCTURE',0,0,H-140,28,13,s.fg,sans);c.restore();
 }else if(s.layout===8){
  label('VERTICAL STUDY / 09',m,m);label('NO. '+String(s.serial).padStart(3,'0'),W-234,m,180,'right');
  const x=W*.36,y=H*.15,w=W*.52,h=H*.64;
  photo(c,img,x,y,w,h,s);
  c.save();c.translate(m,H*.79);c.rotate(-Math.PI/2);
  heading(s.title.replace(/\n/g,' '),0,0,H*.64,W*.22,fs*.89);
  c.restore();
  rule(W*.36,H*.84,W*.52);
  text(c,s.subtitle,W*.36,H*.87,W*.52,H*.08,20,s.fg,sans);
  label(s.kicker,m,H-40);
 }
}
