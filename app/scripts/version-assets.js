const fsExtra = require('fs-extra');
const path = require('path');
const glob = require('glob');
// const cwd = process.cwd();
const { appVersion } = require('./version.json');

// If you use mono repo, then you can receive argument from the command as the app name
// const app = process.argv.slice(2)[0];
// if (!app) {
//   console.log(`Usage: ${process.argv[1]} <app>`);
//   process.exit(1);
// }

glob(`/dist/app/browser/*assets`, {}, async(error, files) => {
  files.forEach(async(file) => {
    const directory = path.dirname(file);
    const name = path.basename(file);
    await fsExtra.copy(file, path.join(directory, appVersion, name))
  })
})
