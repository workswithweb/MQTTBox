# MQTTBox
#### Developers helper program to create and test MQTT connectivity protocol.
Supercharge your MQTT workflow with MQTTBox Apps available on Chrome, Linux, Mac, Web and Windows! Build, test, and document your MQTT connectivity protocol.

#### [MQTTBox Apps are available for following platforms - Download MQTTBox Apps HERE!](http://workswithweb.com/html/mqttbox/downloads.html)
<img height="75" width="75" src="http://workswithweb.com/images/platforms/chrome.png"/>
<img src="http://workswithweb.com/images/platforms/linux.png"/>
<img height="75" width="75" src="http://workswithweb.com/images/platforms/mac.png"/>
<img src="http://workswithweb.com/images/platforms/html.png"/>
<img src="http://workswithweb.com/images/platforms/windows.png"/>

#### MQTTBox Client features include:
- Connect to multiple mqtt brokers with TCP or Web Sockets protocols
- Connect with wide range of mqtt client connection settings
- Publish/Subscribe to multiple topics at same time
- Supports Single Level(+) and Multilevel(#) subscription to topics
- Copy/Republish payloads
- History of published/subscribed messages for each topic
- Reconnect client to broker

#### MQTTBox Load test features include:
- Load test MQTT publisher/Subscriber.
- Run load test with wide range load test settings
- View load test data 
- View load test results in graphs

Please report Feature Requests, Enhancements or Bugs to workswithweb@gmail.com or on [Github](https://github.com/issues)

## Getting Started
Make sure you have [Node.js](https://nodejs.org/en/) installed and follow below steps to build and execute.

- `git clone git@github.com:workswithweb/MQTTBox.git`

- `cd MQTTBox`

- `npm install`

- `Open /node_modules/mqtt/lib/connect/ws.js file and goto line 56 or where ever you find below code.`
    else {
        throw new Error('Could not determine host. Specify host manually.')
    }
 `Remove this else block completely. We need this step to make mqtt.js works with webworkers`.

Thats it !!! Your project is setup. Execute below commands in your current folder (MQTTBox) as per your app requirements.

###### Web App Builds
- `gulp build` - Generates `build` folder with all compiled static web assets in your current directory (MQTTBox). You can deploy `build` in you web/app server.

- `gulp` - Live development mode. Use while development to see live reload of your web app when changes done in code.

By default `master` branch has MQTTBox web app. Please check other MQTTBox branches for other platform apps.
 
NOTE: 
1.Web App supports only Websockets because of browser limitations.
2.We are working to make all apps to look in sync.
3.We are working to make all features avaliable to all platforms.