import {aranyaPresets} from './aranya-presets.js';
import {uploadedPresets} from './uploaded-presets.js';
import {recommendationPresets} from './recommendation-presets.js';
import {generativePreset} from './generative.js';
import {folderPresets} from './folder-presets.js';
import {masterPresets} from './master-presets.js';
import {observedPresets} from './reference-presets.js';
const baseNames=['巨型衬线字','留白编辑','上图下文','分栏海报','字母图窗','框景版式','底部大字','叠纸拼贴','竖向构图'];
export const catalog=[...baseNames.map((name,i)=>({name,id:`base-${i}`,group:'基础版式',source:'base',composition:null,font:['editorial','editorial','bold','editorial','bold','editorial','light','bold','condensed'][i]})),...observedPresets,...masterPresets,...folderPresets,generativePreset,...recommendationPresets,...uploadedPresets,...aranyaPresets];
export const groups=['新参考 · 40款','本次上传','推荐海报','文件夹参考','全部','随机构图','你选的三种','视频画面','基础版式'];
export function filterCatalog(group='视频画面',query=''){return catalog.map((entry,index)=>({...entry,index})).filter(entry=>(group==='全部'||entry.group===group)&&entry.name.toLowerCase().includes(query.trim().toLowerCase()));}
