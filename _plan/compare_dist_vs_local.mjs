import fs from 'fs';

const local = fs.readFileSync('blog/schema-markup-guide/index.html', 'utf8');
const dist = fs.readFileSync('D:/AI/inoconnect-site/dist/blog/schema-markup-guide/index.html', 'utf8');

console.log('Local length:', local.length);
console.log('Dist length:', dist.length);

console.log('\n--- Local Head Links ---');
const localLinks = local.match(/<link[^>]+>/g) || [];
localLinks.forEach(l => console.log(' ', l));

console.log('\n--- Dist Head Links ---');
const distLinks = dist.match(/<link[^>]+>/g) || [];
distLinks.forEach(l => console.log(' ', l));

console.log('\n--- Local Header Nav ---');
const localNav = local.match(/<nav[^>]*>[\s\S]*?<\/nav>/);
console.log(localNav ? localNav[0].slice(0, 300) : 'none');

console.log('\n--- Dist Header Nav ---');
const distNav = dist.match(/<nav[^>]*>[\s\S]*?<\/nav>/);
console.log(distNav ? distNav[0].slice(0, 300) : 'none');

console.log('\n--- Local Scripts ---');
const localScripts = local.match(/<script[^>]*>[\s\S]*?<\/script>/g) || [];
console.log('Local script count:', localScripts.length);
localScripts.slice(0, 3).forEach(s => console.log(' ', s.slice(0, 100)));

console.log('\n--- Dist Scripts ---');
const distScripts = dist.match(/<script[^>]*>[\s\S]*?<\/script>/g) || [];
console.log('Dist script count:', distScripts.length);
distScripts.slice(0, 3).forEach(s => console.log(' ', s.slice(0, 100)));
