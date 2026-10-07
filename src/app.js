import {historyLimit,packHistory,unpackHistory,readHistory,writeHistory} from './history.js';
import {exportDimensions} from './export-quality.js';
import {uploadedPresets} from './uploaded-presets.js';
import {styleFamilies,styleFamily,filterStyles,familyCount} from './style-families.js';
import {generateComposition,structureNames} from './generative.js';
import {generativeStyles,applyGenerativeStyle} from './generative-styles.js';
import {masterPresets,masterFields,applyMaster} from './master-presets.js';
import {defaultLayers,layerNames} from './combination.js';
import {observedPresets} from './reference-presets.js';
import {catalog,filterCatalog,groups} from './catalog.js';
import {palettes,dimensions,layoutNames} from './layout.js';
import {render as renderCover} from './render.js';
import {paletteLibrary,paletteGroups,paletteState} from './palettes.js';
import {randomIndex,preserveCopy,sampleIndices} from './selection.js';
const $=id=>document.getElementById(id);
const names=layoutNames;
let state={...masterPresets[0].copy,layout:catalog.findIndex(p=>p.source==='master'),referenceKey:'right-photo',layers:{...defaultLayers},locks:{},experimental:true,ratio:masterPresets[0].ratio,title:masterPresets[0].copy.title,subtitle:masterPresets[0].copy.subtitle,kicker:masterPresets[0].copy.kicker,bg:'#f5f0e0',fg:'#080a07',accent:'#f5f2e9',fontSize:110,font:'auto',zoom:1,pan:50,variant:.5,serial:1};
let image=null,imageName='示例图',mode=String(state.layout),history=[],active=-1,toastTimer,uploadVersion=0;
const samplePhotoImages=new Map();
let backgroundImage=null,backgroundName='',backgroundUploadVersion=0;
function currentExportSize(){return exportDimensions(state.ratio,[image,backgroundImage,...(userUploaded?[]:samplePhotoImages.get(catalog[state.layout]?.id)||[])],undefined,state.exportQuality||'highest');}
function render(canvas,s,img,width=900){renderCover(canvas,s,img,width,backgroundImage,userUploaded?[]:samplePhotoImages.get(catalog[s.layout]?.id)||[]);}
let studioReady=false,userUploaded=false,copyEdited=false;const sampleImages=new Map();
$('title').value=state.title;$('subtitle').value=state.subtitle;
function toast(message){$('toast').textContent=message;$('toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),3200);}
function fitPreview(){const canvas=$('preview'),stage=canvas.parentElement,css=getComputedStyle(stage),w=stage.clientWidth-parseFloat(css.paddingLeft)-parseFloat(css.paddingRight),h=stage.clientHeight-parseFloat(css.paddingTop)-parseFloat(css.paddingBottom),ratio=canvas.width/canvas.height;if(w<=0||h<=0)return;const width=Math.min(w,h*ratio);canvas.style.width=Math.floor(width)+'px';canvas.style.height=Math.floor(width/ratio)+'px';}
new ResizeObserver(fitPreview).observe($('preview').parentElement);
function paint(){if(!image)return;updateStyleNote();render($('preview'),state,image);fitPreview();const d=currentExportSize();$('canvas-size').textContent=`无损 PNG · ${d.width} × ${d.height} px${d.limited?' · 浏览器尺寸上限':''}`;$('layout-name').textContent=state.combination?'组合 / 图、字、装饰独立抽取':['master','folder','recommendation','generative'].includes(catalog[state.layout].source)?names[state.layout]:catalog[state.layout].source==='observed'?`视频 ${catalog[state.layout].time} 秒 / ${names[state.layout]}`:`基础 / ${names[state.layout]}`;document.querySelectorAll('[data-ratio]').forEach(b=>b.classList.toggle('selected',b.dataset.ratio===state.ratio||(b.dataset.ratio==='original'&&state.ratio===catalog[state.layout].ratio)));document.querySelectorAll('[data-palette]').forEach(b=>b.classList.toggle('chosen',paletteLibrary[b.dataset.palette].id===state.paletteId));}
function sync(){
 for(const key of [...masterFields,'bg','fg','accent'])$(key).value=state[key]??'';
 $('background-opacity').value=state.backgroundOpacity??100;$('background-opacity-value').value=(state.backgroundOpacity??100)+'%';$('background-name').textContent=backgroundName||'未添加背景图';$('remove-background').disabled=!backgroundImage;
 $('export-quality').value=state.exportQuality||'highest';
 $('font').value=state.font||'auto';$('font-size').value=state.fontSize;$('font-value').value=state.fontSize;
 $('zoom').value=Math.round(state.zoom*100);$('zoom-value').value=Math.round(state.zoom*100)+'%';$('pan').value=state.pan;$('pan-value').value=state.pan+'%';
 $('free-design').value=state.freeDesign??'custom';$('free-shuffle-design').checked=Boolean(state.freeShuffleDesign);$('free-route').value=state.freeRoute??'auto';$('free-overlay').checked=Boolean(state.freeOverlay);$('free-paragraphs').value=state.freeParagraphs??'';$('free-freedom').value=state.freeFreedom??65;$('free-freedom-value').value=state.freeFreedom??65;$('free-rules').checked=state.freeRules!==false;$('free-photo').checked=Boolean(state.freePhoto);updateActiveStyle();paint();updatePaletteName();
}
function updateActiveStyle(){document.querySelectorAll('#layout-list [data-mode]').forEach(b=>{const chosen=Number(b.dataset.mode)===state.layout;b.classList.toggle('selected',chosen);b.setAttribute('aria-pressed',String(chosen));});}
let historySaveTimer,historyStorageWarning=false;
function persistHistory(){clearTimeout(historySaveTimer);historySaveTimer=setTimeout(()=>{writeHistory(packHistory(history,active)).catch(()=>{if(!historyStorageWarning){historyStorageWarning=true;toast('浏览器存储已满，当前记录仍可回看；刷新后可能无法保留');}});},100);}
window.addEventListener('pagehide',()=>{clearTimeout(historySaveTimer);if(history.length)writeHistory(packHistory(history,active)).catch(()=>{});});
$('save-version').addEventListener('click',()=>{if(!image)return;state.serial++;remember('保存');toast('已保存当前版本');});
function updateHistoryNavigation(){$('history-prev').disabled=!history.length||active>=history.length-1;$('history-next').disabled=active<=0;}
function edited(){active=-1;document.querySelectorAll('.history-card').forEach(b=>b.classList.remove('active'));updateHistoryNavigation();paint();}
function remember(kind='随机'){if(!image)return;const thumbnail=document.createElement('canvas');render(thumbnail,state,image,150);history.unshift({state:structuredClone(state),image,imageName,backgroundImage,backgroundName,userUploaded,copyEdited,kind,thumbnail:thumbnail.toDataURL('image/png')});history=history.slice(0,historyLimit);active=0;showHistory();persistHistory();}
function rememberBeforeRandom(){if(active===-1||!history.length)remember('起点');}
function restoreHistory(i,notify=true){const entry=history[i];if(!entry)return;state=structuredClone(entry.state);image=entry.image;imageName=entry.imageName;backgroundImage=entry.backgroundImage||null;backgroundName=entry.backgroundName||'';userUploaded=Boolean(entry.userUploaded);copyEdited=Boolean(entry.copyEdited);active=i;mode=state.combination?'combine':String(state.layout);$('style-group').value=styleFamily(catalog[state.layout]);$('style-source').value='全部';$('style-search').value='';sync();showStyles();showHistory();persistHistory();if(notify)toast('已恢复这张封面');}
$('history-prev').addEventListener('click',()=>restoreHistory(active<0?0:active+1));
$('history-next').addEventListener('click',()=>{if(active>0)restoreHistory(active-1);});
function showHistory(){const root=$('history');root.replaceChildren();history.forEach((entry,i)=>{const b=document.createElement('button');b.className='history-card'+(i===active?' active':'');b.title=`${entry.kind||'记录'} · ${names[entry.state.layout]}`;b.setAttribute('aria-label',`恢复记录 ${history.length-i} · ${names[entry.state.layout]}`);const img=document.createElement('img');img.src=entry.thumbnail;img.alt=names[entry.state.layout];const number=document.createElement('span');number.textContent=String(history.length-i).padStart(2,'0');b.append(img,number);b.addEventListener('click',()=>restoreHistory(i));root.append(b);});if(!history.length){const p=document.createElement('p');p.className='history-empty';p.textContent='随机封面自动保存，可随时回到上一张。';root.append(p);}$('count').textContent=history.length;updateHistoryNavigation();root.children[active]?.scrollIntoView({block:'nearest',inline:'nearest'});}
$('font').addEventListener('change',()=>{state.font=$('font').value;edited();});
function filtered(){return filterStyles($('style-group').value||'全部样式',$('style-search').value,$('style-source').value||'全部');}
const allLayers=Object.fromEntries(Object.keys(layerNames).map(key=>[key,true]));
function updateStyleNote(){
 const p=catalog[state.layout],isMaster=p.source==='master',isFolder=['folder','recommendation'].includes(p.source),isGenerative=p.source==='generative';
 document.querySelector('label[for="brand"]').textContent=isGenerative?'名称 / 作者':'品牌文字';document.querySelector('label[for="kicker"]').textContent=isGenerative?'日期 / 时间':'角标 / 落款';$('generative-controls').hidden=!isGenerative;$('generative-actions').hidden=!isGenerative;if(isGenerative)$('free-structure').textContent='当前结构：'+generateComposition(state).name+' · 方案 '+(state.freeSeed??3011); 
 $('selected-text-fields').hidden=!(isMaster||isFolder);
 const visibleFields=isGenerative?['brand']:isFolder?p.fields:isMaster?({tea:['brand','vertical','left','right','body'],forest:['brand','eyebrow'],fields:['left','right','metaLeft','metaRight','body','fineprint']}[p.composition.slice(7)]):[];
 for(const key of masterFields.filter(k=>!['title','subtitle','kicker'].includes(k))){$(key).hidden=!visibleFields.includes(key);document.querySelector('label[for="'+key+'"]').hidden=!visibleFields.includes(key);}
 $('subtitle').hidden=(isMaster&&p.composition==='master:fields')||(isFolder&&!p.fields.includes('subtitle'));
 $('kicker').hidden=isFolder&&!p.fields.includes('kicker');document.querySelector('label[for="kicker"]').hidden=$('kicker').hidden;document.querySelector('label[for="subtitle"]').hidden=$('subtitle').hidden;
 document.querySelector('[data-ratio="original"]').hidden=!(isMaster||isFolder);
 $('image-name').textContent=userUploaded?imageName:'示例背景 · 可上传替换';
 $('style-note').textContent=isGenerative?'参考文字海报的共同规律：密集信息、共用网格、分段横线和底部留白。每次重新构图随机调整布局和字号；导出与版本保存保留当前方案。':isFolder?`${p.note}。文字位置按原图设置，字体使用本机近似；照片窗口可上传替换。`:isMaster?`${p.credit}。${p.fontNote}`:p.source==='observed'?`视频 ${p.time} 秒 · ${p.fontNote}`:'基础排版';
 $('reference').disabled=!p.referenceImage;$('reference-copy').disabled=!['observed','master','folder','recommendation','generative'].includes(p.source);
}
function selectionDraft(value,options={}){
 const index=Number(value),p=catalog[index];if(!p)return;
 const previous={...state},keepCopy=copyEdited||options.preserveCopy,keepPalette=(Boolean(state.paletteId)||options.preservePalette)&&!options.resetPalette;
 let next=structuredClone(state);
next.layout=index;next.combination=null;
 if(['master','folder','recommendation'].includes(p.source)){next=applyMaster(next,p,index);if(!keepCopy)Object.assign(next,p.copy);next.zoom=1;next.pan=50;}
 if(p.source==='generative'){if(!next.freeTypography||options.resetPalette){next.freeTypography={heading:'bold',body:'sans'};next.freeDesign='custom';}if(!keepCopy)Object.assign(next,p.copy);next.freeParagraphs??=copyEdited?(next.body||''):p.copy.freeParagraphs;next.freeSeed=options.keepSeed?next.freeSeed:Math.floor(Math.random()*2147483647);next.freeFreedom??=65;next.ratio='3:4';next.font='auto';next.fontSize=110;if(!keepPalette)[next.bg,next.fg,next.accent]=p.colors;}
 if(p.source==='observed'){next.referenceKey=p.composition.slice(9);[next.bg,next.fg,next.accent]=p.colors;next.font='auto';next.fontSize=110;next.layers={...allLayers};if(!keepCopy)Object.assign(next,p.copy);}
 if(keepCopy)next=preserveCopy(previous,next,masterFields);
 if(keepPalette){for(const key of ['bg','fg','accent','photoInk','paletteId'])next[key]=previous[key];}else{delete next.paletteId;delete next.photoInk;}
 return next;
}
function selectMode(value,options={}){
 const next=selectionDraft(value,options);if(!next)return;
 state=next;mode=String(state.layout);
 if(!userUploaded&&['master','folder','recommendation'].includes(catalog[state.layout].source))image=sampleImages.get(catalog[state.layout].id)||sampleImages.get(masterPresets[0].id)||image;
 sync();edited();updatePaletteName();
}
function randomPalette(){
 const group=$('palette-group').value||'全部';
 const pool=paletteLibrary.filter(p=>(group==='全部'||p.group===group)&&p.id!==state.paletteId);
 return pool[Math.floor(Math.random()*pool.length)]||paletteLibrary[0];
}
function randomStyle(all=false){
 if(!studioReady||!image)return;
 const pool=all?catalog:filtered(),index=sampleIndices(pool.map(p=>p.index),state.layout)[0];
 if(index===undefined)return toast('没有匹配的样式，请调整筛选');
 rememberBeforeRandom();selectMode(index,{preserveCopy:true,preservePalette:!$('random-with-color').checked});
 if($('random-with-color').checked)choosePalette(randomPalette());
 if(all){$('style-group').value='全部样式';$('style-source').value='全部';$('style-search').value='';}
 showStyles();remember();toast(`随机样式 · ${catalog[index].name} · 文字与背景已保留`);
}
$('random-style').addEventListener('click',()=>randomStyle());
$('random-all').addEventListener('click',()=>randomStyle(true));
$('recolor-current').addEventListener('click',()=>{if(!studioReady||!image)return;rememberBeforeRandom();choosePalette(randomPalette());remember('配色');toast('已换配色 · 排版、文字与背景保留');});
let candidateVersion=0;
async function generateCandidates(){
 if(!studioReady||!image)return;
 const indices=sampleIndices(filtered().map(p=>p.index),state.layout,6);
 if(!indices.length)return toast('没有匹配的样式，请调整筛选');
 const version=++candidateVersion,root=$('candidate-grid');root.replaceChildren();
 $('candidate-caption').textContent=`${$('style-group').value} · ${indices.length} 张候选 · 使用当前文字与图片，点击套用`;
 if(!$('candidate-dialog').open)$('candidate-dialog').showModal();
 // Keep source photos and background stable for the whole round.
 const round={image,imageName,backgroundImage,backgroundName,userUploaded,copyEdited:true};
 const drafts=indices.map(index=>{
  const s=selectionDraft(index,{preserveCopy:true,preservePalette:true});
  if($('random-with-color').checked){Object.assign(s,paletteState(randomPalette()));s.freeBodyInk=undefined;if(catalog[index].source==='generative')s.freeDesign='custom';}
  const img=!userUploaded&&['master','folder','recommendation'].includes(catalog[index].source)?sampleImages.get(catalog[index].id)||sampleImages.get(masterPresets[0].id)||image:image;
  return {state:s,...round,image:img};
 });
 await document.fonts.ready;
 for(const [i,draft] of drafts.entries()){
  if(version!==candidateVersion||!$('candidate-dialog').open)return;
  const b=document.createElement('button'),canvas=document.createElement('canvas'),name=document.createElement('span'),color=document.createElement('small');
  b.className='candidate-card';b.setAttribute('aria-label',`套用候选 ${i+1}`);
  renderCover(canvas,draft.state,draft.image,480,draft.backgroundImage,draft.userUploaded?[]:samplePhotoImages.get(catalog[draft.state.layout].id)||[]);
  name.textContent=`0${i+1} · ${catalog[draft.state.layout].name}`;color.textContent=paletteLibrary.find(p=>p.id===draft.state.paletteId)?.name||'当前配色';
  b.append(canvas,name,color);b.addEventListener('click',()=>{
   rememberBeforeRandom();state=structuredClone(draft.state);image=draft.image;imageName=draft.imageName;backgroundImage=draft.backgroundImage;backgroundName=draft.backgroundName;userUploaded=draft.userUploaded;copyEdited=true;mode=String(state.layout);
   sync();edited();showStyles();remember('候选');$('candidate-dialog').close();toast('已套用候选封面并保存');
  });root.append(b);
  await new Promise(resolve=>requestAnimationFrame(resolve));
 }
}
$('generate-six').addEventListener('click',generateCandidates);
$('regenerate-six').addEventListener('click',generateCandidates);
$('close-candidates').addEventListener('click',()=>$('candidate-dialog').close());
$('candidate-dialog').addEventListener('close',()=>candidateVersion++);
function updatePaletteName(){$('palette-name').textContent=paletteLibrary.find(p=>p.id===state.paletteId)?.name||'参考原配色';}
function choosePalette(p){Object.assign(state,paletteState(p));if(catalog[state.layout].source==='generative')state.freeDesign='custom';state.freeBodyInk=undefined;sync();edited();updatePaletteName();}
function showPalettes(){const root=$('palettes');root.replaceChildren();const group=$('palette-group').value||'全部';paletteLibrary.forEach((p,i)=>{if(group!=='全部'&&p.group!==group)return;const [bg,fg,accent]=p.colors,b=document.createElement('button');b.dataset.palette=i;b.style.background=`conic-gradient(${bg} 0 50%,${fg} 50% 75%,${accent} 75% 100%)`;b.title=p.group+' · '+p.name;b.setAttribute('aria-label',b.title);b.classList.toggle('chosen',state.paletteId===p.id);b.addEventListener('click',()=>choosePalette(p));root.append(b);});}
for(const group of paletteGroups){const o=document.createElement('option');o.value=group;o.textContent=group;$('palette-group').append(o);}
$('palette-count').textContent=paletteLibrary.length+' 组';$('palette-group').addEventListener('change',showPalettes);
$('random-palette').addEventListener('click',()=>{const group=$('palette-group').value,pool=paletteLibrary.filter(p=>(group==='全部'||p.group===group)&&p.id!==state.paletteId);choosePalette(pool[Math.floor(Math.random()*pool.length)]||paletteLibrary[0]);toast('配色已更新 · 排版与文字已保留');});showPalettes();

$('reference-copy').addEventListener('click',()=>{const p=state.combination?observedPresets.find(p=>p.composition===`observed:${state.combination.text}`):catalog[state.layout];if(!p)return;selectMode(String(catalog.findIndex(x=>x.id===p.id)),{resetPalette:true});Object.assign(state,p.copy);copyEdited=false;sync();edited();toast(['master','folder','recommendation'].includes(p.source)?'已载入参考文字；背景仍可替换':'已载入该帧文案和配色');});
$('reference').addEventListener('click',()=>{const root=$('reference-frames');root.replaceChildren();const current=catalog[state.layout];if(['master','folder','recommendation','generative'].includes(current.source)&&!state.combination){const figure=document.createElement('figure'),img=document.createElement('img'),caption=document.createElement('figcaption');img.src=current.referenceImage;img.alt=current.name;caption.textContent='你提供的原图 / '+current.name;figure.append(caption,img);root.append(figure);render($('comparison-canvas'),state,image,450);$('reference-caption').textContent=current.source==='generative'?'左侧为主参考图，右侧为依照网格和文字层级规律生成的新构图。字体使用本机近似。':'逐项复刻文字位置、分区和比例；背景可替换。字体为本机近似，不复制截图查看按钮。';$('reference-dialog').showModal();return;}const keys=state.combination?[state.combination.image,state.combination.text,state.combination.partition,state.combination.shape]:[catalog[state.layout].composition.slice(9)];for(const key of [...new Set(keys)]){const p=observedPresets.find(p=>p.composition===`observed:${key}`);if(!p)continue;const figure=document.createElement('figure'),img=document.createElement('img'),caption=document.createElement('figcaption');img.src=p.referenceImage;img.alt=p.name;caption.textContent=`视频 ${p.time} 秒 / ${p.name}`;figure.append(caption,img);root.append(figure);}render($('comparison-canvas'),state,image,450);$('reference-caption').textContent='左侧为直接截取的视频画面；白色播放按钮、光标和选中框属于播放器／编辑器，未复制到封面。照片取决于你的上传，原字体仍待确认。';$('reference-dialog').showModal();});$('close-reference').addEventListener('click',()=>$('reference-dialog').close());
const templateDescriptions={tea:'上图下纸，巨型英文与两侧竖排。',forest:'满版照片，居中粗字与底部品牌。',fields:'上下分区，边角信息与倒置标题。'};
function templateCanvas(p,width=150){
 const canvas=document.createElement('canvas');
 if(!image)return canvas;
 render(canvas,{...state,...(p.copy||{}),ratio:p.ratio||'3:4',layout:p.index,combination:null,layers:allLayers,font:'auto',fontSize:110,...(p.colors?{bg:p.colors[0],fg:p.colors[1],accent:p.colors[2]}:{})},sampleImages.get(p.id)||image,width);
 return canvas;
}
function showStyles(){
 const entries=filtered(),root=$('layout-list');root.replaceChildren();
 for(const p of entries){
  const b=document.createElement('button');b.dataset.mode=p.index;b.className='template-card';b.setAttribute('aria-label',p.name);b.title=p.name+' · '+(p.note||'点击查看大图');
  const copy=document.createElement('span'),name=document.createElement('strong'),note=document.createElement('small');copy.className='template-copy';name.textContent=p.name;note.textContent=p.source==='generative'?'段落、字号与位置自动生成':['folder','recommendation'].includes(p.source)?p.note:p.source==='master'?templateDescriptions[p.composition.slice(7)]:p.source==='observed'?`视频 ${p.time} 秒`:'基础排版';copy.append(name,note);b.append(templateCanvas(p),copy);root.append(b);
 }
 $('style-count').textContent=`${entries.length} 个样式`+($('style-source').value&&$('style-source').value!=='全部'?' · '+$('style-source').value:'');$('random-style').title=`从当前筛选的 ${entries.length} 个模板中随机，保留文字和背景`;$('random-scope').textContent=`${$('style-group').value} · ${entries.length} 款可选`;$('random-style').disabled=!studioReady||!entries.length;$('generate-six').disabled=!studioReady||!entries.length;$('random-all').disabled=!studioReady;$('recolor-current').disabled=!studioReady; updateActiveStyle();
 if(!entries.length){const empty=document.createElement('p');empty.className='style-note';empty.textContent='没有匹配的样式';root.append(empty);}
}
for(const family of styleFamilies){const o=document.createElement('option');o.value=family;o.textContent=family+' · '+familyCount(family);$('style-group').append(o);}
for(const group of ['全部',...groups.filter(g=>g!=='全部')]){const o=document.createElement('option');o.value=group;o.textContent=group;$('style-source').append(o);}
$('style-source').addEventListener('change',showStyles);
$('style-group').addEventListener('change',showStyles);$('style-search').addEventListener('input',showStyles);
$('layout-list').addEventListener('click',e=>{const b=e.target.closest('[data-mode]');if(b){selectMode(b.dataset.mode);if(window.matchMedia('(max-width:850px)').matches)$('preview').scrollIntoView({behavior:'smooth',block:'center'});}});showStyles();
let galleryVersion=0;
$('overview').addEventListener('click',async()=>{if(!image)return;const version=++galleryVersion,root=$('gallery-grid');root.replaceChildren();$('style-gallery').showModal();await document.fonts.ready;for(const entry of filtered()){if(version!==galleryVersion||!$('style-gallery').open)break;const b=document.createElement('button');b.className='gallery-card';const canvas=document.createElement('canvas');render(canvas,{...state,...(entry.copy||{}),ratio:entry.ratio||state.ratio,layout:entry.index,combination:null,layers:allLayers,font:'auto',...(entry.colors?{bg:entry.colors[0],fg:entry.colors[1],accent:entry.colors[2]}:{})},['master','folder','recommendation'].includes(entry.source)&&!userUploaded?sampleImages.get(entry.id)||image:image,240);const name=document.createElement('span');name.textContent=entry.name;const note=document.createElement('small');note.textContent=['master','folder','recommendation'].includes(entry.source)?'你的参考 · 文字和背景可替换':entry.source==='observed'?`视频 ${entry.time} 秒 · 字体待确认`:'基础版式';b.append(canvas,name,note);b.addEventListener('click',()=>{selectMode(String(entry.index));$('style-gallery').close();});root.append(b);if(root.children.length%8===0)await new Promise(resolve=>requestAnimationFrame(resolve));}});
$('close-gallery').addEventListener('click',()=>$('style-gallery').close());
document.querySelectorAll('[data-ratio]').forEach(b=>b.addEventListener('click',()=>{state.ratio=b.dataset.ratio==='original'?catalog[state.layout].ratio:b.dataset.ratio;edited();}));
for(const key of [...masterFields,'bg','fg','accent'])$(key).addEventListener('input',()=>{state[key]=$(key).value;if(masterFields.includes(key))copyEdited=true;else{delete state.paletteId;state.photoInk=state.accent;updatePaletteName();}edited();});
for(const [id,key,factor,out] of [['font-size','fontSize',1,'font-value'],['zoom','zoom',.01,'zoom-value'],['pan','pan',1,'pan-value'],['background-opacity','backgroundOpacity',1,'background-opacity-value']])$(id).addEventListener('input',()=>{state[key]=Number($(id).value)*factor;$(out).value=$(id).value+(id==='font-size'?'':'%');edited();});
async function loadImage(src){const img=new Image(),blob=src instanceof Blob,url=blob?URL.createObjectURL(src):src;try{img.src=url;await img.decode();if(blob)img.historySource=src;return img;}finally{if(blob)URL.revokeObjectURL(url);}}
$('background-upload').addEventListener('change',async()=>{const file=$('background-upload').files[0];$('background-upload').value='';if(!file)return;if(!file.type.startsWith('image/'))return toast('请选择图片文件');const version=++backgroundUploadVersion,url=URL.createObjectURL(file);try{let img=await loadImage(url);img.historySource=file;if(version!==backgroundUploadVersion)return;backgroundImage=img;backgroundName=file.name;state.backgroundOpacity=state.backgroundOpacity??100;sync();edited();toast('自定义背景已添加');}catch{toast('背景图片无法读取，请换一张 JPG 或 PNG');}finally{URL.revokeObjectURL(url);}});
$('remove-background').addEventListener('click',()=>{backgroundUploadVersion++;backgroundImage=null;backgroundName='';sync();edited();toast('背景图已移除');});
$('upload').addEventListener('change',async()=>{const file=$('upload').files[0];$('upload').value='';if(!file)return;if(!file.type.startsWith('image/'))return toast('请选择 JPG、PNG、WebP 等图片文件');const version=++uploadVersion;const url=URL.createObjectURL(file);try{let img=await loadImage(url);img.historySource=file;if(version!==uploadVersion)return;image=img;imageName=file.name;userUploaded=true;state.zoom=1;state.pan=50;sync();edited();toast('背景已更新，排版已保留');}catch{toast('这张图片无法读取，请换一张 JPG 或 PNG');}finally{URL.revokeObjectURL(url);}});
$('export-quality').addEventListener('change',()=>{state.exportQuality=$('export-quality').value;edited();});
$('export').addEventListener('click',async()=>{if(!image)return;const button=$('export');button.disabled=true;try{await document.fonts.ready;const output=document.createElement('canvas');const size=currentExportSize();render(output,state,image,size.width);const blob=await new Promise(resolve=>output.toBlob(resolve,'image/png'));if(!blob)throw Error('export');const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`Cover-${output.width}x${output.height}-${String(state.serial).padStart(3,'0')}.png`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);toast(`无损 PNG 已导出 · ${output.width} × ${output.height} px${size.limited?' · 已达浏览器尺寸上限':''}`);output.width=1;output.height=1;}catch{toast('当前浏览器无法完成此尺寸导出，请关闭其他页面后重试');}finally{button.disabled=false;}});
try{await Promise.all([...masterPresets.map(async p=>{try{sampleImages.set(p.id,await loadImage(p.backgroundImage));}catch{}}),...uploadedPresets.map(async p=>{try{samplePhotoImages.set(p.id,await Promise.all(p.photoAssets.map(loadImage)));}catch{}})]);image=sampleImages.get(masterPresets[0].id)||await loadImage('/public/example.svg');$('style-group').value='全部样式';$('style-source').value='新参考 · 40款';selectMode(catalog.findIndex(p=>p.id==='aranya-1'));showStyles();}catch{toast('示例图加载失败，请上传自己的照片');}

try{const saved=await unpackHistory(await readHistory(),loadImage);if(!history.length){history=saved.entries.filter(e=>catalog[e.state.layout]);if(history.length){active=saved.active;restoreHistory(active<0?0:active,false);}else showHistory();}}catch{showHistory();}
studioReady=true;showStyles();

function enlargeCover(){if(!image)return;render($('large-cover'),state,image,1440);$('large-cover-title').textContent=catalog[state.layout].name;$('cover-dialog').showModal();}
$('enlarge-preview').addEventListener('click',enlargeCover);$('preview').addEventListener('click',enlargeCover);$('preview').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();enlargeCover();}});$('close-cover').addEventListener('click',()=>$('cover-dialog').close());

