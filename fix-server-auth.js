const fs = require('fs');
const glob = require('glob');

const files = glob.sync('apps/web/src/lib/api/**/*.ts');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/import \{ auth \} from '@clerk\/nextjs\/server';/g, 'import { cookies } from "next/headers";');
  content = content.replace(/const \{ getToken \} = await auth\(\);\n\s*const token = await getToken\(\);/g, 'const cookieStore = cookies();\n  const token = cookieStore.get("auth_token")?.value;');
  fs.writeFileSync(file, content);
  console.log('Fixed', file);
}
