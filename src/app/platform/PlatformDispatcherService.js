import MqttClientService from '../services/MqttClientService';
import MqttLoadService from '../services/MqttLoadService';
import CommonConstants from '../utils/CommonConstants';

class PlatformDispatcherService {  

    constructor() {
        chrome.runtime.onMessage.addListener(this.processEvents.bind(this));
    }

    dispatcherAction(action,serviceType) { 
        chrome.runtime.sendMessage({action:action,serviceType:serviceType});
    }

    processEvents(eventObj) {
        var serviceType = eventObj.serviceType;
        var event = eventObj.event
        if(event!=null) {
            if(serviceType == CommonConstants.SERVICE_TYPE_MQTT_CLIENTS) {
                MqttClientService.processEvents(event);
            } else if(serviceType == CommonConstants.SERVICE_TYPE_MQTT_LOAD) {
                MqttLoadService.processEvents(event);
            }
        }
    }
}

export default new PlatformDispatcherService();