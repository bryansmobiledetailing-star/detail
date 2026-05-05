import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

const zipPath = "repo/bryan's-showroom-quality-detailing.zip";
execSync(`npx -y adm-zip-cli extract -i "${zipPath}" -o repo/extracted`);
