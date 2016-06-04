import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../utils/AppConstants';

class BrokerSettingsAction {  

    static saveBrokerSettings(bsObj) { 
        AppDispatcher.dispatch({ 
            actionType: AppConstants.ACTION_SAVE_BROKER_SETTINGS, 
            bsObj: bsObj 
        }); 
    }

    static deleteBrokerSettingsById(bsId) { 
        AppDispatcher.dispatch({ 
            actionType: AppConstants.ACTION_DELETE_BROKER_SETTINGS, 
            bsId: bsId 
        }); 
    }

    static onAddPublisherButtonClick(bsId,publisher) { 
        AppDispatcher.dispatch({ 
            actionType: AppConstants.ACTION_ADD_PUBLISHER_BUTTON_CLICK, 
            bsId: bsId ,
            publisher:publisher
        }); 
    }

    static onRemovePublisherButtonClick(bsId,pubId) { 
        AppDispatcher.dispatch({ 
            actionType: AppConstants.ACTION_REMOVE_PUBLISHER_BUTTON_CLICK, 
            bsId: bsId ,
            pubId:pubId
        }); 
    }

    static onAddSubscriberButtonClick(bsId,subscriber) { 
        AppDispatcher.dispatch({ 
            actionType: AppConstants.ACTION_ADD_SUBSCRIBER_BUTTON_CLICK, 
            bsId: bsId ,
            subscriber:subscriber
        }); 
    }

    static onRemoveSubscriberButtonClick(bsId,subId) { 
        AppDispatcher.dispatch({ 
            actionType: AppConstants.ACTION_REMOVE_SUBSCRIBER_BUTTON_CLICK, 
            bsId: bsId ,
            subId:subId
        }); 
    }

    static setCurrentSelectedBroker(bsId) { 
        AppDispatcher.dispatch({ 
            actionType: AppConstants.ACTION_SET_SELECTED_BROKER, 
            bsId: bsId 
        }); 
    }

    static reconnectBroker(bsId) { 
        AppDispatcher.dispatch({ 
            actionType: AppConstants.ACTION_RECONNECT_BROKER, 
            bsId:bsId
        }); 
    }

    static publishMessage(bsId,pubId,topic,message,options) { 
        AppDispatcher.dispatch({ 
            actionType: AppConstants.ACTION_PUBLISH_MESSAGE_TO_TOPIC, 
            bsId:bsId,
            pubId:pubId,
            topic:topic,
            message:message,
            options:options
        }); 
    }

    static clearPublisherConnectionData(bsId,pubId) { 
        AppDispatcher.dispatch({ 
            actionType: AppConstants.ACTION_CLEAR_PUBLISHER_CONNECTION_DATA, 
            bsId:bsId,
            pubId:pubId
        }); 
    }

    static subscribeToTopic(bsId,subId,topic,options) { 
        AppDispatcher.dispatch({ 
            actionType: AppConstants.ACTION_SUBSCRIBE_TO_TOPIC, 
            bsId:bsId,
            subId:subId,
            topic:topic,
            options:options
        }); 
    }

    static unSubscribeTopic(bsId,topic,subId) { 
        AppDispatcher.dispatch({ 
            actionType: AppConstants.ACTION_UN_SUBSCRIBE_TO_TOPIC, 
            bsId:bsId,
            subId:subId,
            topic:topic
        }); 
    }
}

export default BrokerSettingsAction;
