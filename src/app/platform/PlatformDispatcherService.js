import PlatformMqttClientService from './PlatformMqttClientService';
import PlatformMqttLoadService from './PlatformMqttLoadService';
import MqttClientService from '../services/MqttClientService';
import MqttLoadService from '../services/MqttLoadService';
import CommonConstants from '../utils/CommonConstants';

class PlatformDispatcherService {  

    dispatcherAction(action,serviceType) { 
        if(serviceType == CommonConstants.SERVICE_TYPE_MQTT_CLIENTS) {
            PlatformMqttClientService.processAction(action);
        } else if(serviceType == CommonConstants.SERVICE_TYPE_MQTT_LOAD) {
            PlatformMqttLoadService.processAction(action);
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