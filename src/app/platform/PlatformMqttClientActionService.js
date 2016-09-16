//using web workers
import PlatformDispatcherService from './PlatformDispatcherService';
import CommonConstants from '../utils/CommonConstants';

class PlatformMqttClientActionService {  

    constructor() {
        this.mqttClientConnectionWorkers = {};
    }

    processAction(action) {
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
        PlatformDispatcherService.processEvents(event,CommonConstants.SERVICE_TYPE_MQTT_CLIENTS);
    }

    connectToBroker(action) {
        var mqttClientConnectionWorker = this.mqttClientConnectionWorkers[action.data.mcsId];
        if(mqttClientConnectionWorker!=null) {
            mqttClientConnectionWorker.postMessage(action);
        } else {
            mqttClientConnectionWorker = new Worker('./js/PlatformMqttClientEventService.js');
            mqttClientConnectionWorker.addEventListener('message',function(event){
                this.processEvents(event.data);
            }.bind(this));
            this.mqttClientConnectionWorkers[action.data.mcsId] = mqttClientConnectionWorker;
            mqttClientConnectionWorker.postMessage(action);
        }
    }

    disConnectFromBroker(action) {
        var mqttClientConnectionWorker = this.mqttClientConnectionWorkers[action.data];
        if(mqttClientConnectionWorker!=null) {
            mqttClientConnectionWorker.postMessage(action);
            delete this.mqttClientConnectionWorkers[action.data];
        }
    }

    sendAction(action) {
        var mqttClientConnectionWorker = this.mqttClientConnectionWorkers[action.data.mcsId];
        if(mqttClientConnectionWorker!=null) {
            mqttClientConnectionWorker.postMessage(action);
        }
    }
}

export default new PlatformMqttClientActionService();