import {resolveTypography} from './typography.js';
const serif='"Songti SC", "Times New Roman", serif',sans='"Helvetica Neue", "PingFang SC", sans-serif',brush='"Kaiti SC", "STKaiti", "Songti SC", serif';
export function renderMaster(c,s,img,W,H,p){
 const mainType=s.font&&s.font!=='auto'?resolveTypography(s.font,s.layout):null;
 const block=(value,x,y,w,h,size,family=sans,weight='400',color=s.fg,align='left',stretch=false,italic=false)=>{
  if(!value)return;const rows=String(value).split('\n'),scale=(Number(s.fontSize)||110)/110;size*=scale;
  const set=()=>{c.font=`${italic?'italic ':''}${weight} ${size}px ${family}`;};set();
  while(size>3&&(Math.max(...rows.map(t=>{const m=c.measureText(t);return (m.actualBoundingBoxAscent||size*.8)+(m.actualBoundingBoxDescent||0)}))+(rows.length-1)*size*1.04>h||(!stretch&&Math.max(...rows.map(t=>c.measureText(t).width))>w))){size*=.96;set();}
  c.save();c.fillStyle=color;c.textBaseline='alphabetic';c.textAlign='left';
  rows.forEach((row,i)=>{const m=c.measureText(row),rw=m.width,bx=align==='center'?x+(w-rw)/2:align==='right'?x+w-rw:x,by=y+i*size*1.04+(m.actualBoundingBoxAscent||size*.8);c.save();if(stretch&&rw){c.translate(x,by);c.scale(w/rw,1);c.fillText(row,0,0);}else c.fillText(row,bx,by);c.restore();});c.restore();
 };
 const title=(...args)=>block(...args.slice(0,6),mainType?.family||args[6],mainType?.weight||args[7],...args.slice(8));
 const photo=(bottom)=>{if(!img||s.layers?.image===false)return;const iw=img.naturalWidth||img.width,ih=img.naturalHeight||img.height,scale=Math.max(W/iw,bottom/ih)*(s.zoom||1),dw=iw*scale,dh=ih*scale;c.save();c.beginPath();c.rect(0,0,W,bottom);c.clip();c.drawImage(img,(W-dw)*(Number(s.pan??50)/100),(bottom-dh)/2,dw,dh);c.restore();};
 const rect=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h);};
 const key=p.composition.slice(7);photo(key==='forest'?H:H*.498);
 if(s.paletteId){c.save();c.globalAlpha=.16;c.fillStyle='#111713';c.fillRect(0,0,W,key==='forest'?H:H*.498);c.restore();}
 if(key==='forest'&&s.photoInk)s={...s,fg:s.photoInk};
 if(key==='tea'&&s.photoInk)s={...s,accent:s.photoInk};
 if(key==='tea'){
  rect(0,H*.498,W,H*.502,s.bg);
  if(s.layers?.text===false)return;
  title(s.title,W*.405,H*.067,W*.19,H*.181,W*.118,serif,'400',s.accent,'center');
  const bilingual=(y,width,size,color)=>{const rows=String(s.subtitle||'').split('\n');rows.forEach((row,i)=>block(row,(W-width)/2,y+i*size*.85,width,size*1.2,size,serif,'400',color,'center',false,i===1));};
  bilingual(H*.291,W*.55,W*.046,s.accent);
  block(s.kicker,W*.27,H*.417,W*.46,H*.032,W*.030,serif,'400',s.accent,'center');
  title(s.brand,-W*.08,H*.498,W*1.16,H*.114,W*.205,sans,'400',s.fg,'left',true);
  block(String(s.vertical||'').replace(/\n/g,'').split('').join('\n'),W*.48,H*.705,W*.05,H*.100,W*.031,serif,'400',s.fg,'center');
  bilingual(H*.818,W*.34,W*.032,s.fg);
  block(s.left,W*.052,H*.782,W*.15,H*.20,W*.125,brush,'600',s.fg,'center');
  block(s.right,W*.822,H*.782,W*.15,H*.20,W*.125,brush,'600',s.fg,'center');
  block(s.body,W*.25,H*.940,W*.50,H*.045,W*.016,serif,'400',s.fg,'center');
 }else if(key==='forest'){
  if(s.layers?.text!==false){
   block(s.eyebrow,W*.15,H*.114,W*.70,H*.057,W*.059,sans,'700',s.fg,'center');
   block(s.kicker,W*.104,H*.240,W*.265,H*.040,W*.027,sans,'700',s.fg,'center');
   block(s.kicker,W*.623,H*.240,W*.265,H*.040,W*.027,sans,'700',s.fg,'center');
   title(s.title,W*.13,H*.373,W*.74,H*.264,W*.109,sans,'700',s.fg,'center');
   block(s.subtitle,W*.22,H*.709,W*.56,H*.066,W*.036,sans,'700',s.fg,'center');
   title(s.brand,W*.107,H*.859,W*.77,H*.075,W*.121,sans,'600',s.fg,'left',true);
  }
  if(s.layers?.ornament!==false){c.save();c.strokeStyle=s.fg;c.lineWidth=W*.0025;c.beginPath();c.arc(W*.493,H*.252,W*.051,0,Math.PI*2);c.stroke();for(let i=0;i<4;i++){c.beginPath();c.moveTo(W*.462,H*(.237+i*.011));c.lineTo(W*(i===0?.485:.515),H*(.237+i*.011));c.stroke();}c.beginPath();c.arc(W*.505,H*.239,W*.011,0,Math.PI*2);c.stroke();c.restore();}
 }else{
  rect(0,H*.498,W,H*.502,s.bg);
  if(s.layers?.text===false)return;
  title(s.title,W*.104,-H*.004,W*.792,H*.134,W*.112,sans,'300',s.accent,'center');
  block(s.body,W*.010,H*.148,W*.235,H*.025,W*.015,sans,'400',s.accent);
  block(s.fineprint,W*.720,H*.148,W*.270,H*.025,W*.015,sans,'400',s.accent,'right');
  block(s.metaLeft,W*.008,H*.433,W*.41,H*.057,W*.047,sans,'400',s.accent);
  block(s.metaRight,W*.590,H*.433,W*.40,H*.057,W*.047,sans,'400',s.accent,'right');
  block(s.left,W*.010,H*.515,W*.45,H*.064,W*.047,sans,'400',s.fg);
  block(s.right,W*.535,H*.515,W*.455,H*.064,W*.047,sans,'400',s.fg,'right');
  block(s.body,W*.010,H*.825,W*.285,H*.033,W*.017,sans,'400',s.fg);
  block(s.fineprint,W*.765,H*.825,W*.225,H*.033,W*.014,sans,'400',s.fg,'right');
  block(s.kicker,W*.41,H*.831,W*.19,H*.019,W*.014,sans,'400',s.fg,'center');
  c.save();c.translate(W,H*1.856);c.rotate(Math.PI);title(s.title,W*.105,H*.858,W*.79,H*.142,W*.106,sans,'300',s.fg,'center');c.restore();
 }
}
