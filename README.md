# angular-with-useful-tips

In order to run the project:

```
cd app
npm install
npm run serve
```

The example Angular app will be served.

However the repo's purpose is not to build an Angular application. This repo keeps all my learning tips for an Angular application that can be useful to anyone else.

**Problem 1: ** Sometimes when we change a CSS (color..) and build Angular app, the changes are not reflected. It's always because of our "smart" browsers that they tend to download the assets file first time it loads the application, and "lazy" to download again even there's a change.

How to fix: Refer the app/scripts/version-assets.js

**Problem 2: ** Post package Angular app script
