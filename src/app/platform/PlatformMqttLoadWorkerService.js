import MqttLoadTestWorker from '../workers/MqttLoadTestWorker';
import MqttLoadConstants from '../utils/MqttLoadConstants';

class PlatformMqttLoadWorkerService {  
    constructor() {
        this.mqttLoadTestWorker = new MqttLoadTestWorker();
        this.mqttLoadTestWorker.addChangeListener(this.processEvents.bind(this));

        process.on('message',function(action) {
            this.mqttLoadTestWorker.processAction(action);
        }.bind(this),false);
    }

    processEvents(eventObj) {
        process.send(eventObj);
        if(eventObj.event == MqttLoadConstants.EVENT_MQTT_LOAD_TEST_ENDED) {
            process.exit();
        }
    }
}

export default new PlatformMqttLoadWorkerService();