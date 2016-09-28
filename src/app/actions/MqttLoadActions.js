import AppDispatcher from '../dispatcher/AppDispatcher';
import MqttLoadConstants from '../utils/MqttLoadConstants';

class MqttLoadActions {  

    static saveMqttLoadSettings(data) { 
        AppDispatcher.dispatch({ 
            actionType: MqttLoadConstants.ACTION_SAVE_MQTT_LOAD, 
            data: data 
        }); 
    }

    static deleteMqttLoadSettings(mcsId) { 
        AppDispatcher.dispatch({ 
            actionType: MqttLoadConstants.ACTION_DELETE_MQTT_LOAD, 
            data: mcsId 
        }); 
    }

    static startMqttLoadTest(mcsId) { 
        AppDispatcher.dispatch({ 
            actionType: MqttLoadConstants.ACTION_START_MQTT_LOAD_TEST, 
            data: mcsId 
        }); 
    }

    static stopMqttLoadTest(mcsId) { 
        AppDispatcher.dispatch({ 
            actionType: MqttLoadConstants.ACTION_STOP_MQTT_LOAD_TEST, 
            data: mcsId 
        }); 
    }
}

export default MqttLoadActions;