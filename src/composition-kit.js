import {resolveTypography,paperInk} from './typography.js';
const sans='"Helvetica Neue", "PingFang SC", sans-serif';
export function createKit(c,s,img,W,H,preset){
 const type=resolveTypography(s.font==='auto'?preset.font:s.font,s.layout);
 function body(content,x,y,w,h,size=18,o={}){
  if(!content||w<=0||h<=0)return;
  const family=o.font||sans,weight=o.weight||'400',px=w*W,py=h*H;
  let rows=[],f=size;
  const wrap=()=>{rows=[];for(const paragraph of String(content).split('\n')){let line='';for(const glyph of Array.from(paragraph)){if(c.measureText(line+glyph).width>px&&line){rows.push(line);line='';}line+=glyph;}rows.push(line);}};
  do{c.font=`${weight} ${f}px ${family}`;wrap();if(rows.length*f*1.16<=py)break;f-=1;}while(f>3);
  c.save();c.beginPath();c.rect(x*W,y*H,px,py);c.clip();c.fillStyle=o.color||s.fg;c.font=`${weight} ${f}px ${family}`;c.textBaseline='top';c.textAlign=o.align||'left';
  rows.forEach((line,i)=>c.fillText(line,(x+(o.align==='center'?w/2:o.align==='right'?w:0))*W,y*H+i*f*1.16));c.restore();
 }
 function image(x,y,w,h,o={}){
  c.save();const X=x*W,Y=y*H,A=w*W,B=h*H;c.translate(X+A/2,Y+B/2);c.rotate(o.rotate||0);c.globalAlpha=o.alpha??1;c.beginPath();
  if(o.mask==='circle')c.ellipse(0,0,A/2,B/2,0,0,Math.PI*2);
  else if(o.mask==='diamond'){c.moveTo(0,-B/2);c.lineTo(A/2,0);c.lineTo(0,B/2);c.lineTo(-A/2,0);c.closePath();}
  else if(o.mask==='arch'){const radius=Math.min(A/2,B/2);c.moveTo(-A/2,B/2);c.lineTo(-A/2,-B/2+radius);c.arcTo(-A/2,-B/2,0,-B/2,radius);c.arcTo(A/2,-B/2,A/2,0,radius);c.lineTo(A/2,B/2);c.closePath();}
  else c.rect(-A/2,-B/2,A,B);
  c.clip();const scale=Math.max(A/img.naturalWidth,B/img.naturalHeight)*(Number(s.zoom)||1),dw=img.naturalWidth*scale,dh=img.naturalHeight*scale;c.drawImage(img,-A/2+(A-dw)*(Number(s.pan)/100),-B/2+(B-dh)/2,dw,dh);c.restore();
  if(o.mask==='stamp'){c.save();c.fillStyle=s.bg;for(let t=0;t<A;t+=24){for(const edge of [Y,Y+B]){c.beginPath();c.arc(X+t,edge,5,0,7);c.fill();}}for(let t=0;t<B;t+=24){for(const edge of [X,X+A]){c.beginPath();c.arc(edge,Y+t,5,0,7);c.fill();}}c.restore();}
 }
 return {c,state:s,W,H,preset,image,body,ink:bg=>paperInk(bg,s.fg,s.bg),title:(x,y,w,h,m=1,o={})=>body(s.title,x,y,w,h,(Number(s.fontSize)||110)*m,{font:type.family,weight:type.weight,...o}),label:(t,x,y,w=.4,o={})=>body(t,x,y,w,.035,13,o),rect:(x,y,w,h,color)=>{c.save();c.fillStyle=color;c.fillRect(x*W,y*H,w*W,h*H);c.restore();},rule:(x,y,w,color=s.fg)=>{c.save();c.strokeStyle=color;c.lineWidth=1;c.beginPath();c.moveTo(x*W,y*H);c.lineTo((x+w)*W,y*H);c.stroke();c.restore();},mark:(kind,x,y,size,color=s.accent)=>{c.save();c.strokeStyle=color;c.fillStyle=color;c.lineWidth=2;const X=x*W,Y=y*H,R=size*W/2;c.beginPath();if(kind==='seal'){c.strokeRect(X,Y,R*2,R*2);c.fillRect(X+R*.35,Y+R*.35,R*.5,R*.5);c.fillRect(X+R*1.15,Y+R*.35,R*.5,R*1.3);}else if(kind==='cross'){c.moveTo(X,Y+R);c.lineTo(X+R*2,Y+R);c.moveTo(X+R,Y);c.lineTo(X+R,Y+R*2);c.stroke();}else if(kind==='star'){for(let i=0;i<16;i++){const a=i*Math.PI/8,r=i%2?R*.4:R;c.lineTo(X+R+Math.cos(a)*r,Y+R+Math.sin(a)*r);}c.closePath();c.fill();}else{c.ellipse(X+R,Y+R,R,R*.5,-.5,0,7);c.stroke();c.beginPath();c.arc(X+R,Y+R,R*.6,0,7);c.stroke();}c.restore();}};
}
