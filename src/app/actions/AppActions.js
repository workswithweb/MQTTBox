import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../utils/AppConstants';

class AppActions {  

    static showHideMenu(data) { 
        AppDispatcher.dispatch({ 
            actionType: AppConstants.ACTION_OPEN_CLOSE_APP_DRAWER, 
            data: data 
        }); 
    }

    static showUserMessage(data) { 
        AppDispatcher.dispatch({ 
            actionType: AppConstants.ACTION_SHOW_MESSAGE, 
            data: data 
        }); 
    }

    static saveBrokerSettings(data) { 
        AppDispatcher.dispatch({ 
            actionType: AppConstants.ACTION_BROKER_SETTINGS_CHANGE, 
            data: data  
        }); 
    }

    static deleteBrokerSettings(data) { 
        AppDispatcher.dispatch({ 
            actionType: AppConstants.ACTION_DELETE_BROKER_SETTINGS, 
            data: data  
        }); 
    }

    static onAddPublisherButtonClick(data) { 
        AppDispatcher.dispatch({ 
            actionType: AppConstants.ACTION_ADD_PUBLISHER_BUTTON_CLICK, 
            data: data  
        }); 
    }

    static onRemovePublisherButtonClick(data) { 
        AppDispatcher.dispatch({ 
            actionType: AppConstants.ACTION_REMOVE_PUBLISHER_BUTTON_CLICK, 
            data: data  
        }); 
    }

    static onAddSubscriberButtonClick(data) { 
        AppDispatcher.dispatch({ 
            actionType: AppConstants.ACTION_ADD_SUBSCRIBER_BUTTON_CLICK, 
            data: data  
        }); 
    }

    static onRemoveSubscriberButtonClick(data) { 
        AppDispatcher.dispatch({ 
            actionType: AppConstants.ACTION_REMOVE_SUBSCRIBER_BUTTON_CLICK, 
            data: data  
        }); 
    }

    static publishMessage(data) { 
        AppDispatcher.dispatch({ 
            actionType: AppConstants.ACTION_PUBLISH_MESSAGE_TO_TOPIC, 
            data:data
        }); 
    }

    static subscribeToTopic(data) { 
        AppDispatcher.dispatch({ 
            actionType: AppConstants.ACTION_SUBSCRIBE_TO_TOPIC, 
            data:data
        }); 
    }

    static unSubscribeTopic(data) { 
        AppDispatcher.dispatch({ 
            actionType: AppConstants.ACTION_UN_SUBSCRIBE_TO_TOPIC, 
            data:data
        }); 
    }

    static saveMqttLoadSettings(data) { 
        AppDispatcher.dispatch({ 
            actionType: AppConstants.ACTION_MQTT_LOAD_SAVE, 
            data: data  
        }); 
    }

    static deleteMqttLoadSettings(data) { 
        AppDispatcher.dispatch({ 
            actionType: AppConstants.ACTION_MQTT_LOAD_DELETE, 
            data: data  
        }); 
    }

    static startMqttLoad(data) { 
        AppDispatcher.dispatch({ 
            actionType: AppConstants.ACTION_MQTT_LOAD_START, 
            data: data  
        }); 
    }

    static stopMqttLoad(data) { 
        AppDispatcher.dispatch({ 
            actionType: AppConstants.ACTION_MQTT_LOAD_END, 
            data: data  
        }); 
    }

}

export default AppActions;
