import CommonConstants from '../utils/CommonConstants';
import MqttClientConstants from '../utils/MqttClientConstants';
import MqttClientConnectionWorker from '../workers/MqttClientConnectionWorker';

class PlatformMqttClientService {  

    constructor() {
        chrome.runtime.onMessage.addListener(this.processAction.bind(this));
        this.mqttClientConnectionWorkers = {};
    }

    processAction(actionObj) {
        if(actionObj.serviceType == CommonConstants.SERVICE_TYPE_MQTT_CLIENTS && actionObj.action!=null) {
            var action = actionObj.action;
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
    }

    processEvents(event) {
        chrome.runtime.sendMessage({event:event,serviceType:CommonConstants.SERVICE_TYPE_MQTT_CLIENTS});
    }

    connectToBroker(action) {
        var mqttClientConnectionWorker = this.mqttClientConnectionWorkers[action.data.mcsId];
        if(mqttClientConnectionWorker!=null) {
            mqttClientConnectionWorker.processAction(action);
        } else {
            mqttClientConnectionWorker = new MqttClientConnectionWorker();
            mqttClientConnectionWorker.addChangeListener(this.processEvents.bind(this));
            this.mqttClientConnectionWorkers[action.data.mcsId] = mqttClientConnectionWorker;
            mqttClientConnectionWorker.processAction(action);
        }
    }

    disConnectFromBroker(action) {
        var mqttClientConnectionWorker = this.mqttClientConnectionWorkers[action.data];
        if(mqttClientConnectionWorker!=null) {
            mqttClientConnectionWorker.processAction(action);
            delete this.mqttClientConnectionWorkers[action.data];
        }
    }

    sendAction(action) {
        var mqttClientConnectionWorker = this.mqttClientConnectionWorkers[action.data.mcsId];
        if(mqttClientConnectionWorker!=null) {
            mqttClientConnectionWorker.processAction(action);
        }
    }
}

export default new PlatformMqttClientService();