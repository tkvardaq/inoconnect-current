const d = '2026-01-05';
const brokenRe = new RegExp('"datePublished"\s*:\s*"' + d);
const properRe = new RegExp('"datePublished"\\s*:\\s*"' + d);

const testStringWithSpaces = '"datePublished": "2026-01-05"';
const testStringNoSpaces = '"datePublished":"2026-01-05"';

console.log('brokenRe with spaces:', brokenRe.test(testStringWithSpaces)); // false
console.log('brokenRe no spaces:', brokenRe.test(testStringNoSpaces));     // true
console.log('properRe no spaces:', properRe.test(testStringNoSpaces));     // true
