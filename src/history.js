export const historyLimit=60;
export function packHistory(entries,active){
 const assets=[],ids=new Map();
 const asset=img=>{if(!img?.src)return null;const src=img.src;if(!ids.has(src)){ids.set(src,assets.length);assets.push(img.historySource||src);}return ids.get(src);};
 return {version:1,active,assets,entries:entries.slice(0,historyLimit).map(({image,backgroundImage,...entry})=>({...entry,imageRef:asset(image),backgroundRef:asset(backgroundImage)}))};
}
export async function unpackHistory(data,loadImage){
 if(data?.version!==1||!Array.isArray(data.entries)||!Array.isArray(data.assets))return {entries:[],active:-1};
 const images=await Promise.all(data.assets.map(src=>loadImage(src).catch(()=>null)));
 const entries=data.entries.slice(0,historyLimit).map(({imageRef,backgroundRef,...entry})=>({...entry,image:images[imageRef],backgroundImage:backgroundRef===null?null:images[backgroundRef]})).filter(e=>e.image&&e.state&&Number.isInteger(e.state.layout));
 return {entries,active:entries.length?Math.max(-1,Math.min(data.active??0,entries.length-1)):-1};
}
let database;
function openDatabase(){return database??=new Promise((resolve,reject)=>{const request=indexedDB.open('cover-studio-history',1);request.onupgradeneeded=()=>request.result.createObjectStore('history');request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});}
export async function readHistory(){const db=await openDatabase();return new Promise((resolve,reject)=>{const request=db.transaction('history').objectStore('history').get('current');request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});}
export async function writeHistory(data){const db=await openDatabase();return new Promise((resolve,reject)=>{const transaction=db.transaction('history','readwrite');transaction.objectStore('history').put(data,'current');transaction.oncomplete=()=>resolve();transaction.onerror=()=>reject(transaction.error);transaction.onabort=()=>reject(transaction.error);});}
