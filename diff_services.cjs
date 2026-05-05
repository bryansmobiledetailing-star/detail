const { execSync } = require('child_process');
try {
  const output = execSync('diff -u /app/applet/repo/extracted/src/data/services.ts /app/applet/src/data/services.ts | head -n 40', { encoding: 'utf8' });
  console.log(output);
} catch(e) {
  console.log(e.stdout.slice(0, 2000));
}
