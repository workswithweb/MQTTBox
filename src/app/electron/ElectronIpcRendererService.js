const ipcRenderer = require('electron').ipcRenderer;
import MqttClientConstants from '../utils/MqttClientConstants';
import MqttClientService from '../services/MqttClientService';

class ElectronIpcRendererService {  
    constructor() {
        ipcRenderer.on(MqttClientConstants.CHANNEL_MQTT_CLIENTS, this.processEvents);
    }

    dispatcherAction(action) { 
        switch(action.actionType) {
            case MqttClientConstants.ACTION_MQTT_CLIENT_CONNECT:
                ipcRenderer.send(MqttClientConstants.CHANNEL_MQTT_CLIENTS,action);
                break;
            case MqttClientConstants.ACTION_MQTT_CLIENT_DISCONNECT:
                ipcRenderer.send(MqttClientConstants.CHANNEL_MQTT_CLIENTS,action);
                break;
            case MqttClientConstants.ACTION_PUBLISH_MESSAGE:
                ipcRenderer.send(MqttClientConstants.CHANNEL_MQTT_CLIENTS,action);
                break;
            case MqttClientConstants.ACTION_SUBSCRIBE_TO_TOPIC:
                ipcRenderer.send(MqttClientConstants.CHANNEL_MQTT_CLIENTS,action);
                break;
            case MqttClientConstants.ACTION_UN_SUBSCRIBE_TO_TOPIC:
                ipcRenderer.send(MqttClientConstants.CHANNEL_MQTT_CLIENTS,action);
                break;
            default:
        }
    }

    processEvents(event, arg) {
        if(arg.event == MqttClientConstants.EVENT_MQTT_CLIENT_CONN_STATE_CHANGED) {
            MqttClientService.syncMqttClientStateCache(arg.data);
        } else if(arg.event == MqttClientConstants.EVENT_MQTT_CLIENT_SUBSCRIBED_DATA_RECIEVED) {
            MqttClientService.syncMqttClientSubscribedData(arg.data);
        }
    }
}

export default new ElectronIpcRendererService();