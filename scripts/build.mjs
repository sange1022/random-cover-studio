import {cp,mkdir,readFile,readdir,writeFile,rm} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
await cp('src','dist/src',{recursive:true});
await cp('public','dist/public',{recursive:true});
await writeFile('dist/index.html',(await readFile('index.html','utf8')).replaceAll('"/src/','"./src/'));
for(const file of await readdir('dist/src')){
 if(!file.endsWith('.js'))continue;
 const path=`dist/src/${file}`;
 await writeFile(path,(await readFile(path,'utf8')).replaceAll('/public','./public'));
}
await writeFile('dist/.nojekyll','');
console.log('Static site built in dist/');
