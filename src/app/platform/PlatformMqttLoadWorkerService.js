import MqttLoadTestWorker from '../workers/MqttLoadTestWorker';
import MqttLoadConstants from '../utils/MqttLoadConstants';

class PlatformMqttLoadWorkerService {  
    constructor() {
        this.mqttLoadTestWorker = new MqttLoadTestWorker();
        this.mqttLoadTestWorker.addChangeListener(this.processEvents.bind(this));

        self.addEventListener('message',function(event) {
            this.mqttLoadTestWorker.processAction(event.data);
        }.bind(this),false);
    }

    processEvents(eventObj) {
        postMessage(eventObj);
        if(eventObj.event == MqttLoadConstants.EVENT_MQTT_LOAD_TEST_ENDED) {
            close();
        }
    }
}

export default new PlatformMqttLoadWorkerService();