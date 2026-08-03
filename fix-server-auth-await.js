const fs = require('fs');
const glob = require('glob');

const files = glob.sync('apps/web/src/lib/api/**/*.ts');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('const cookieStore = cookies();')) {
    content = content.replace(/const cookieStore = cookies\(\);/g, 'const cookieStore = await cookies();');
    fs.writeFileSync(file, content);
    console.log('Fixed await', file);
  }
}
