//using web workers
import PlatformDispatcherService from './PlatformDispatcherService';
import MqttLoadConstants from '../utils/MqttLoadConstants';
import CommonConstants from '../utils/CommonConstants';

class PlatformMqttLoadService {  

    constructor() {
        this.mqttLoadWorkers = {};
    }

    processAction(action) {
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
            mqttLoadWorkerObj.terminate();
            delete this.mqttLoadWorkers[action.data.iId];
        }

        mqttLoadWorkerObj = new Worker('./platform/PlatformMqttLoadWorkerService.js');
        mqttLoadWorkerObj.addEventListener('message',function(event) {
            this.processEvents(event.data);
        }.bind(this));
        this.mqttLoadWorkers[action.data.iId] = mqttLoadWorkerObj;
        mqttLoadWorkerObj.postMessage(action);
    }

    stopMqttLoadTest(action) {
        var mqttLoadWorkerObj = this.mqttLoadWorkers[action.data.iId];
        if(mqttLoadWorkerObj!=null) {
            mqttLoadWorkerObj.postMessage(action);
        }
    }

    processEvents(event) {
        PlatformDispatcherService.processEvents(event,CommonConstants.SERVICE_TYPE_MQTT_LOAD);
    }
}

export default new PlatformMqttLoadService();