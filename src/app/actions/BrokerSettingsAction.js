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
}

export default BrokerSettingsAction;
