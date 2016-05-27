import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../utils/AppConstants';

class CommonActions {  

    static showHideMenu(open) { 
        AppDispatcher.dispatch({ 
            actionType: AppConstants.ACTION_OPEN_CLOSE_MENU, 
            open: open 
        }); 
    }

}

export default CommonActions;