import {createKit} from './composition-kit.js';
import {resolveTypography} from './typography.js';
const sans='"Helvetica Neue", "PingFang SC", sans-serif';
const serif='"Bodoni Moda", "Didot", "Songti SC", serif';
const script='"Snell Roundhand", cursive';
export function renderObserved(c,s,img,W,H,preset){
 const key=preset.composition.replace('observed:',''),k=createKit(c,s,img,W,H,preset),{bg,fg,accent}=s;
 const on=part=>s.layers?.[part]!==false;
 const rawImage=k.image,rawRect=k.rect,rawRule=k.rule;
 k.rule=(...args)=>{if(on('lines'))rawRule(...args);};
 k.image=(...args)=>{if(on('image'))rawImage(...args);};
 k.rect=(...args)=>{if(on('partition'))rawRect(...args);};
 const type=resolveTypography(s.font==='auto'?preset.font:s.font,s.layout);
 const body=(t,x,y,w,h,size=16,options={})=>{if(on('text'))k.body(t,x,y,w,h,size,{color:fg,...options});};
 const centered=(t,x,y,w,h,size=16,options={})=>body(t,x,y,w,h,size,{align:'center',...options});
 const title=(x,y,w,h,size=1,o={})=>{if(on('text'))k.title(x,y,w,h,size,{...o,...(s.font!=='auto'?{font:type.family,weight:type.weight}:{})});};
 function stroke(points,color=fg,alpha=.15){if(!on('lines'))return;c.save();c.strokeStyle=color;c.globalAlpha=alpha;c.lineWidth=.65;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x*W,y*H):c.moveTo(x*W,y*H));c.stroke();c.restore();}
 function dot(x,y,r=.002,alpha=.22){if(!on('lines'))return;c.save();c.globalAlpha=alpha;c.fillStyle=fg;c.beginPath();c.arc(x*W,y*H,r*W,0,7);c.fill();c.restore();}
 function grid(xs,ys){for(const x of xs)stroke([[x,0],[x,1]],fg,.07);for(const y of ys)stroke([[0,y],[1,y]],fg,.05);for(const x of xs)for(const y of ys)dot(x,y,.0025,.22);}
 function star(x,y,size,color=fg){if(!on('ornament'))return;c.save();c.translate(x*W,y*H);c.strokeStyle=color;c.lineWidth=1.6;const R=size*W;for(let i=0;i<8;i++){c.save();c.rotate(i*Math.PI/4);c.strokeRect(-R*.065,-R*.5,R*.13,R*.40);c.restore();}c.restore();}
 function signature(t,x,y,w=.2,color=fg){if(on('ornament'))k.body(t,x,y,w,.055,29,{font:script,color});}
 function stretch(t,x,y,w,h,{font=type.family,weight=type.weight,italic=false,color=fg}={}){
  if(!on('text'))return;
  if(s.font!=='auto'){font=type.family;weight=type.weight;}
  const lines=String(t||' ').split('\n'),gap=.08,each=h/(lines.length+(lines.length-1)*gap);
  for(let n=0;n<lines.length;n++){
   c.save();c.font=`${italic?'italic ':''}${weight} 100px ${font}`;const metrics=c.measureText(lines[n]),asc=metrics.actualBoundingBoxAscent||80,desc=metrics.actualBoundingBoxDescent||0;
   const factor=Math.min(1.22,Math.max(.35,Number(s.fontSize)/110));c.translate(x*W,y*H+n*each*(1+gap)*H);c.scale(w*W/Math.max(1,metrics.width),each*H*factor/Math.max(1,asc+desc));c.fillStyle=color;c.textBaseline='alphabetic';c.fillText(lines[n],0,asc);c.restore();
  }
 }
 function smallNotes(x,y,w=.15,color=fg,align='left'){body('LAYOUT IS A METHOD\nNOT A RESULT\nCHANCE IS A WORKING TOOL\nORDER GROWS ACCIDENTAL\nTHE PAGE BECOMES ITSELF',x,y,w,.04,5.5,{color,align});}
 function seal(x,y,size=.055,color=fg){if(!on('ornament'))return;c.save();c.strokeStyle=color;c.lineWidth=1.7;c.strokeRect(x*W,y*H,size*W,size*W);c.strokeRect((x+size*.35)*W,(y+size*.25)*H,size*.35*W,size*.4*W);c.restore();}
 // Positions below come directly from the individual captured frames.
 if(key==='right-photo'){
  stretch(s.kicker,.032,.035,.935,.046,{font:sans,weight:'200'});
  ['Layout speaks','让留白替你开口说话','网格是一切版面的基础','网格决定留白','抽卡就是维持'].forEach((t,i)=>body(t,.032+i*.223,.10,.21,.02,9));
  k.image(.606,.148,.363,.413);
  body('LAB BEGINS\nA CLICK\nTHE GRID CHANGES\nA PAGE APPEARS',.033,.438,.47,.054,14,{font:sans,weight:'300'});
  title(.033,.498,.51,.041,.52,{weight:'800',font:sans});body(s.subtitle,.033,.544,.45,.025,16,{weight:'600'});
  body('VOL ONE',.032,.397,.3,.018,8);smallNotes(.032,.32,.18);smallNotes(.49,.17,.07,fg,'right');
  grid([.08,.52,.92],[.61,.664,.72,.776,.833,.888,.944]);return;
 }
 if(key==='paper-strip'){
  k.rect(.033,.026,.508,.749,accent);
  title(.284,.049,.226,.092,.51,{align:'right',font:sans,weight:'800'});
  body(s.subtitle,.22,.146,.29,.024,16,{align:'right',weight:'700'});body(s.kicker,.19,.161,.32,.017,12,{align:'right',font:sans,weight:'300'});
  smallNotes(.383,.233,.127,fg,'right');body('网格已重排',.383,.281,.127,.016,8,{align:'right'});smallNotes(.383,.316,.127,fg,'right');
  c.save();c.beginPath();c.moveTo(.033*W,.795*H);for(let n=0;n<=36;n++){const x=.033+.508*n/36,y=.788+((n*17)%11)/900;c.lineTo(x*W,y*H);}c.lineTo(.541*W,.976*H);c.lineTo(.033*W,.976*H);c.closePath();c.clip();k.image(.033,.786,.508,.190);c.restore();
  grid([.378,.556,.583,.614],[0,.25,.553,.844,.857,.997]);smallNotes(.063,.722,.27);star(.941,.047,.058);signature('Empty Space.',.854,.941,.116);return;
 }
 if(key==='third-photo'){
  k.image(.668,0,.332,1);grid([0,.50,.539,.578,.655],[0,.355,.373,.428,.465,.52,1]);
  centered(s.subtitle,.218,.039,.227,.083,19,{font:serif,weight:'600'});
  title(.231,.145,.21,.083,.60,{font:script,weight:'600',align:'center'});
  smallNotes(.28,.278,.13,fg,'center');smallNotes(.268,.328,.17,fg,'center');smallNotes(.27,.927,.16,fg,'center');
  seal(.033,.026,.063);if(on('ornament')){c.save();c.strokeStyle=fg;c.lineWidth=1.3;c.beginPath();c.arc(.062*W,.952*H,.027*W,0,7);c.stroke();c.restore();
  stroke([[.034,.952],[.062,.924],[.09,.952],[.062,.978],[.034,.952]],fg,.9);}return;
 }
 if(key==='pale-rays'){
  k.image(0,0,1,1);if(on('image')){c.save();c.globalAlpha=.9;rawRect(0,0,1,1,bg);c.restore();}
  grid([.04,.08,.241,.5,.622,.92,.96],[0,1]);
  for(const point of [[0,.273],[0,.425],[0,.536],[0,.75],[.36,1],[.83,1],[1,.991],[1,.671],[.60,0]])stroke([[.23,.5],point],fg,.2);
  signature('Brief Prologue.',.035,.025,.16);
  for(let i=0;i<4;i++)centered(['KEEP WHAT YOU LOVE\nSHAKE IT OFF IF NOT\nTHE GRID CHANGES\nTHE WORLD CHANGES','A PAGE HAS A SKELETON\nIT EXISTS BEFORE THE WORDS\nTHE WORDS SIT ON IT\nLATER','A GRID IS NOT A CAGE\nIT IS THE BONE THE PAGE STANDS ON\nWORDS WALK ON IT\nIMAGES PAUSE BESIDE IT','NUMBERS SHAPE THE PROPORTION\nPROPORTION SHAPES THE STRUCTURE\nSTRUCTURE SHAPES THE BREATHING\nBREATHING SHAPES THE PAGE'][i],.418,.059+i*.06,.166,.041,7);
  centered(s.kicker,.34,.301,.32,.025,17,{weight:'200'});
  stretch(s.title,.218,.364,.565,.121,{font:serif,italic:true});
  centered(s.subtitle,.39,.537,.235,.07,18,{weight:'200'});
  centered('WARM\nPAPER',.43,.728,.14,.037,24,{font:serif});smallNotes(.45,.775,.1,fg,'center');smallNotes(.443,.823,.118,fg,'center');smallNotes(.45,.926,.1,fg,'center');signature('Empty Space.',.86,.943,.12);return;
 }
 if(key==='photo-word'){
  c.save();c.filter=`blur(${18*c.getTransform().a}px)`;k.image(-.02,-.02,1.04,1.04);c.restore();if(on('image')){c.save();c.globalAlpha=.70;rawRect(0,0,1,1,bg);c.restore();}
  grid([0,.04,.082,.617],[.026,.051,.076,.095,.116,.485,.502,.904,.950]);
  smallNotes(.445,.036,.115,fg,'center');centered('An image imported\nthe grid makes room\ntype arrives after',.438,.126,.124,.03,9);
  title(.40,.163,.20,.065,.39,{font:sans,weight:'400',align:'center'});
  centered(s.subtitle,.458,.277,.092,.043,18);centered('White space is not empty\nit carries the page’s voice\nwithout a shout\ntype and image lose their air',.455,.326,.095,.023,6.3);
  centered('Digits before proportions\nProportion remakes the page\ntype finds its reading',.459,.371,.084,.016,6.2);
  if(on('window')){const layer=document.createElement('canvas');const pixelRatio=c.getTransform().a;layer.width=Math.round(W*pixelRatio);layer.height=Math.round(H*pixelRatio);const lc=layer.getContext('2d');lc.scale(pixelRatio,pixelRatio);const lk=createKit(lc,s,img,W,H,preset);lk.image(0,0,1,1);lc.globalCompositeOperation='destination-in';lc.fillStyle='#000';lc.font=`italic 650px ${script}`;lc.textBaseline='alphabetic';const word=s.kicker.replace(/\n/g,' '),metrics=lc.measureText(word);lc.save();lc.translate(-W*.06,H*.60);lc.scale(W*1.16/Math.max(1,metrics.width),H*.37/Math.max(1,metrics.actualBoundingBoxAscent+metrics.actualBoundingBoxDescent));lc.fillText(word,0,metrics.actualBoundingBoxAscent);lc.restore();c.drawImage(layer,0,0,W,H);}smallNotes(.902,.928,.067,fg,'right');return;
 }
 if(key==='specimen'){
  smallNotes(.621,.191,.076,fg,'center');smallNotes(.916,.17,.054,fg,'right');
  stretch('GGGGGG',-.006,.276,.94,.051,{font:sans,weight:'300'});body(s.kicker,.502,.255,.22,.066,41,{weight:'200'});
  ['VOL I','样张','页码','SHAKE FOR A NEW PAGE','№ 02'].forEach((t,i)=>body(t,i*.23,.344,.24,.022,9));
  smallNotes(.268,.433,.17);body('一键换一页',.033,.555,.22,.022,16,{weight:'800'});body('背景',.033,.577,.1,.016,6);
  body('SPECIMEN',.169,.70,.46,.02,17,{weight:'700'});title(.168,.722,.50,.038,.46,{font:sans,weight:'800'});body(s.subtitle,.169,.767,.40,.035,16,{weight:'600'});
  k.image(.168,.828,.528,.148);star(.061,.953,.057);if(on('ornament')){c.save();c.strokeStyle=fg;c.lineWidth=1.3;c.beginPath();c.arc(W*.942,H*.952,W*.025,0,7);c.stroke();c.restore();}return;
 }
 if(key==='spiral'){
  if(on('shape')){c.save();c.strokeStyle=accent;c.lineWidth=.7;c.beginPath();for(let i=0;i<=1600;i++){const a=i/1600*Math.PI*8.4,r=.01+i/1600*.78,x=.225+r*Math.cos(a),y=.536+r*Math.sin(a)*W/H;i?c.lineTo(x*W,y*H):c.moveTo(x*W,y*H);}c.stroke();c.restore();}
  signature('Pure Gaze.',.035,.022,.17);smallNotes(.532,.034,.095,fg,'right');star(.938,.047,.061);
  for(const x of [.04,.105,.355,.646,.662,.702,.758,.814,.869,.884,.90])dot(x,.096,.0028,.40);
  centered(s.kicker,.404,.118,.224,.025,24,{font:type.family,weight:'200'});
  stretch(s.title,.302,.160,.322,.127,{font:type.family,weight:'500'});
  body(s.subtitle,.541,.317,.089,.087,22,{font:type.family,weight:'200',align:'right'});
  body('标题定音\n正文跟随',.539,.452,.09,.044,20,{font:type.family,weight:'200',align:'right'});
  centered('TYPE\nMEETS\nGRID',.525,.540,.104,.062,24,{weight:'700'});centered('一次抽签\n一个新页面\n偶然来了',.563,.611,.064,.022,7);smallNotes(.556,.66,.067,fg,'right');smallNotes(.033,.939,.15);smallNotes(.929,.939,.045,fg,'right');return;
 }
 if(key==='clash'){
  k.rect(0,0,1,.347,fg);
  stretch(s.title,0,.002,1,.252,{font:serif,weight:'400',color:bg});
  centered('版面有节奏\nVoid Speaks\n偶然也能成为方法',.45,.287,.10,.035,8,{color:bg});
  if(on('shape')){c.save();c.fillStyle=accent;c.globalAlpha=.6;
  for(const [x,y,w,h] of [[.128,.348,.322,.28],[.128,.625,.322,.244],[.128,.870,.645,.13]]){c.beginPath();c.ellipse((x+w/2)*W,(y+h/2)*H,w*W/2,h*H/2,0,0,7);c.fill();}
  c.beginPath();c.moveTo(W*.774,H*.385);c.lineTo(W*1.095,H*.628);c.lineTo(W*.774,H*.867);c.lineTo(W*.45,H*.628);c.closePath();c.fill();c.restore();}
  centered('抽签 + 网格 + 文字 + 留白',.418,.43,.167,.016,10);
  stretch(s.kicker,.335,.473,.33,.12,{font:serif,weight:'400'});
  centered(s.subtitle,.448,.626,.104,.049,16);
  centered('RELEASE\nPAGE',.445,.711,.111,.04,21,{font:serif});centered('COLOR\nSPEAKS\nFASTEST',.45,.807,.10,.05,20,{font:serif});smallNotes(.48,.926,.04,fg,'center');star(.938,.95,.057);return;
 }
 if(key==='blue-rail'){
  k.rect(.843,0,.157,1,fg);const ink=bg;
  stretch(s.kicker,.075,.035,.854,.060,{font:serif,color:fg});
  body('留白是版式的呼吸\n版式在前句子在后',.033,.117,.18,.022,9);centered('一抽一页一灵感\nVoid Speaks',.884,.116,.088,.025,9,{color:ink});
  smallNotes(.033,.184,.09);seal(.033,.406,.06);seal(.033,.510,.06);
  centered(s.subtitle,.423,.473,.153,.085,18,{font:serif});title(.375,.585,.253,.095,.70,{font:serif,weight:'200',align:'center'});centered('01 / 形式研究',.45,.704,.1,.023,14,{font:serif});
  body('图归格',.897,.488,.07,.027,17,{color:ink});smallNotes(.033,.684,.067);body('留白也让步',.045,.953,.18,.02,8);body('让边距更安静',.47,.953,.18,.02,8);return;
 }
 if(key==='green-footer'){
  if(on('shape')){c.save();c.globalAlpha=.4;k.body('＆',-.05,-.27,1.03,.5,490,{font:serif,color:accent});c.restore();}
  k.rule(.033,.026,.936,fg);['字像格子','让边距说话','有序的随机'].forEach((t,i)=>body(t,.048+i*.41,.039,.25,.019,10));
  body('White space is not empty\nit carries the page’s voice\nwithout a shout\ntype and image lose their air',.033,.373,.238,.069,16,{font:serif,weight:'200'});
  title(.033,.477,.435,.108,.60,{font:serif,weight:'200'});body(s.subtitle,.033,.613,.40,.025,14,{font:serif});
  body('留白有声',.875,.393,.094,.029,18,{font:serif});body('网格之外\n才有意外',.875,.502,.094,.037,18,{font:serif});smallNotes(.033,.702,.075);smallNotes(.90,.70,.068,fg,'right');
  k.rect(0,.778,1,.222,fg);['样本','VOL II','页码','新一版','抽签'].forEach((t,i)=>body(t,.033+i*.218,.89,.18,.016,8,{color:bg}));stretch(s.kicker,.033,.915,.936,.05,{font:serif,italic:true,color:bg});return;
 }
 throw Error('No captured reference for '+key);
}
