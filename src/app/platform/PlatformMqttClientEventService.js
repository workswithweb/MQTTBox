import MqttClientConnectionWorker from '../workers/MqttClientConnectionWorker';
import MqttClientConstants from '../utils/MqttClientConstants';

class PlatformMqttClientEventService {  
    constructor() {
        self.addEventListener('message',function(event) {
            MqttClientConnectionWorker.processAction(event.data);
        }.bind(this),false);
    }

    processEvent(eventObj) {
        if(eventObj.event == MqttClientConstants.EVENT_MQTT_CLIENT_CONNECTION_CLOSED) {
            close();
        } else {
            postMessage(eventObj);
        }
    }
}

export default new PlatformMqttClientEventService();