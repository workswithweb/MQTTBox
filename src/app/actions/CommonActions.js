import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../utils/AppConstants';

class CommonActions {  

    static showHideMenu(open) { 
        AppDispatcher.dispatch({ 
            actionType: AppConstants.ACTION_OPEN_CLOSE_MENU, 
            open: open 
        }); 
    }

    static onMenuItemClick(menuId,data) { 
        AppDispatcher.dispatch({ 
            actionType: AppConstants.ACTION_SELECT_MENU_ITEM, 
            menuId: menuId ,
            data: data 
        }); 
    }
}

export default CommonActions;