import PlatformMqttClientActionService from './PlatformMqttClientActionService';
import CommonConstants from '../utils/CommonConstants';
import MqttClientService from '../services/MqttClientService';

class PlatformDispatcherService {  

    dispatcherAction(action,serviceType) { 
        if(serviceType == CommonConstants.SERVICE_TYPE_MQTT_CLIENTS) {
            PlatformMqttClientActionService.processAction(action);
        }
    }

    processEvents(event,serviceType) {
        if(serviceType == CommonConstants.SERVICE_TYPE_MQTT_CLIENTS) {
            MqttClientService.processEvents(event);
        }
    }
}

export default new PlatformDispatcherService();