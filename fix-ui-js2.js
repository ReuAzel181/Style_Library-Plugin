const fs = require('fs');
let js = fs.readFileSync('src/ui.js', 'utf8');
let fontJs = fs.readFileSync('google-fonts.js', 'utf8');

// fontJs contains: `// Font Picker Logic\n    const GOOGLE_FONTS = [\n...];`
// we can find `const GOOGLE_FONTS = [` and find the matching `];` by parsing or just string matching.

const startStr = 'const GOOGLE_FONTS = [';
const startIndex = js.indexOf(startStr);

if (startIndex !== -1) {
  // Let's find the closing brace by counting brackets, or just find the line `    ];`
  let endIndex = js.indexOf('    ];\n', startIndex);
  if (endIndex === -1) {
    endIndex = js.indexOf('    ];\r\n', startIndex);
  }
  
  if (endIndex !== -1) {
    endIndex += 6; // length of `    ];`
    js = 'import { GOOGLE_FONTS } from "./google-fonts.js";\n' + js.slice(0, startIndex) + js.slice(endIndex);
    fs.writeFileSync('src/ui.js', js);
    console.log('Replaced GOOGLE_FONTS successfully.');
  } else {
    console.log('Could not find end of GOOGLE_FONTS');
  }
} else {
  console.log('Could not find GOOGLE_FONTS');
}
