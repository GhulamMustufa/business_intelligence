const fs = require('fs');
const glob = require('glob');

const files = glob.sync('apps/web/src/components/**/*.tsx');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('@clerk/nextjs')) {
    content = content.replace(/import\s+\{\s*useAuth\s*\}\s+from\s+['"]@clerk\/nextjs['"];/g, 'import { getToken } from "@/app/actions/auth";');
    content = content.replace(/const\s+\{\s*getToken\s*\}\s*=\s*useAuth\(\);/g, '');
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
}
