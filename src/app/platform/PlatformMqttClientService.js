const ipcMain = require('electron').ipcMain;
var childProcess = require('child_process');
const {webContents,app} = require('electron');
import _ from 'lodash';

import CommonConstants from '../utils/CommonConstants';
import MqttClientConstants from '../utils/MqttClientConstants';

class PlatformMqttClientService {  

    constructor() {
        this.mqttClientConnectionWorkers = {};
        this.killChildProcess = this.killChildProcess.bind(this);
        ipcMain.on(CommonConstants.SERVICE_TYPE_MQTT_CLIENTS, this.processAction.bind(this));
    }

    killChildProcess() {
        var workers = _.values(this.mqttClientConnectionWorkers);
        for(var i=0;i<workers.length;i++) {
            workers[i].kill();
        }
    }

    processAction(event, action) {
        switch(action.actionType) {
            case MqttClientConstants.ACTION_MQTT_CLIENT_CONNECT:
                this.connectToBroker(action);
                break;
            case MqttClientConstants.ACTION_MQTT_CLIENT_DISCONNECT:
                this.disConnectFromBroker(action);
                break;
            case MqttClientConstants.ACTION_PUBLISH_MESSAGE:
                this.sendAction(action);
                break;
            case MqttClientConstants.ACTION_SUBSCRIBE_TO_TOPIC:
               this.sendAction(action);
               break;
            case MqttClientConstants.ACTION_UN_SUBSCRIBE_TO_TOPIC:
               this.sendAction(action);
               break;
            default:
        }
    }

    processEvents(event) {
        var webContentsObjs = webContents.getAllWebContents();
        for(var i=0;i<webContentsObjs.length;i++) {
            webContentsObjs[i].send(CommonConstants.SERVICE_TYPE_MQTT_CLIENTS,event);
        }
    }

    connectToBroker(action) {
        var mqttClientConnectionWorker = this.mqttClientConnectionWorkers[action.data.mcsId];
        if(mqttClientConnectionWorker!=null) {
            mqttClientConnectionWorker.send(action);
        } else {
            mqttClientConnectionWorker = childProcess.fork(app.getAppPath()+'/platform/PlatformMqttClientWorkerService.js');
            mqttClientConnectionWorker.on('message', this.processEvents.bind(this));
            this.mqttClientConnectionWorkers[action.data.mcsId] = mqttClientConnectionWorker;
            mqttClientConnectionWorker.send(action);
        }
    }

    disConnectFromBroker(action) {
        var mqttClientConnectionWorker = this.mqttClientConnectionWorkers[action.data];
        if(mqttClientConnectionWorker!=null) {
            mqttClientConnectionWorker.send(action);
            delete this.mqttClientConnectionWorkers[action.data];
        }
    }

    sendAction(action) {
        var mqttClientConnectionWorker = this.mqttClientConnectionWorkers[action.data.mcsId];
        if(mqttClientConnectionWorker!=null) {
            mqttClientConnectionWorker.send(action);
        }
    }
}

export default new PlatformMqttClientService();