$('enter-generative').addEventListener('click',()=>{selectMode(catalog.findIndex(p=>p.source==='generative'));$('style-group').value='自由构图';$('style-source').value='全部';$('style-search').value='';showStyles();});
$('regenerate').addEventListener('click',()=>{rememberBeforeRandom();state.freeSeed=Math.floor(Math.random()*2147483647);if(state.freeShuffleDesign){state=applyGenerativeStyle(state,generativeStyles[Math.floor(Math.random()*generativeStyles.length)]);sync();}state.serial++;edited();remember();toast('已重新构图 · 文案与配色保留');});
$('free-paragraphs').addEventListener('input',()=>{state.freeParagraphs=$('free-paragraphs').value;edited();});
$('free-freedom').addEventListener('input',()=>{state.freeFreedom=Number($('free-freedom').value);$('free-freedom-value').value=state.freeFreedom;edited();});
for(const [id,key] of [['free-rules','freeRules'],['free-photo','freePhoto']])$(id).addEventListener('change',()=>{state[key]=$(id).checked;edited();});

for(const [value,label] of [['auto','随机 · 全部路线'],...structureNames.map((label,i)=>[String(i),label])]){const o=document.createElement('option');o.value=value;o.textContent=label;$('free-route').append(o);}
$('free-route').addEventListener('change',()=>{state.freeRoute=$('free-route').value;edited();});$('free-overlay').addEventListener('change',()=>{state.freeOverlay=$('free-overlay').checked;edited();});

for(const p of [{id:'custom',name:'保留当前字体与配色'},...generativeStyles]){const o=document.createElement('option');o.value=p.id;o.textContent=p.name;$('free-design').append(o);}
$('free-design').addEventListener('change',()=>{const p=generativeStyles.find(p=>p.id===$('free-design').value);if(p)state=applyGenerativeStyle(state,p);else{state.freeDesign='custom';state.freeBodyInk=undefined;}sync();edited();});$('free-shuffle-design').addEventListener('change',()=>{state.freeShuffleDesign=$('free-shuffle-design').checked;});

$('regenerate-main').addEventListener('click',()=>$('regenerate').click());
