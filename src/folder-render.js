import {contrast} from './palettes.js';
import {resolveTypography} from './typography.js';
const fonts={sans:'"Helvetica Neue", "PingFang SC", sans-serif',bold:'"Helvetica Neue", "PingFang SC", sans-serif',light:'"Helvetica Neue", "PingFang SC", sans-serif',serif:'"Didot", "Songti SC", serif',kai:'"Kaiti SC", "Songti SC", serif'};
export function renderFolder(c,s,img,W,H,p,photoSlots=[]){
 const inside=(e,px,py)=>e.type==='polygon'?e.points.reduce((hit,[ax,ay],i)=>{const [bx,by]=e.points[(i+e.points.length-1)%e.points.length];return ((ay>py)!==(by>py)&&px<(bx-ax)*(py-ay)/(by-ay)+ax)?!hit:hit;},false):px>=e.x&&px<=e.x+e.w&&py>=e.y&&py<=e.y+e.h;
 const color=key=>s.paletteId&&/^#[0-9a-f]{3,8}$/i.test(key)?s.accent:s[key]||({photoInk:'#f5f2e9'}[key])||key||s.fg;
 for(const e of p.elements){
  const x=e.x*W,y=e.y*H,w=(e.w||0)*W,h=(e.h||0)*H;
  c.save();c.globalAlpha=e.alpha??1;c.fillStyle=color(e.color||'fg');c.strokeStyle=c.fillStyle;
  if(e.type==='grain'){let seed=1977;for(let i=0;i<9000;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const gx=seed/4294967296*W;seed=(Math.imul(seed,1664525)+1013904223)>>>0;c.fillRect(gx,seed/4294967296*H,W*.0009,H*.0005);}}
  else if(e.type==='gradient'){const g=c.createLinearGradient(x,y,x,y+h);e.colors.forEach((v,i)=>g.addColorStop(i/(e.colors.length-1),color(v)));c.fillStyle=g;c.fillRect(x,y,w,h);}
  else if(e.type==='rect')c.fillRect(x,y,w,h);
  else if(e.type==='rule'){c.lineWidth=(e.lineWidth||.001)*W;c.beginPath();c.moveTo(x,y);c.lineTo(x+w,y+(e.h||0)*H);c.stroke();}
  else if(e.type==='circle'){c.beginPath();c.ellipse(x+w/2,y+h/2,w/2,h/2,0,0,Math.PI*2);if(e.stroke){c.lineWidth=(e.lineWidth||.002)*W;c.stroke();}else c.fill();}
  else if(e.type==='curve'){c.beginPath();for(const [op,...v] of e.commands){if(op==='M')c.moveTo(v[0]*W,v[1]*H);else if(op==='L')c.lineTo(v[0]*W,v[1]*H);else if(op==='C')c.bezierCurveTo(v[0]*W,v[1]*H,v[2]*W,v[3]*H,v[4]*W,v[5]*H);else if(op==='Z')c.closePath();}if(e.fill)c.fill();else{c.lineWidth=(e.lineWidth||.002)*W;c.stroke();}}
  else if(e.type==='path'||e.type==='polygon'){c.beginPath();e.points.forEach(([px,py],i)=>i?c.lineTo(px*W,py*H):c.moveTo(px*W,py*H));if(e.closed||e.type==='polygon')c.closePath();if(e.type==='polygon')c.fill();else{c.lineWidth=(e.lineWidth||.003)*W;c.stroke();}}
  else if(e.type==='photo'&&img){
   const photo=photoSlots[e.slot??0]||img;
   c.beginPath();if(e.circle)c.ellipse(x+w/2,y+h/2,w/2,h/2,0,0,Math.PI*2);else c.rect(x,y,w,h);c.clip();
   const iw=photo.naturalWidth||photo.width,ih=photo.naturalHeight||photo.height,scale=Math.max(w/iw,h/ih)*(s.zoom||1),dw=iw*scale,dh=ih*scale;
   if(e.gray)c.filter='grayscale(1)';c.drawImage(photo,x+(w-dw)*(s.pan??50)/100,y+(h-dh)/2,dw,dh);c.filter='none';
   if(s.paletteId){c.globalAlpha=.10;c.fillStyle=s.bg;c.fillRect(x,y,w,h);if(p.elements.some(t=>t.type==='text'&&inside(e,t.x+t.w/2,t.y+t.h/2))){c.globalAlpha=.22;c.fillStyle='#111713';c.fillRect(x,y,w,h);}}
  }else if(e.type==='text'){
   if(e.clip){c.beginPath();c.rect(e.clip[0]*W,e.clip[1]*H,e.clip[2]*W,e.clip[3]*H);c.clip();}
   if(s.paletteId){const beneath=p.elements.slice(0,p.elements.indexOf(e)).filter(a=>['rect','polygon','photo'].includes(a.type)&&inside(a,e.x+e.w/2,e.y+e.h/2)).at(-1);if(beneath?.type==='photo')c.fillStyle=s.photoInk;else{const bg=color(beneath?.color||'bg'),ink=color(e.color||'fg');if(contrast(ink,bg)<4.5)c.fillStyle=contrast(s.fg,bg)>contrast(s.bg,bg)?s.fg:s.bg;}}
   let value=String(s[e.field]??'');if(e.lineRange)value=value.split('\n').slice(...e.lineRange).join('\n');if(e.lineIndex!==undefined)value=value.split('\n')[e.lineIndex]||'';if(e.charIndex!==undefined)value=Array.from(value.replace(/\s/g,''))[e.charIndex]||'';if(e.slice)value=Array.from(value).slice(...e.slice).join('');
   if(!value){c.restore();continue;}
   const rows=e.vertical?Array.from(value.replace(/\s/g,'')).map(char=>char):value.split('\n');
   const main=e.field==='title'||e.field==='brand',override=main&&s.font!=='auto'?resolveTypography(s.font,s.layout):null;
   const family=override?.family||fonts[e.font]||fonts.sans,weight=override?.weight||e.weight||(e.font==='bold'?'800':e.font==='light'?'200':'400');
   let size=e.size*W*(main?(s.fontSize||110)/110:1);const tracking=(e.tracking||0)*W;
   const measure=row=>c.measureText(row).width+Math.max(0,Array.from(row).length-1)*tracking;
   const set=()=>c.font=`${e.italic?'italic ':''}${weight} ${size}px ${family}`;set();
   while(size>3&&(rows.length*size*1.05>h||(!e.stretch&&Math.max(...rows.map(measure))>w))){size*=.96;set();}
   c.translate(x+w/2,y+h/2);if(e.rotate)c.rotate(e.rotate*Math.PI/180);c.textBaseline='alphabetic';
   rows.forEach((row,i)=>{const rw=measure(row),tx=e.align==='center'?-rw/2:e.align==='right'?w/2-rw:-w/2,ty=-h/2+size*.82+i*size*1.05;c.save();if(e.stretch&&rw){c.translate(-w/2,ty);c.scale(w/rw,1);c.fillText(row,0,0);}else if(tracking){let dx=tx;for(const char of row){c.fillText(char,dx,ty);dx+=c.measureText(char).width+tracking;}}else c.fillText(row,tx,ty);c.restore();});
  }
  c.restore();
 }
}
