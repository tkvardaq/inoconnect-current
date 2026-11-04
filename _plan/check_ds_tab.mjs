import fs from 'fs';

const html = fs.readFileSync('services/digital-strategy/index.html', 'utf8');
const catMatch = html.match(/class="category-link active font-black"[\s\S]{0,100}/);
console.log(catMatch ? catMatch[0] : 'None');
