const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');

const projectName = 'my-angular-app';
const distDir = path.join(__dirname, 'apps', projectName, 'dist', projectName);
const zipPath = path.join(__dirname, 'build.zip');

(async () => {
  if (!(await fs.pathExists(distDir))) {
    console.error('Build directory does not exist:', distDir);
    process.exit(1);
  }

  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    console.log(`Created zip: ${zipPath} (${archive.pointer()} bytes)`);
  });

  archive.on('error', err => { throw err; });

  archive.pipe(output);
  archive.directory(distDir, false);
  await archive.finalize();
})();
