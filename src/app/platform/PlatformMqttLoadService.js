const ipcMain = require('electron').ipcMain;
var childProcess = require('child_process');
const {webContents,app} = require('electron');
import _ from 'lodash';

import MqttLoadConstants from '../utils/MqttLoadConstants';
import CommonConstants from '../utils/CommonConstants';

class PlatformMqttLoadService {  

    constructor() {
        this.mqttLoadWorkers = {};
        this.killChildProcess = this.killChildProcess.bind(this);
        ipcMain.on(CommonConstants.SERVICE_TYPE_MQTT_LOAD, this.processAction.bind(this));
    }

    killChildProcess() {
        var workers = _.values(this.mqttLoadWorkers);
        for(var i=0;i<workers.length;i++) {
            workers[i].kill();
        }
    }

    processAction(event, action) {
        switch(action.actionType) {
            case MqttLoadConstants.ACTION_START_MQTT_LOAD_TEST:
                this.startMqttLoadTest(action);
                break;
            case MqttLoadConstants.ACTION_STOP_MQTT_LOAD_TEST:
                this.stopMqttLoadTest(action);
                break;
            default:
        }
    }

    startMqttLoadTest(action) {
        var mqttLoadWorkerObj = this.mqttLoadWorkers[action.data.iId];
        if(mqttLoadWorkerObj!=null) {
            process.kill(mqttLoadWorkerObj.pid, 'SIGHUP');
            delete this.mqttLoadWorkers[action.data.iId];
        }
        mqttLoadWorkerObj = childProcess.fork(app.getAppPath()+'/platform/PlatformMqttLoadWorkerService.js');
        mqttLoadWorkerObj.on('message', this.processEvents.bind(this));
        this.mqttLoadWorkers[action.data.iId] = mqttLoadWorkerObj;
        mqttLoadWorkerObj.send(action);
    }

    stopMqttLoadTest(action) {
        var mqttLoadWorkerObj = this.mqttLoadWorkers[action.data.iId];
        if(mqttLoadWorkerObj!=null) {
            mqttLoadWorkerObj.send(action);
        }
    }

    processEvents(event) {
        var webContentsObjs = webContents.getAllWebContents();
        for(var i=0;i<webContentsObjs.length;i++) {
            webContentsObjs[i].send(CommonConstants.SERVICE_TYPE_MQTT_LOAD,event);
        }
    }
}

export default new PlatformMqttLoadService();