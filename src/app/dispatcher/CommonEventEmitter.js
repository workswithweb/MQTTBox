import Events from 'events';
import AppDispatcher from './AppDispatcher';
import CommonConstants from '../utils/CommonConstants';
//depending on platform include this
import ElectronIpcRendererService from '../electron/ElectronIpcRendererService';

class CommonEventEmitter extends Events.EventEmitter {

    constructor() {
        super();
        this.registerToAppDispatcher = this.registerToAppDispatcher.bind(this);
        this.emitChange = this.emitChange.bind(this);
        this.addChangeListener = this.addChangeListener.bind(this);
        this.removeChangeListener = this.removeChangeListener.bind(this);
        this.showHideAppDrawer = this.showHideAppDrawer.bind(this);

        this.registerToAppDispatcher();
    }

    registerToAppDispatcher() { 
        AppDispatcher.register(function(action) {
            switch(action.actionType) {
                case CommonConstants.ACTION_OPEN_CLOSE_APP_LEFT_DRAWER:
                    this.showHideAppDrawer(action.data);
                    break;
                case CommonConstants.ACTION_SHOW_MESSAGE_TO_USER:
                    this.emitChange(CommonConstants.EVENT_SHOW_MESSAGE_TO_USER,action.data);
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
        if(data.open!='undefined') {
            this.emitChange(CommonConstants.EVENT_OPEN_CLOSE_APP_LEFT_DRAWER,data.open);
        }
    }
}

export default new CommonEventEmitter();