import Events from 'events';
import _ from 'lodash';

import BrokerSettings from '../models/BrokerSettings';
import PublisherSettings from '../models/PublisherSettings';
import SubscriberSettings from '../models/SubscriberSettings';
import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../utils/AppConstants';
import BrokerConnectionService from './BrokerConnectionService';

class BrokerSettingsService extends Events.EventEmitter {

    constructor() {
        super();

        this.dbWorker = new Worker('./js/BrokerSettingsDbWorker.js');
        this.brokerSettingObjs = {};

        this.registerToAppDispatcher = this.registerToAppDispatcher.bind(this);
        this.workerMessageListener = this.workerMessageListener.bind(this);
        this.syncBrokerSettingsCache = this.syncBrokerSettingsCache.bind(this);
        this.saveBrokerSettings = this.saveBrokerSettings.bind(this);
        this.deleteBrokerSettingsById = this.deleteBrokerSettingsById.bind(this);
        this.savePublisherSettings = this.savePublisherSettings.bind(this);
        this.removePublisherSettings = this.removePublisherSettings.bind(this);
        this.saveSubscriberSettings = this.saveSubscriberSettings.bind(this);
        this.removeSubscriberSettings = this.removeSubscriberSettings.bind(this);
        this.getAllBrokerSettingData = this.getAllBrokerSettingData.bind(this);
        this.getBrokerSettingDataByBsId = this.getBrokerSettingDataByBsId.bind(this);

        this.registerToAppDispatcher();
        this.dbWorker.addEventListener('message',this.workerMessageListener);
        this.dbWorker.postMessage({cmd:AppConstants.WORKER_CMD_GET_ALL});
        this.initComplete = false;
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

    registerToAppDispatcher() { 
        AppDispatcher.register(function(action) {
            switch(action.actionType) {
                case AppConstants.ACTION_BROKER_SETTINGS_CHANGE:
                    this.saveBrokerSettings(action.data);
                    break;
                case AppConstants.ACTION_DELETE_BROKER_SETTINGS:
                    this.deleteBrokerSettingsById(action.data);
                    break;
                case AppConstants.ACTION_ADD_PUBLISHER_BUTTON_CLICK:
                    this.savePublisherSettings(action.data.bsId,action.data.publisher);
                    break;
                case AppConstants.ACTION_REMOVE_PUBLISHER_BUTTON_CLICK:
                    this.removePublisherSettings(action.data.bsId,action.data.pubId);
                    break;
                case AppConstants.ACTION_ADD_SUBSCRIBER_BUTTON_CLICK:
                    this.saveSubscriberSettings(action.data.bsId,action.data.subscriber);
                    break;
                case AppConstants.ACTION_REMOVE_SUBSCRIBER_BUTTON_CLICK:
                    this.removeSubscriberSettings(action.data.bsId,action.data.subId);
                    break;
                default:
            }
        }.bind(this));
    }

    workerMessageListener(event) { 
        var data = event.data;
        switch(data.event) {
            case AppConstants.WORKER_EVENT_ALL_BROKER_SETTINGS_DATA:
                this.syncBrokerSettingsCache(data.payload);
                break;
            default:
        }
    }

    syncBrokerSettingsCache(bsList) { 
        if(bsList!=null && bsList.length>0) {
            for(var i=0;i<bsList.length;i++) {
                var bsObj = bsList[i];
                if(bsObj!=null && bsObj.bsId!=null) {
                    this.brokerSettingObjs[bsObj.bsId] = bsObj;
                    if(this.initComplete == false) {
                        BrokerConnectionService.connectBroker(bsObj);
                    }
                }
            }
            this.emitChange(AppConstants.EVENT_BROKER_SETTINGS_CHANGED,bsList[0].bsId);
        }
        this.initComplete = true;
    }

    saveBrokerSettings(brokerObj) { 
        var dbBrokerObj = this.brokerSettingObjs[brokerObj.bsId];
        if(dbBrokerObj==null) {
            dbBrokerObj = new BrokerSettings();
            dbBrokerObj.bsId = brokerObj.bsId;
            dbBrokerObj.createdOn = +(new Date());
            dbBrokerObj.publishSettings.push(new PublisherSettings());
            dbBrokerObj.subscribeSettings.push(new SubscriberSettings());
        }
        dbBrokerObj.protocol = brokerObj.protocol;
        dbBrokerObj.host = brokerObj.host;
        dbBrokerObj.mqtt311Compliant = brokerObj.mqtt311Compliant;
        dbBrokerObj.keepalive = brokerObj.keepalive;
        dbBrokerObj.reschedulePings = brokerObj.reschedulePings;
        dbBrokerObj.clientId = brokerObj.clientId;
        dbBrokerObj.protocolId = brokerObj.protocolId;
        dbBrokerObj.protocolVersion = brokerObj.protocolVersion;
        dbBrokerObj.queueQoSZero = brokerObj.queueQoSZero;
        dbBrokerObj.clean = brokerObj.clean;
        dbBrokerObj.reconnectPeriod = brokerObj.reconnectPeriod;
        dbBrokerObj.connectTimeout = brokerObj.connectTimeout;
        dbBrokerObj.username = brokerObj.username;
        dbBrokerObj.password = brokerObj.password;
        dbBrokerObj.willTopic = brokerObj.willTopic;
        dbBrokerObj.willPayload = brokerObj.willPayload;
        dbBrokerObj.willQos = brokerObj.willQos;
        dbBrokerObj.willRetain = brokerObj.willRetain;
        dbBrokerObj.brokerName = brokerObj.brokerName;
        dbBrokerObj.updatedOn = +(new Date());
        this.brokerSettingObjs[dbBrokerObj.bsId] = dbBrokerObj;
        this.emitChange(AppConstants.EVENT_BROKER_SETTINGS_CHANGED,dbBrokerObj.bsId);
        this.dbWorker.postMessage({cmd:AppConstants.WORKER_CMD_SAVE,payload:dbBrokerObj});
        BrokerConnectionService.connectBroker(dbBrokerObj);
    }

    deleteBrokerSettingsById(bsId) {
        this.dbWorker.postMessage({cmd:AppConstants.WORKER_CMD_DELETE,payload:{bsId:bsId}});
        BrokerConnectionService.stopConnectionWorker(bsId);
        delete this.brokerSettingObjs[bsId];
        this.emitChange(AppConstants.EVENT_BROKER_SETTINGS_CHANGED,bsId);
    }

    savePublisherSettings(bsId,publisher) { 
        var obj = this.brokerSettingObjs[bsId];
        if(obj!=null && publisher!=null) {
            var isNew = false;
            publisher.updatedOn = +(new Date());
            var pubIndex = _.findIndex(obj.publishSettings,{'pubId':publisher.pubId});

            if(pubIndex!=-1) {
                obj.publishSettings[pubIndex] = publisher;
            } else {
                isNew = true;
                obj.publishSettings.push(publisher);
            }

            if(isNew === true) {
                this.emitChange(AppConstants.EVENT_BROKER_SETTINGS_CHANGED,bsId);
            }
            this.dbWorker.postMessage({cmd:AppConstants.WORKER_CMD_SAVE,payload:obj});
        }
    }

    removePublisherSettings(bsId,pubId) {
        var obj = this.brokerSettingObjs[bsId];
        if(obj!=null && obj.publishSettings!=null && obj.publishSettings.length>0) {
            var pubIndex = _.findIndex(obj.publishSettings,{'pubId':pubId});
            if (pubIndex > -1) {
                obj.publishSettings.splice(pubIndex, 1);
                this.emitChange(AppConstants.EVENT_BROKER_SETTINGS_CHANGED,bsId);
                this.dbWorker.postMessage({cmd:AppConstants.WORKER_CMD_SAVE,payload:obj});
            }
            BrokerConnectionService.clearPublishedMessages(bsId,pubId);
        }
    }

    saveSubscriberSettings(bsId,subscriber) { 
        var obj = this.brokerSettingObjs[bsId];

        if(obj!=null && subscriber!=null) {
            var isNew = false;
            subscriber.updatedOn = +(new Date());
            var subIndex = _.findIndex(obj.subscribeSettings,{'subId':subscriber.subId});
            if(subIndex!=-1) {
                obj.subscribeSettings[subIndex] = subscriber;
            } else {
                isNew = true;
                obj.subscribeSettings.push(subscriber);
            }

            if(isNew === true) {
                this.emitChange(AppConstants.EVENT_BROKER_SETTINGS_CHANGED,bsId);
            }
            this.dbWorker.postMessage({cmd:AppConstants.WORKER_CMD_SAVE,payload:obj});
        }
    }

    removeSubscriberSettings(bsId,subId) {
        var obj = this.brokerSettingObjs[bsId];
        if(obj!=null && obj.subscribeSettings!=null && obj.subscribeSettings.length>0) {
            var subIndex = _.findIndex(obj.subscribeSettings,{'subId':subId});
            if (subIndex > -1) {
                obj.subscribeSettings.splice(subIndex, 1);
                this.emitChange(AppConstants.EVENT_BROKER_SETTINGS_CHANGED,bsId);
                this.dbWorker.postMessage({cmd:AppConstants.WORKER_CMD_SAVE,payload:obj});
                BrokerConnectionService.unSubscribeToTopic({bsId:bsId,subId:subId},false);
            }
        }
    }

    getAllBrokerSettingData() {
        return _.values(this.brokerSettingObjs);
    }

    getBrokerSettingDataByBsId(bsId) {
        return this.brokerSettingObjs[bsId];
    }
}


export default new BrokerSettingsService();
