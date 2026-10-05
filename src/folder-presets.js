import {folderA} from './folder-a.js';
import {folderB} from './folder-b.js';
export const folderPresets=[...folderA,...folderB].map(p=>({...p,source:'folder',group:'文件夹参考',font:'auto',composition:p.id,referenceImage:p.referenceImage.startsWith('/public/')?p.referenceImage:'/public'+p.referenceImage,credit:'用户压缩包参考 · 作者未核实'}));
