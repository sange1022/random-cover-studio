import test from 'node:test';
import assert from 'node:assert/strict';
import {catalog} from '../src/catalog.js';
import {styleFamilies,styleFamily,filterStyles,familyCount} from '../src/style-families.js';
test('composition categories partition every template without deleting or duplicating presets',()=>{
 const categorized=styleFamilies.slice(1).flatMap(f=>filterStyles(f));
 assert.equal(categorized.length,catalog.length);assert.equal(new Set(categorized.map(p=>p.id)).size,catalog.length);
 assert.deepEqual(new Set(categorized.map(p=>p.id)),new Set(catalog.map(p=>p.id)));
 for(const family of styleFamilies.slice(1)){assert.ok(familyCount(family)>0);assert.ok(filterStyles(family).every(p=>styleFamily(p)===family));}
});
test('source and text filters work together with composition selection',()=>{
 const results=filterStyles('大字','空相','推荐海报');assert.equal(results.length,1);assert.equal(results[0].id,'recommendation-02');
 assert.equal(filterStyles('留白','','推荐海报').length,3);assert.equal(filterStyles('全部样式','NO MATCH','全部').length,0);
});
