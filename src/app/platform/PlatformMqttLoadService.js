import MqttLoadConstants from '../utils/MqttLoadConstants';
import CommonConstants from '../utils/CommonConstants';
import MqttLoadTestWorker from '../workers/MqttLoadTestWorker';

class PlatformMqttLoadService {  

    constructor() {
        chrome.runtime.onMessage.addListener(this.processAction.bind(this));
        this.mqttLoadWorkers = {};
    }

    processAction(actionObj) {
        if(actionObj.serviceType == CommonConstants.SERVICE_TYPE_MQTT_LOAD && actionObj.action!=null) {
            var action = actionObj.action;
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
    }

    startMqttLoadTest(action) {
        var mqttLoadWorkerObj = this.mqttLoadWorkers[action.data.iId];
        if(mqttLoadWorkerObj!=null) {
            delete this.mqttLoadWorkers[action.data.iId];
        }
        mqttLoadWorkerObj = new MqttLoadTestWorker();
        mqttLoadWorkerObj.addChangeListener(this.processEvents.bind(this));
        this.mqttLoadWorkers[action.data.iId] = mqttLoadWorkerObj;
        mqttLoadWorkerObj.processAction(action);
    }

    stopMqttLoadTest(action) {
        var mqttLoadWorkerObj = this.mqttLoadWorkers[action.data.iId];
        if(mqttLoadWorkerObj!=null) {
            mqttLoadWorkerObj.processAction(action);
            delete this.mqttLoadWorkers[action.data.iId];
        }
    }

    processEvents(event) {
        chrome.runtime.sendMessage({event:event,serviceType:CommonConstants.SERVICE_TYPE_MQTT_LOAD});
    }
}

export default new PlatformMqttLoadService();