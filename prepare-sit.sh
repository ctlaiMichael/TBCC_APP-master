npm run build_sit
cp ../www_runtime ../cordova/www
cd ../cordova
# rm -rf platforms
# rm -rf plugins
cordova prepare
cd ../web_resource