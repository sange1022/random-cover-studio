import {dimensions} from './layout.js';
// PNG retains pixels without lossy JPEG recompression. Bound the canvas rather
// than modifying source photos; very large sources remain intact in memory.
export const exportLimits={minimumLongEdge:7680,maximumSide:16384,maximumPixels:64_000_000};
export function exportDimensions(ratio,sources=[],limits=exportLimits,quality='highest'){
 const shape=dimensions(ratio,9000),aspect=shape.height/shape.width;
 const sourceEdge=Math.max(0,...sources.filter(Boolean).flatMap(img=>[img.naturalWidth||img.width||0,img.naturalHeight||img.height||0]));
 const desiredLongEdge=quality==='2k'?2048:quality==='4k'?4096:quality==='original'?(sourceEdge||limits.minimumLongEdge):Math.max(limits.minimumLongEdge,sourceEdge);
 let width=Math.floor(desiredLongEdge/Math.max(1,aspect));
 width=Math.min(width,Math.floor(limits.maximumSide/Math.max(1,aspect)),Math.floor(Math.sqrt(limits.maximumPixels/aspect)));
 let result=dimensions(ratio,width);
 // Rounding at the canvas boundary must still respect pixel/side budgets.
 while(result.width*result.height>limits.maximumPixels||Math.max(result.width,result.height)>limits.maximumSide)result=dimensions(ratio,--width);
 return {...result,limited:Math.max(result.width,result.height)<desiredLongEdge-2,sourceEdge,desiredLongEdge};
}
