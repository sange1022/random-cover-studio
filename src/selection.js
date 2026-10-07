// Selection helpers operate on explicit pools so filters remain meaningful.
export function randomIndex(current,count,random=Math.random){
 if(count<=1)return 0;if(current<0||current>=count)return Math.min(count-1,Math.floor(Math.max(0,random())*count));const n=Math.min(count-2,Math.floor(Math.max(0,random())*(count-1)));return n>=current?n+1:n;
}
export function preserveCopy(previous,next,fields){return {...next,...Object.fromEntries(fields.map(key=>[key,previous[key]??'']))};}

export function sampleIndices(pool,current,count=1,random=Math.random){
 const unique=[...new Set(pool)];
 const candidates=unique.length>1?unique.filter(index=>index!==current):unique;
 const result=[];
 while(candidates.length&&result.length<count){
  const i=Math.min(candidates.length-1,Math.floor(Math.max(0,random())*candidates.length));
  result.push(candidates.splice(i,1)[0]);
 }
 // Include the current layout only when it is needed to fill a comparison set.
 if(result.length<count&&unique.includes(current)&&!result.includes(current))result.push(current);
 return result;
}
