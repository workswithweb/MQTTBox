import AppDispatcher from '../dispatcher/AppDispatcher';
import CommonConstants from '../utils/CommonConstants';

class CommonActions {  

    static showHideAppLeftMenu(data) { 
        AppDispatcher.dispatch({ 
            actionType: CommonConstants.ACTION_OPEN_CLOSE_APP_LEFT_DRAWER, 
            data: data 
        }); 
    }

    static showMessageToUser(data) { 
        AppDispatcher.dispatch({ 
            actionType: CommonConstants.ACTION_SHOW_MESSAGE_TO_USER, 
            data: data 
        }); 
    }
}

export default CommonActions;