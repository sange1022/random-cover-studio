import {catalog,filterCatalog} from './catalog.js';
export const styleFamilies=['全部样式','留白','大字','图文','网格','自由构图'];
const assignments={
 '留白':['base-1','video-pale-rays','folder-02','folder-07','folder-08','recommendation-09','recommendation-15','recommendation-24'],
 '大字':['base-0','base-6','video-photo-word','video-specimen','video-clash','video-blue-rail','folder-04','folder-14','folder-15','folder-23','recommendation-01','recommendation-02','recommendation-07','recommendation-08','recommendation-14','recommendation-16','recommendation-17','recommendation-18','recommendation-25','recommendation-27'],
 '图文':['base-2','base-4','base-5','video-right-photo','video-third-photo','tea-reference','forest-reference','fields-reference','folder-01','folder-03','folder-09','folder-11','folder-17','folder-19','recommendation-03','recommendation-04','recommendation-23','recommendation-29'],
 '网格':['base-3','video-green-footer','folder-05','folder-06','folder-10','folder-12','folder-13','folder-16','folder-21','folder-22','recommendation-05','recommendation-06','recommendation-10','recommendation-12','recommendation-13','recommendation-19','recommendation-20','recommendation-21','recommendation-22','recommendation-28'],
 '自由构图':['base-7','base-8','video-paper-strip','video-spiral','folder-18','folder-20','folder-24','generative-grid','recommendation-11','recommendation-26','recommendation-30']
};
const families=new Map(Object.entries(assignments).flatMap(([family,ids])=>ids.map(id=>[id,family])));
export const styleFamily=entry=>entry.family||families.get(entry.id)||'自由构图';
export function filterStyles(family='全部样式',query='',source='全部'){return filterCatalog(source,query).filter(p=>family==='全部样式'||styleFamily(p)===family);}
export function familyCount(family){return catalog.filter(p=>family==='全部样式'||styleFamily(p)===family).length;}
