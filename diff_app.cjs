const { execSync } = require('child_process');
try {
  const output = execSync('diff -u /app/applet/repo/extracted/src/App.tsx /app/applet/src/App.tsx', { encoding: 'utf8' });
  console.log("NO DIFFERENCE");
} catch(e) {
  console.log(e.stdout);
}
