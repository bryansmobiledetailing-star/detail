const fs = require('fs');
const path = require('path');
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if(fs.statSync(dirPath).isDirectory()) {
       walkDir(dirPath, callback);
    } else {
       callback(dirPath);
    }
  });
}
walkDir('/app/applet/repo', p => {
  if (p.endsWith('.jpg') || p.endsWith('.png') || p.endsWith('.svg') || p.endsWith('.webp')) console.log(p);
});
