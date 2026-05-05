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
walkDir('/app/applet/repo/extracted/src', p => {
  const currPath = p.replace('/app/applet/repo/extracted/src', '/app/applet/src');
  if (!fs.existsSync(currPath)) {
    console.log("ONLY IN GITHUB: ", p);
  }
});
