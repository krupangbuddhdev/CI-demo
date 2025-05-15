const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');
const { execSync } = require('child_process');

// Replace this with your Angular project name (from angular.json -> defaultProject)
const angularProjectName = 'my-angular-app'; 

const distPath = path.resolve(__dirname, 'dist', angularProjectName);
const outputZipPath = path.resolve(__dirname, 'build.zip');

async function buildAngularApp() {
  console.log('Building Angular app...');
  execSync(`npx ng build --configuration production`, { stdio: 'inherit' });
}

async function zipBuildOutput() {
  if (!(await fs.pathExists(distPath))) {
    throw new Error(`Build folder not found at: ${distPath}`);
  }

  const output = fs.createWriteStream(outputZipPath);
  const archive = archiver('zip', {
    zlib: { level: 9 },
  });

  output.on('close', () => {
    console.log(`Zipped build: ${outputZipPath} (${archive.pointer()} total bytes)`);
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);
  archive.directory(distPath, false); // false = skip including parent folder
  await archive.finalize();
}

(async () => {
  try {
    await buildAngularApp();
    await zipBuildOutput();
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
