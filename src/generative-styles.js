// Visual approximations of combinations observed in the authorized Safari recommendations.
// Original font files are unknown; use available local families with Chinese fallbacks.
export const generativeStyles=[
 {id:'black-paper',name:'纸白粗黑 · 信息海报',colors:['#f7f6f0','#171917','#9b9f94'],heading:'bold',body:'sans'},
 {id:'red-overprint',name:'纸白红黑 · 双色叠印',colors:['#f7f5ef','#171818','#ad3d40'],heading:'sans',body:'sans'},
 {id:'mint-violet',name:'薄荷紫黑 · 展览信息',colors:['#f4f4ec','#57458c','#68b69d'],heading:'bold',body:'sans'},
 {id:'blue-rose',name:'蓝字玫红 · 图形海报',colors:['#f6f4ee','#367faa','#b83b83'],heading:'bold',body:'sans',bodyColor:'#1e2424'},
 {id:'lime-violet',name:'青柠紫 · 艺术空间',colors:['#b8ea72','#553e89','#6a508a'],heading:'light',body:'sans'},
 {id:'night-paper',name:'墨黑纸白 · 中英混排',colors:['#171919','#f4f1e6','#bdc2b3'],heading:'bold',body:'sans'},
 {id:'blue-serifs',name:'湖蓝米白 · 宋体诗性',colors:['#357fb1','#fff2d8','#d9e5cf'],heading:'serif',body:'serif'},
 {id:'cream-editorial',name:'米纸墨黑 · 宋骨窄字',colors:['#eee7d7','#23211c','#8f6a50'],heading:'serif',body:'sans'},
 {id:'gray-light',name:'灰纸细黑 · 大幅留白',colors:['#ece9e6','#292b2b','#9c8277'],heading:'light',body:'sans'},
 {id:'condensed',name:'纸白窄黑 · 巨型标题',colors:['#f6f4ed','#1d211d','#9d8968'],heading:'condensed',body:'sans'}
];
export function applyGenerativeStyle(s,p){return {...s,bg:p.colors[0],fg:p.colors[1],accent:p.colors[2],freeDesign:p.id,freeBodyInk:p.bodyColor,freeTypography:{heading:p.heading,body:p.body},font:'auto',paletteId:undefined};}
