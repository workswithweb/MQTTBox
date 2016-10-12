# MQTTBox for desktop
npm install
./node_modules/.bin/babel --presets es2015,react --watch src/app --out-dir build/
./node_modules/.bin/babel --presets es2015,react src/app --out-dir build/
copy "www" directory content to "build" directory
nodemon --watch * --exec "electron ./build"

# Building electron apps

https://github.com/szwacz/electron-boilerplate
