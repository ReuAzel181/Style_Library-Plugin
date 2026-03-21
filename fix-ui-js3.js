const fs = require('fs');
// Start from fresh extracted JS
const html = fs.readFileSync('ui.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
let js = scriptMatch[1];

// Find exact start and end of GOOGLE_FONTS
const startStr = 'const GOOGLE_FONTS = [';
const endStr = '].sort((a, b) => a.family.localeCompare(b.family));';

const startIndex = js.indexOf(startStr);
const endIndex = js.indexOf(endStr, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  const fullEndIndex = endIndex + endStr.length;
  js = 'import { GOOGLE_FONTS } from "./google-fonts.js";\n' + js.slice(0, startIndex) + js.slice(fullEndIndex);
  fs.writeFileSync('src/ui.js', js);
  console.log('Replaced GOOGLE_FONTS perfectly.');
} else {
  console.log('Could not find GOOGLE_FONTS start or end');
}
