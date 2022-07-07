#!/bin/sh
echo $testvar1
echo "In the spexpeditedataviewer component's build script, about to run npm install."
./npm-install.sh
if [ $? -ne 0 ]; then
  echo "npm-install error, exiting.."
  exit 1
fi



echo "Execute a build."
./node_modules/@angular/cli/bin/ng build $buildenv --aot --output-hashing=all
if [ $? -ne 0 ]; then
  echo "Build error, exiting.."
  exit 1
fi

#Zip for shipment, remove if it exists
rm -f spexpeditedataviewer.zip
cd dist/spexpeditedataviewer
zip -r ../../spexpeditedataviewer.zip *

if [ $? -ne 0 ]; then
  echo "Zipping the dist directory resulted in an error"
  exit 1
fi
cd ..
