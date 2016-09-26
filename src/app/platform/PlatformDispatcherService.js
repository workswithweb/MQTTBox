import PlatformMqttClientActionService from './PlatformMqttClientActionService';
import PlatformMqttLoadActionService from './PlatformMqttLoadActionService';
import MqttClientService from '../services/MqttClientService';
import MqttLoadService from '../services/MqttLoadService';
import CommonConstants from '../utils/CommonConstants';

class PlatformDispatcherService {  

    dispatcherAction(action,serviceType) { 
        if(serviceType == CommonConstants.SERVICE_TYPE_MQTT_CLIENTS) {
            PlatformMqttClientActionService.processAction(action);
        } else if(serviceType == CommonConstants.SERVICE_TYPE_MQTT_LOAD) {
            PlatformMqttLoadActionService.processAction(action);
        }
    }

    processEvents(event,serviceType) {
        if(serviceType == CommonConstants.SERVICE_TYPE_MQTT_CLIENTS) {
            MqttClientService.processEvents(event);
        } else if(serviceType == CommonConstants.SERVICE_TYPE_MQTT_LOAD) {
            MqttLoadService.processEvents(event);
        }
    }
}

export default new PlatformDispatcherService();