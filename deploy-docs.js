const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building project...');
execSync('npm run build', { stdio: 'inherit' });

console.log('📁 Copying dist to docs...');
if (fs.existsSync('docs')) {
  fs.rmSync('docs', { recursive: true, force: true });
}

execSync('xcopy dist docs /E /I /Y', { stdio: 'inherit' });

console.log('✅ Docs folder updated!');
console.log('📝 Now commit and push to update GitHub Pages');
