import Events from 'events';
import AppDispatcher from '../AppDispatcher';
import AppConstants from '../../utils/AppConstants';
import BrokerSettingsStore from '../../stores/BrokerSettingsStore';

class CommonRegister extends Events.EventEmitter {  

    constructor() {
        super();
        this.emitChange = this.emitChange.bind(this);
        this.addChangeListener = this.addChangeListener.bind(this);
        this.removeChangeListener = this.removeChangeListener.bind(this);
        this.registerToAppDispatcher = this.registerToAppDispatcher.bind(this);
        this.onBrokerSettingsChangedEvent = this.onBrokerSettingsChangedEvent.bind(this);
        this.registerToAppDispatcher();
        BrokerSettingsStore.addChangeListener(AppConstants.EVENT_BROKER_SETTINGS_CHANGED,this.onBrokerSettingsChangedEvent);
    }

    registerToAppDispatcher() { 
        AppDispatcher.register(function(action) {
            switch(action.actionType) {
                case AppConstants.ACTION_OPEN_CLOSE_MENU:
                    this.emitChange(AppConstants.EVENT_OPEN_CLOSE_MENU,action.open);
                    break;
                case AppConstants.ACTION_SELECT_MENU_ITEM:
                    this.emitChange(AppConstants.EVENT_SELECT_MENU_ITEM,action.data);
                    break;
                default:
            }
        }.bind(this));
    }

    onBrokerSettingsChangedEvent(bsId) { 
        this.emitChange(AppConstants.EVENT_SELECT_MENU_ITEM,{"menuId":AppConstants.MENU_BROKER_DETAILS,"bsId":bsId});
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
}

export default new CommonRegister();