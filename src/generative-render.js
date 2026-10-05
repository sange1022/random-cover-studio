import {generateComposition} from './generative.js';
import {resolveTypography} from './typography.js';
const families={bold:'"Helvetica Neue", "PingFang SC", sans-serif',sans:'"Helvetica Neue", "PingFang SC", sans-serif',light:'"Helvetica Neue", "PingFang SC", sans-serif',condensed:'"Arial Narrow", "PingFang SC", sans-serif',serif:'"Songti SC", "Times New Roman", serif'};
const sans='"Helvetica Neue", "PingFang SC", sans-serif';
function wrap(c,value,width){const rows=[];for(const paragraph of value.split('\n')){let row='';const tokens=paragraph.match(/[A-Za-z0-9]+(?:[’':./—-][A-Za-z0-9]+)*\s*|[^\x00-\x7F]|.|\s/g)||[''];for(const token of tokens){if(row&&c.measureText(row+token).width>width){rows.push(row.trimEnd());row='';}if(c.measureText(token).width>width){for(const char of token){if(row&&c.measureText(row+char).width>width){rows.push(row);row='';}row+=char;}}else row+=token;}rows.push(row.trimEnd());}return rows;}
export function renderGenerative(c,s,img,W,H){
 const design=generateComposition(s),custom=s.font&&s.font!=='auto'?resolveTypography(s.font,s.layout):null;
 for(const e of design.items){
  let x=e.x*W,y=e.y*H,w=e.w*W,h=e.h*H;
  if(e.kind==='circle'){c.save();c.strokeStyle=s.accent;c.lineWidth=W*.002;c.beginPath();c.ellipse(x+w/2,y+h/2,w/2,h/2,0,0,Math.PI*2);c.stroke();c.restore();continue;}
  if(e.kind==='photo'){if(img){const iw=img.naturalWidth||img.width,ih=img.naturalHeight||img.height,scale=Math.max(w/iw,h/ih)*(s.zoom||1);c.save();c.beginPath();c.rect(x,y,w,h);c.clip();c.drawImage(img,x+(w-iw*scale)*(s.pan??50)/100,y+(h-ih*scale)/2,iw*scale,ih*scale);c.restore();}continue;}
  const isTitle=e.kind==='title',role=isTitle?(s.freeTypography?.heading||'bold'):(s.freeTypography?.body||'sans'),weight=isTitle?(role==='light'?'200':role==='serif'?'400':'700'):e.kind==='name'?'600':'400',family=custom?.family||families[role]||sans;
  let size=e.size*W*(isTitle?(s.fontSize||110)/110:1),rows,step,tw=w,th=h;
  if(e.rotate&&Math.abs(e.rotate)===90){tw=h;th=w;}else if(e.rotate){const a=Math.abs(e.rotate)*Math.PI/180,k=Math.min(w/(w*Math.cos(a)+h*Math.sin(a)),h/(w*Math.sin(a)+h*Math.cos(a)));tw=w*k;th=h*k;}
  if(e.background){c.fillStyle=s[e.background];c.fillRect(x,y,w,h);tw*=.9;th*=.9;}
  do{c.font=`${custom?.weight||weight} ${size}px ${family}`;rows=wrap(c,e.value,tw);step=size*1.09;if(rows.length*step<=th&&Math.max(...rows.map(t=>c.measureText(t).width))<=tw)break;size*=.95;}while(size>1.8);
  c.save();c.fillStyle=e.ink?s[e.ink]:isTitle?s.fg:(s.freeBodyInk||s.fg);c.textBaseline='alphabetic';c.translate(x+w/2,y+h/2);if(e.rotate)c.rotate(e.rotate*Math.PI/180);
  rows.forEach((row,i)=>{const rw=c.measureText(row).width,tx=e.align==='right'?tw/2-rw:e.align==='center'?-rw/2:-tw/2;c.fillText(row,tx,-th/2+size*.84+i*step);});c.restore();
  if(design.rules&&e.kind!=='footer'&&e.kind!=='overlay'){c.save();c.strokeStyle=s.fg;c.globalAlpha=.5;c.lineWidth=W*.001;c.beginPath();c.moveTo(x,y+h+H*.006);c.lineTo(x+w,y+h+H*.006);c.stroke();c.restore();}
 }
}
