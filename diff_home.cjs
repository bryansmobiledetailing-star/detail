const { execSync } = require('child_process');
try {
  const output = execSync('diff -u /app/applet/repo/extracted/src/pages/Home.tsx /app/applet/src/pages/Home.tsx', { encoding: 'utf8' });
  console.log("NO DIFFERENCE");
} catch(e) {
  console.log(e.stdout);
}
