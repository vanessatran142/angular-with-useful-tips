const fs = require('fs').promises;
const glob = require('glob');
const cwd = process.cwd();
const app = process.argv.slice(2)[0];
const logMessage = msg => console.log(`[copy-index.js] - ${msg}`);

if (!app) {
  console.log('Invalid command  - please provide argument (app)');
  process.exit(1);
} else {
  glob(`${cwd}/dist/app/${app}/browser/index*.html`, {}, async(error, files) => {
    try {
      if (error) {
        logMessage(`No matching index.html found: ${error}`);
        process.exit(1);
      } else {
        // If we have multiple languages for our Angular app
        const indexHtmlEn = files[0];
        const indexHtmlFr = indexHtmlEn.replace('.html', '-fr.html');

        // Make a french copy
        await fs.copyFile(indexHtmlEn, indexHtmlFr);
        logMessage("French version of index.html created");
        // Update language and base href tag
        const data = await fs.readFile(indexHtmlFr, 'utf8');
        let result = data.replace(`html lang="en"`, `html lang="fr"`);
        logMessage('updated language attribute to "fr"');
        const buildBaseHref = href => `<base href="${href}">`;
        if (app === 'XXX') {
          result = result.replace(
            buildBaseHref(`/angular-base-path/en/XXX`),
            buildBaseHref(`/angular-base-path/fr/XXX`)
          );
          logMessage("updated XXX base href");
        } else if (app === 'YYY') {
          result = result.replace(
            buildBaseHref(`/angular-base-path/en/YYY`),
            buildBaseHref(`/angular-base-path/fr/YYY`)
          );
          logMessage("updated YYY base href");
        }
        await fs.writeFile(indexHtmlFr, result, 'utf8');
      }
    }catch(e) {
      logMessage(e);
      process.exit(1);
    }
  });
}
