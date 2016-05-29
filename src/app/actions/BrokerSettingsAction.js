import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../utils/AppConstants';

class BrokerSettingsAction {  

    static saveBrokerSettings(bsObj) { 
        AppDispatcher.dispatch({ 
            actionType: AppConstants.ACTION_SAVE_BROKER_SETTINGS, 
            bsObj: bsObj 
        }); 
    }

}

export default BrokerSettingsAction;