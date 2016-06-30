import Events from 'events';
import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../utils/AppConstants';

class CommonAppService extends Events.EventEmitter {

    constructor() {
        super();
        this.registerToAppDispatcher = this.registerToAppDispatcher.bind(this);
        this.showHideAppDrawer = this.showHideAppDrawer.bind(this);
        this.registerToAppDispatcher();
    }

    registerToAppDispatcher() { 
        AppDispatcher.register(function(action) {
            switch(action.actionType) {
                case AppConstants.ACTION_OPEN_CLOSE_APP_DRAWER:
                    this.showHideAppDrawer(action.data);
                    break;
                case AppConstants.ACTION_SHOW_MESSAGE:
                    this.emitChange(AppConstants.EVENT_SHOW_MESSAGE,action.data);
                    break;
                default:
            }
        }.bind(this));
    }

    emitChange(event,data) { 
        this.emit(event,data);
    }

    addChangeListener(event,callback) { 
        this.on(event,callback);
    }

    removeChangeListener(event,callback) { 
        this.removeListener(event,callback);
    }

    showHideAppDrawer(data) {
        this.emitChange(AppConstants.EVENT_OPEN_CLOSE_APP_DRAWER,data);
    }
}

export default new CommonAppService();
