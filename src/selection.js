// Random selection operates over the complete catalog, regardless of the sidebar filter.
export function randomIndex(current,count,random=Math.random){
 if(count<=1)return 0;if(current<0||current>=count)return Math.min(count-1,Math.floor(Math.max(0,random())*count));const n=Math.min(count-2,Math.floor(Math.max(0,random())*(count-1)));return n>=current?n+1:n;
}
export function preserveCopy(previous,next,fields){return {...next,...Object.fromEntries(fields.map(key=>[key,previous[key]??'']))};}
