import {observedPresets} from './reference-presets.js';
// Video values come from the saved frames; the other families are curated extensions.
const families={
 '纸与墨':[['宣纸墨黑','#f3efe4','#23241f','#b5ab91'],['象牙朱砂','#eee7d8','#27241f','#bc4937'],['米纸靛蓝','#e9e3d3','#26354c','#506584'],['暖白松绿','#f2f0e7','#25392f','#7e937b'],['骨白葡萄','#eee9e2','#3d2b3c','#957c8b'],['沙纸焦糖','#e6d8bf','#382c22','#a06d43']],
 '森林与苔':[['松针雾白','#273d33','#edf0e5','#9aa98e'],['苔绿米白','#475b42','#f0eddb','#b9bf91'],['橄榄奶油','#4c5035','#f7edce','#b7a26c'],['深杉黄铜','#20352e','#e6dfc6','#b6a16a'],['鼠尾草炭灰','#b9c3ad','#25362d','#678368'],['浅苔深墨','#dae0cb','#2b392c','#7b8d66']],
 '大地与陶':[['陶土骨白','#a95038','#fff0df','#d3b996'],['赭石暖墨','#d6b591','#30261f','#905c3d'],['黄土深棕','#c4a16c','#32271c','#836845'],['赤陶夜色','#3e2925','#f2dfcc','#b57057'],['烟褐杏仁','#625147','#f6e7cf','#c29a73'],['浅沙石墨','#e1d0ba','#35302b','#a57d60']],
 '蓝与灰':[['雾蓝暖白','#526d80','#faf0dc','#b8c2bf'],['深海奶油','#213b53','#eee8d3','#8ba6aa'],['群青纸白','#234dc0','#f4ecd7','#afbed6'],['冰蓝石墨','#d6e1e5','#243742','#72939d'],['钢蓝淡金','#415366','#f1e4c6','#c1ad83'],['灰蓝樱粉','#596c79','#fff0e4','#d8b9b2']],
 '夜色与金属':[['碳黑黄铜','#202320','#f1e5cd','#b59a62'],['暖黑铜红','#26211f','#eee3d2','#b47556'],['午夜银灰','#242932','#ebedf0','#a5afbc'],['墨紫淡金','#322c38','#f5e7d1','#b7a284'],['深棕月白','#352f28','#f3ebd8','#a59573'],['夜绿青铜','#25312c','#ede7d5','#a3aa7b']],
 '柔和低彩':[['粉灰墨褐','#e0ceca','#3c2c2a','#9d7776'],['藕紫深墨','#d8cfdf','#342d42','#95819d'],['杏色墨蓝','#eed6c0','#343945','#a18e7a'],['淡黄松墨','#e9dfbb','#343a2b','#96946f'],['雾灰暗红','#dedbd6','#3f292d','#987274'],['陶粉绿墨','#e6d6cb','#2b3d35','#85978a']],
 '黑白层次':[['纯白煤黑','#fafafa','#1b1b1b','#9c9c94'],['暖灰黑墨','#d4d0c6','#272724','#8c877b'],['黑纸雾银','#17191a','#e9e9e2','#8d9392'],['冷白石板','#e8edef','#293136','#849297'],['燕麦咖黑','#dbd5c6','#2b2821','#928974'],['炭灰白陶','#393b3b','#f4efe5','#b6b7ac']],
 '克制撞色':[['朱红墨黑','#dc5d48','#1b1715','#f1dcbf'],['酸绿夜墨','#c1d879','#29311c','#70894e'],['芥黄炭黑','#dbc46a','#282820','#887f4d'],['靛蓝橙纸','#243857','#f5dfc1','#c78c57'],['暗莓粉纸','#683b49','#f8e3d5','#c79c9e'],['青玉暖红','#a5beb0','#243730','#a66d60']]
};
const luminance=hex=>hex.slice(1).match(/../g).map(h=>parseInt(h,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
export function contrast(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
export const paletteLibrary=[...observedPresets.map((p,i)=>({id:`video-${i}`,name:`${p.time}s · ${['暖陶黑墨','米纸灰紫','墨绿黄铜','雾白墨绿','森林雾白','炭灰象牙','夜黑淡金','墨黑苔绿','灰蓝米金','深墨青绿'][i]}`,group:'视频取色',colors:p.colors,photoInk:'#f2eedf',origin:'saved-video-frame'})),...Object.entries(families).flatMap(([group,rows])=>rows.map(([name,...colors],i)=>({id:`${group}-${i}`,name,group,colors,photoInk:'#f5f0df',origin:'curated'})))];
export const paletteGroups=['全部',...new Set(paletteLibrary.map(p=>p.group))];
export function paletteState(p){return {bg:p.colors[0],fg:p.colors[1],accent:p.colors[2],photoInk:p.photoInk,paletteId:p.id};}
