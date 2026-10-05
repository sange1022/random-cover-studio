// Coordinates are measured from captured video covers, not inferred from menu labels.
const examples=[
 ['right-photo',35,'横向刊头 · 右图左文',['#ae8c76','#090a09','#756452'],['图片找到位置','形式与内容','TYPE FINDS SPACE'],'light',true],
 ['paper-strip',65,'左侧色纸 · 下方撕边',['#ecdcb2','#393733','#bfb2b6'],['图形开口\n文字聆听','你的专属灵感引擎','FROM GRID TO PAGE'],'bold',true],
 ['third-photo',185,'右侧三分之一满高照片',['#30382c','#b59a62','#5d634d'],['Contrast\nDecides','Image imported\nthe page holds it first\nmargin makes room\ntype arrives after\nnothing competes','LAYOUT IS A METHOD\nNOT A RESULT'],'script',true],
 ['pale-rays',155,'浅色满版图 · 放射细线',['#eff0e4','#11110d','#6d7161'],['ACCIDENTAL\nSTRUCTURE','Type waits in the margin\nimage holds its place\nthe grid keeps breathing\nthe page moves on','LAYOUT · STRUCTURE · VOID'],'editorial',true],
 ['photo-word',125,'柔焦满版图 · 巨型镂空手写',['#4d6352','#f2f1da','#a5b49b'],['Pages\nRearrange','Order\nMeets\nAccident','Hope'],'script',true],
 ['specimen',46,'横向字形实验 · 底部照片',['#302f2b','#f4eedb','#666150'],['让图形成为路标','边距打开\n文字后来','Layout\nSpeaks'],'bold',true],
 ['spiral',19.79,'黑底螺旋 · 右上文字列',['#121417','#c7bfa7','#414744'],['标题先行\n阅读有先后','页面在前\n结构在前\n呼吸在前','测量 · 比例 · 秩序'],'condensed',false],
 ['clash',95,'巨型宋字 · 上下撞色',['#080e10','#527c49','#222927'],['章法','空白也是声音\n页面还没说完\n文字后来','CLASHING\nCOLORS,\nDELIBERATELY'],'editorial',false],
 ['blue-rail',5,'蓝底右侧栏 · 横向压缩字',['#2d5889','#c4baa6','#8396a0'],['图片落在\n格上','数字决定比例\n页面回答\n换一种节奏','空'],'editorial',false],
 ['green-footer',0.3,'深底细宋 · 绿色底栏',['#121417','#40866d','#293a35'],['留白是给眼睛\n休息的地方','结构与表面','LOTGO'],'editorial',false]
];
export const observedPresets=examples.map(([composition,time,name,colors,copy,font,usesImage])=>({id:`video-${composition}`,source:'observed',group:'视频画面',name,composition:`observed:${composition}`,time,colors,copy:{title:copy[0],subtitle:copy[1],kicker:copy[2]},font,usesImage,referenceImage:`/public/reference-${composition==='spiral'?'spiral':String(Math.round(time)).padStart(3,'0')}.png`,fidelity:'geometry-observed',fontNote:'字形比例按画面匹配，原字体文件未确认'}));
