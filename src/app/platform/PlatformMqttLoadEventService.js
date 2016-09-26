import MqttLoadTestWorker from '../workers/MqttLoadTestWorker';
import MqttLoadConstants from '../utils/MqttLoadConstants';

class PlatformMqttLoadEventService {  
    constructor() {
        self.addEventListener('message',function(event) {
            MqttLoadTestWorker.processAction(event.data);
        }.bind(this),false);
    }

    processEvent(eventObj) {
        postMessage(eventObj);
        if(eventObj.event == MqttLoadConstants.EVENT_MQTT_LOAD_TEST_ENDED) {
            close();
        }
    }
}

export default new PlatformMqttLoadEventService();