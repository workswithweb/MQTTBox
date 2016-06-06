import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../utils/AppConstants';

class CommonActions {  

    static showHideMenu(open,renderUi) { 
        AppDispatcher.dispatch({ 
            actionType: AppConstants.ACTION_OPEN_CLOSE_MENU, 
            open: open 
        }); 
    }

    static onMenuItemClick(data) { 
        AppDispatcher.dispatch({ 
            actionType: AppConstants.ACTION_SELECT_MENU_ITEM, 
            data: data 
        }); 
    }
}

export default CommonActions;