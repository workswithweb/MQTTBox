import MqttClientConnectionWorker from '../workers/MqttClientConnectionWorker';
import MqttClientConstants from '../utils/MqttClientConstants';

class PlatformMqttClientWorkerService {  
    constructor() {
        this.mqttClientConnectionWorker = new MqttClientConnectionWorker();
        this.mqttClientConnectionWorker.addChangeListener(this.processEvents.bind(this));

        self.addEventListener('message',function(event) {
            this.mqttClientConnectionWorker.processAction(event.data);
        }.bind(this),false);
    }

    processEvents(eventObj) {
        if(eventObj.event == MqttClientConstants.EVENT_MQTT_CLIENT_CONNECTION_CLOSED) {
            close();
        } else {
            postMessage(eventObj);
        }
    }
}

export default new PlatformMqttClientWorkerService();