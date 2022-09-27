#!/bin/bash

#perform the necessary post packaging operations

# Notice, we add the below argument in case you develop the mono repo, then we need the app name
if [["$#" -ne 1]]
then
  echo "Usage: $0 <app name>"
  exit 1
fi

appName=$1

if [! -d "dist/$appName"]
then
  echo "App not found, assuming app was not built"
  exit 0
fi

#First copy the index.html, adjusting the language if necessary
node ./scripts/copy-index.js "$appName"

# Next, take the assets and put them in the  appropriate version folder (example: dist/2.1.234)
# This is because they are not fingerprinted and we need a way for them to be cache-busted
node ./scripts/version-assets.js "$appName"

# Finally move the nginx config up one level so it's in dist/app/
if [-d "app/$appName/src/nginx"]
then
  echo "Copying nginx config to dist/app/$appName"
  mkidr -p dist/app/$appName/ && cp -R app/$appName/src/nginx/* dist/app/$appName
fi
