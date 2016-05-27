import Events from 'events';
import AppDispatcher from '../AppDispatcher';
import AppConstants from '../../utils/AppConstants';

class CommonRegister extends Events.EventEmitter {  

    constructor() {
        super();
        this.emitChange = this.emitChange.bind(this);
        this.addChangeListener = this.addChangeListener.bind(this);
        this.removeChangeListener = this.removeChangeListener.bind(this);
        this.registerToAppDispatcher = this.registerToAppDispatcher.bind(this);
        this.registerToAppDispatcher();
    }

    registerToAppDispatcher() { 
        AppDispatcher.register(function(action) {
            switch(action.actionType) {
                case AppConstants.ACTION_OPEN_CLOSE_MENU:
                  this.emitChange(AppConstants.EVENT_OPEN_CLOSE_MENU,action.open);
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
}

export default new CommonRegister();