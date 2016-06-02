import Q from 'q';
import Events from 'events';

import BrokerConnectionFactory from '../utils/BrokerConnectionFactory';
import BrokerSettingsStore from './BrokerSettingsStore';
import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../utils/AppConstants';

class BrokerConnectionStore extends Events.EventEmitter {

    constructor() {
        super();
        this.brokerConnections = {};
        this.currentSelectedBroker = '';

        this.emitChange = this.emitChange.bind(this);
        this.addChangeListener = this.addChangeListener.bind(this);
        this.removeChangeListener = this.removeChangeListener.bind(this);
        this.registerToAppDispatcher = this.registerToAppDispatcher.bind(this);

        this.initBrokerConnections = this.initBrokerConnections.bind(this);
        this.setCurrentSelectedBroker = this.setCurrentSelectedBroker.bind(this);
        this.publishSelectedBrokerConnectionState = this.publishSelectedBrokerConnectionState.bind(this);
        this.brokerConnectionStateChangedListener = this.brokerConnectionStateChangedListener.bind(this);
        this.publishCurrentBrokerData = this.publishCurrentBrokerData.bind(this);
        this.reconnectBroker = this.reconnectBroker.bind(this);

        this.registerToAppDispatcher();
        this.initBrokerConnections();
    }

    emitChange(event,data) { 
        this.emit(event,data);
    }

    addChangeListener(event,callback) { 
        this.on(event,callback);
        switch(event) {
            case AppConstants.EVENT_BROKER_CONNECTION_STATE_CHANGED:
                this.publishSelectedBrokerConnectionState();
                break;
            default:
        }
    }

    removeChangeListener(event,callback) { 
        this.removeListener(event,callback);
    }

    registerToAppDispatcher() { 
        AppDispatcher.register(function(action) {
            switch(action.actionType) {
                case AppConstants.ACTION_SET_SELECTED_BROKER:
                    this.setCurrentSelectedBroker(action.bsId);
                    break;
                default:
            }
        }.bind(this));
    }

    initBrokerConnections() {
        Q.fcall(BrokerSettingsStore.getAllBrokerSettings)
        .then(function(brokerSettingsList) {
            if(brokerSettingsList!=null && brokerSettingsList.length>0) {
                for (var i = 0; i < brokerSettingsList.length; i++) {
                    var brokerConnectionObj = new BrokerConnectionFactory(brokerSettingsList[i]);
                    this.brokerConnections[brokerSettingsList[i].bsId] = brokerConnectionObj;
                    brokerConnectionObj.connect();
                    brokerConnectionObj.addChangeListener(AppConstants.EVENT_BROKER_CONNECTION_STATE_CHANGED,
                        this.brokerConnectionStateChangedListener);
                }
            }
        }.bind(this)).done();
    }

    reconnectBroker(bsId) {
        Q.fcall(BrokerSettingsStore.getBrokerSettingsById,bsId)
        .then(function(brokerSettings) {
            if(brokerSettings!=null && brokerSettings.bsId!=null) {
                    if(this.brokerConnections[bsId]!=null) {
                        this.brokerConnections[bsId].reconnectBroker(brokerSettings);
                    } else {
                        var brokerConnectionObj = new BrokerConnectionFactory(brokerSettings);
                        this.brokerConnections[brokerSettings.bsId] = brokerConnectionObj;
                        brokerConnectionObj.connect();
                        brokerConnectionObj.addChangeListener(AppConstants.EVENT_BROKER_CONNECTION_STATE_CHANGED,
                                                this.brokerConnectionStateChangedListener);
                    }
            }
        }.bind(this)).done();
    }

    setCurrentSelectedBroker(bsId) {
        this.currentSelectedBroker = bsId;
        this.publishCurrentBrokerData();
    }

    publishCurrentBrokerData() {
        this.publishSelectedBrokerConnectionState();
    }

    publishSelectedBrokerConnectionState() {
        var conn = this.brokerConnections[this.currentSelectedBroker];
        if(conn!=null && conn.client!=null) {
            this.emitChange(AppConstants.EVENT_BROKER_CONNECTION_STATE_CHANGED,
            {bsId:this.currentSelectedBroker,status:conn.connState});
        }
    }

    //listners
    brokerConnectionStateChangedListener(data) { 
        if(data!=null && data.bsId == this.currentSelectedBroker) {
            this.publishSelectedBrokerConnectionState();
        }
    }
}


export default new BrokerConnectionStore();
