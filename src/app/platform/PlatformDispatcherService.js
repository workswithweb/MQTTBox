const ipcRenderer = require('electron').ipcRenderer;

import MqttClientService from '../services/MqttClientService';
import MqttLoadService from '../services/MqttLoadService';
import CommonConstants from '../utils/CommonConstants';

class PlatformDispatcherService {  

    constructor() {
        ipcRenderer.on(CommonConstants.SERVICE_TYPE_MQTT_CLIENTS, this.processEvents.bind(this,CommonConstants.SERVICE_TYPE_MQTT_CLIENTS));
        ipcRenderer.on(CommonConstants.SERVICE_TYPE_MQTT_LOAD, this.processEvents.bind(this,CommonConstants.SERVICE_TYPE_MQTT_LOAD));
    }

    dispatcherAction(action,serviceType) { 
        if(serviceType == CommonConstants.SERVICE_TYPE_MQTT_CLIENTS) {
            ipcRenderer.send(CommonConstants.SERVICE_TYPE_MQTT_CLIENTS,action);
        } else if(serviceType == CommonConstants.SERVICE_TYPE_MQTT_LOAD) {
            ipcRenderer.send(CommonConstants.SERVICE_TYPE_MQTT_LOAD,action);
        }
    }

    processEvents(channel,eventEmitter,eventObj) {
        if(channel == CommonConstants.SERVICE_TYPE_MQTT_CLIENTS) {
            MqttClientService.processEvents(eventObj);
        } else if(channel == CommonConstants.SERVICE_TYPE_MQTT_LOAD) {
            MqttLoadService.processEvents(eventObj);
        }
    }
}

export default new PlatformDispatcherService();