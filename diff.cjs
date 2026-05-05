const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const orig = '/app/applet/repo/extracted/src';
const curr = '/app/applet/src';

let origFiles = [];
walkDir(orig, (p) => origFiles.push(p.replace(orig, '')));

for (const f of origFiles) {
  const origPath = orig + f;
  const currPath = curr + f;
  
  if (!fs.existsSync(currPath)) {
    console.log(`NEW: ${f}`);
    continue;
  }
  
  const origData = fs.readFileSync(origPath, 'utf8');
  const currData = fs.readFileSync(currPath, 'utf8');
  if (origData !== currData) {
    console.log(`MODIFIED: ${f}`);
  }
}
