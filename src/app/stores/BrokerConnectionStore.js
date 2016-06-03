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
        this.reconnectBroker = this.reconnectBroker.bind(this);
        this.publishMessageToBroker = this.publishMessageToBroker.bind(this);
        this.isBrokerConnected = this.isBrokerConnected.bind(this);
        this.clearPublisherConnectionData = this.clearPublisherConnectionData.bind(this);


        this.publishCurrentBrokerData = this.publishCurrentBrokerData.bind(this);
        this.publishSelectedBrokerConnectionState = this.publishSelectedBrokerConnectionState.bind(this);
        this.publishSelectedBrokerPublisherData = this.publishSelectedBrokerPublisherData.bind(this);

        this.brokerConnectionStateChangedListener = this.brokerConnectionStateChangedListener.bind(this);

        this.registerToAppDispatcher();
        this.initBrokerConnections();
    }

    registerToAppDispatcher() { 
        AppDispatcher.register(function(action) {
            switch(action.actionType) {
                case AppConstants.ACTION_SET_SELECTED_BROKER:
                    this.setCurrentSelectedBroker(action.bsId);
                    break;
                case AppConstants.ACTION_RECONNECT_BROKER:
                    this.reconnectBroker(action.bsId);
                    break;
                case AppConstants.ACTION_PUBLISH_MESSAGE:
                    this.publishMessageToBroker(action.bsId,action.pubId,action.topic,action.message,action.options);
                    break;
                case AppConstants.ACTION_CLEAR_PUBLISHER_CONNECTION_DATA:
                    this.clearPublisherConnectionData(action.bsId,action.pubId);
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

    publishMessageToBroker(bsId,pubId,topic,message,options) {
        var conn = this.brokerConnections[this.currentSelectedBroker];
        if(conn!=null && conn.client!=null && conn.client.connected===true) {
            conn.publishMessage(pubId,topic,message,options);
        } else {
            alert('Unable to connect to Broker. Please check your broker settings.');
        }
    }

    publishCurrentBrokerData() {
        this.publishSelectedBrokerConnectionState();
        this.publishSelectedBrokerPublisherData();
    }

    publishSelectedBrokerConnectionState() {
        var conn = this.brokerConnections[this.currentSelectedBroker];
        if(conn!=null && conn.client!=null) {
            this.emitChange(AppConstants.EVENT_BROKER_CONNECTION_STATE_CHANGED,
            {bsId:this.currentSelectedBroker,status:conn.connState});

        }
    }

    publishSelectedBrokerPublisherData() {
        var conn = this.brokerConnections[this.currentSelectedBroker];
        if(conn!=null && conn.client!=null && conn.publishedMessages!=null) {
            for (var pubId in conn.publishedMessages) {
                if (conn.publishedMessages.hasOwnProperty(pubId) && conn.publishedMessages[pubId]!=null && conn.publishedMessages[pubId].length>0) {
                    this.emitChange(AppConstants.EVENT_PUBLISHER_DATA,
                            {bsId:this.currentSelectedBroker,pubId:pubId,publishedMessages:conn.publishedMessages[pubId]});
                }
            }
        }
    }

    clearPublisherConnectionData(bsId,pubId) {
        var conn = this.brokerConnections[bsId];
        if(conn!=null && conn.client!=null && conn.publishedMessages!=null) {
            delete conn.publishedMessages[pubId];
        }
    }

    isBrokerConnected(bsId) {
        if(this.brokerConnections[bsId] && this.brokerConnections[bsId].client) {
            return this.brokerConnections[bsId].client.connected;
        }
        return false;
    }

    //listners
    brokerConnectionStateChangedListener(data) { 
        if(data!=null && data.bsId == this.currentSelectedBroker) {
            this.publishSelectedBrokerConnectionState();
        }
    }
}


export default new BrokerConnectionStore();
