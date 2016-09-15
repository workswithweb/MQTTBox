#MQTTBox
####Developers helper program to create and test MQTT connectivity protocol.
Supercharge your MQTT workflow with MQTTBox Apps available on Chrome, Linux, Mac, Web and Windows! Build, test, and document your MQTT connectivity protocol.

######[<img height="75" width="75" src="http://workswithweb.com/images/platforms/chrome.png">](https://chrome.google.com/webstore/detail/mqttbox/kaajoficamnjijhkeomgfljpicifbkaf)Download Chrome app [HERE!](https://chrome.google.com/webstore/detail/mqttbox/kaajoficamnjijhkeomgfljpicifbkaf)
######[<img src="http://workswithweb.com/images/platforms/linux.png">](http://workswithweb.com/html/mqttbox/install_linux.html)Download MQTTBox for Linux [HERE!](http://workswithweb.com/html/mqttbox/install_linux.html)
######[<img height="75" width="75" src="http://workswithweb.com/images/platforms/mac.png">](http://workswithweb.com/html/mqttbox/install_mac.html)Download MQTTBox for MAC  [HERE!](http://workswithweb.com/html/mqttbox/install_mac.html) 
######[<img src="http://workswithweb.com/images/platforms/html.png">](http://workswithweb.com/mqttbox/app) Open Web App [HERE!](http://workswithweb.com/mqttbox/app)
######[<img src="http://workswithweb.com/images/platforms/windows.png">](http://workswithweb.com/html/mqttbox/install_windows.html)Download MQTTBox for Windows [HERE!](http://workswithweb.com/html/mqttbox/install_windows.html)

####MQTTBox features include:
- Connect to multiple mqtt brokers with TCP or Web Sockets protocols
- Connect with wide range of mqtt client connection settings
- Publish/Subscribe to multiple topics at same time
- Supports Single Level(+) and Multilevel(#) subscription to topics
- Copy/Republish payloads
- History of published/subscribed messages for each topic
- Reconnect client to broker

Please report Feature Requests, Enhancements or Bugs to workswithweb@gmail.com or on [Github](https://github.com/issues)

##Getting Started
Make sure you have [Node.js](https://nodejs.org/en/) installed and follow below steps to build and execute.

- `git clone git@github.com:workswithweb/MQTTBox.git`

- `cd MQTTBox`

- `npm install`

Thats it !!! Your project is setup. Execute below commands in your current folder (MQTTBox) as per your app requirements.

######Web App Builds
- `gulp build` - Generates `build` folder with all compiled static web assets in your current directory (MQTTBox). You can deploy `build` in you web/app server.

- `gulp` - Live development mode. Use while development to see live reload of your web app when changes done in code.

######Chrome App Builds

By default, build folder generated is for web app. If you want to generate Chrome app build, follow below steps.

- Change variable `AppConstants.CLIENT_TYPE` in `src/app/utils/AppConstants.js` to `AppConstants.CHROME_APP` (by default it is `AppConstants.WEB_APP` to generate web app.)

- Need to generate custom build of mqtt.js to support TCP with `chrome-net` (detail documentation in progress for this step)

- Execute `gulp build` or `gulp` as mentioned above. This should generate `build` folder.

- Copy chrome specific assets from `chrome` folder into `build` folder. This should have all assets in `build` folder to upload to chrome store.

NOTE: 
1.Web App supports only Websockets because of browser limitations.
2.We are working to make all apps to look in sync.
3.We are working to make all features avaliable to all platforms.