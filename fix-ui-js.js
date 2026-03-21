const fs = require('fs');
let js = fs.readFileSync('src/ui.js', 'utf8');

const startIndex = js.indexOf('const GOOGLE_FONTS = [');
if (startIndex !== -1) {
  // Find the closing bracket of this array
  let endIndex = js.indexOf('];', startIndex);
  if (endIndex !== -1) {
    js = 'import { GOOGLE_FONTS } from "./google-fonts.js";\n' + js.slice(0, startIndex) + js.slice(endIndex + 2);
    fs.writeFileSync('src/ui.js', js);
    console.log('Replaced GOOGLE_FONTS successfully.');
  } else {
    console.log('Could not find end of GOOGLE_FONTS');
  }
} else {
  console.log('Could not find GOOGLE_FONTS');
}
