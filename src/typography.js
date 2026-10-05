export const typography={
 rounded:{family:'"Arial Rounded MT Bold", "Yuanti SC", "PingFang SC", sans-serif',weight:'500'},
 editorial:{family:'"Bodoni Moda", "Didot", "Songti SC", serif',weight:'400'},
 light:{family:'"Helvetica Neue", "PingFang SC", sans-serif',weight:'200'},
 bold:{family:'"Helvetica Neue", "PingFang SC", sans-serif',weight:'800'},
 condensed:{family:'"Arial Narrow", "PingFang SC", sans-serif',weight:'700'},
 script:{family:'"Snell Roundhand", "Kaiti SC", "Songti SC", cursive',weight:'400'},
 mono:{family:'"Menlo", "PingFang SC", monospace',weight:'400'}
};
const defaults=['editorial','editorial','bold','editorial','bold','editorial','light','bold','condensed'];
export function resolveTypography(key='auto',layout=0){return typography[key]||typography[defaults[layout]||'editorial'];}
function luminance(hex){const rgb=hex.replace('#','').match(/.{2}/g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;}
export function paperInk(bg,preferred,alternate){const lum=luminance(bg),contrast=color=>{const other=luminance(color);return (Math.max(lum,other)+.05)/(Math.min(lum,other)+.05);};if(contrast(preferred)>=3)return preferred;return [alternate,'#222530','#eee2c4'].sort((a,b)=>contrast(b)-contrast(a))[0];}
