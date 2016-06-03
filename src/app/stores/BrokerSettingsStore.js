import Events from 'events';
import localforage from 'localforage';
import Q from 'q';
import _ from 'lodash';

import AppConstants from '../utils/AppConstants';
import AppDispatcher from '../dispatcher/AppDispatcher';
import BrokerSettings from '../models/BrokerSettings';
import PublisherSettings from '../models/PublisherSettings';
import SubscriberSettings from '../models/SubscriberSettings';
import BrokerSettingsAction from '../actions/BrokerSettingsAction';

class BrokerSettingsStore extends Events.EventEmitter {  

    constructor() {
        super();
        this.db = localforage.createInstance({name:"brokerSettings"});
        this.registerToAppDispatcher = this.registerToAppDispatcher.bind(this);
        this.emitChange = this.emitChange.bind(this);
        this.addChangeListener = this.addChangeListener.bind(this);
        this.removeChangeListener = this.removeChangeListener.bind(this);

        this.getAllBrokerSettings = this.getAllBrokerSettings.bind(this);
        this.saveBrokerSettings = this.saveBrokerSettings.bind(this);
        this.deleteBrokerSettingsById = this.deleteBrokerSettingsById.bind(this);

        this.getBrokerSettingsById = this.getBrokerSettingsById.bind(this);
        this.savePublisherSettings = this.savePublisherSettings.bind(this);
        this.removePublisherSettings = this.removePublisherSettings.bind(this);
        this.saveSubscriberSettings = this.saveSubscriberSettings.bind(this);
        this.removeSubscriberSettings = this.removeSubscriberSettings.bind(this);

        this.registerToAppDispatcher();
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
            var text;
            switch(action.actionType) {
                case AppConstants.ACTION_SAVE_BROKER_SETTINGS:
                    var brokerObj = action.bsObj;
                    if (brokerObj !== null) {
                        this.saveBrokerSettings(brokerObj);
                    }
                    break;
                case AppConstants.ACTION_DELETE_BROKER_SETTINGS:
                    this.deleteBrokerSettingsById(action.bsId);
                    break;
                case AppConstants.ACTION_ADD_PUBLISHER_BUTTON_CLICK:
                    this.savePublisherSettings(action.bsId,action.publisher);
                    break;
                case AppConstants.ACTION_REMOVE_PUBLISHER_BUTTON_CLICK:
                    this.removePublisherSettings(action.bsId,action.pubId);
                    break;
                case AppConstants.ACTION_ADD_SUBSCRIBER_BUTTON_CLICK:
                    this.saveSubscriberSettings(action.bsId,action.subscriber);
                    break;
                case AppConstants.ACTION_REMOVE_SUBSCRIBER_BUTTON_CLICK:
                    this.removeSubscriberSettings(action.bsId,action.subId);
                    break;
                default:
            }
        }.bind(this));
    }

    getAllBrokerSettings() { 
        var me =this;
        var brokerSettingsList = [];
        return Q.invoke(this.db,'iterate',
            function(value, key, iterationNumber) {
                brokerSettingsList.push(value);
            }
        ).then(function() {
            return _.sortBy(brokerSettingsList, ['createdOn']);
        });
    }

    saveBrokerSettings(brokerObj) { 
         Q.invoke(this.db,'getItem',brokerObj.bsId)
        .then(function(dbBrokerObj) {
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

            Q.invoke(this.db,'setItem',dbBrokerObj.bsId,dbBrokerObj)
            .then(function(data) {
                this.emitChange(AppConstants.EVENT_BROKER_SETTINGS_CHANGED,data.bsId);
                BrokerSettingsAction.reconnectBroker(dbBrokerObj.bsId);
            }.bind(this)).catch(function (error) {
                console.log(error);
                alert("Error Saving Data. Try Again");
            })
            .done();
        }.bind(this));
    }

    deleteBrokerSettingsById(bsId) {
        return Q.invoke(this.db,'removeItem',bsId)
            .then(function(){
                this.emitChange(AppConstants.EVENT_BROKER_SETTINGS_CHANGED,bsId);
            }.bind(this))
            .catch(function (error) {
                alert("Error deleting. Try Again");
            })
            .done();
    }

    getBrokerSettingsById(bsId) { 
        return Q.invoke(this.db,'getItem',bsId)
        .then(function(data) {
            return data;
        }.bind(this));
    }

    savePublisherSettings(bsId,publisher) { 
        Q.invoke(this.db,'getItem',bsId)
        .then(function(obj) {
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
                Q.invoke(this.db,'setItem',bsId,obj)
                .then(function(data) {
                    if(isNew === true) {
                        this.emitChange(AppConstants.EVENT_BROKER_SETTINGS_CHANGED,bsId);
                    }
                }.bind(this)).catch(function (error) {
                     alert("Error Saving Data. Try Again");
                })
                .done();
            }
        }.bind(this));
    }

    removePublisherSettings(bsId,pubId) {
        Q.invoke(this.db,'getItem',bsId)
        .then(function(obj) {
            if(obj!=null && obj.publishSettings!=null && obj.publishSettings.length>0) {
                var pubIndex = _.findIndex(obj.publishSettings,{'pubId':pubId});
                if (pubIndex > -1) {
                    obj.publishSettings.splice(pubIndex, 1);
                    Q.invoke(this.db,'setItem',bsId,obj)
                    .then(function(data) {
                        this.emitChange(AppConstants.EVENT_BROKER_SETTINGS_CHANGED,bsId);
                        BrokerSettingsAction.clearPublisherConnectionData(bsId,pubId);
                    }.bind(this)).catch(function (error) {
                         alert("Error Saving Data. Try Again");
                    })
                    .done();
                }
            }
        }.bind(this));
    }

    saveSubscriberSettings(bsId,subscriber) { 
        Q.invoke(this.db,'getItem',bsId)
        .then(function(obj) {
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

                Q.invoke(this.db,'setItem',bsId,obj)
                .then(function(data) {
                    if(isNew === true) {
                        this.emitChange(AppConstants.EVENT_BROKER_SETTINGS_CHANGED,bsId);
                    }
                }.bind(this)).catch(function (error) {
                     alert("Error Saving Data. Try Again");
                })
                .done();
            }
        }.bind(this));
    }

    removeSubscriberSettings(bsId,subId) {
        Q.invoke(this.db,'getItem',bsId)
        .then(function(obj) {
            if(obj!=null && obj.subscribeSettings!=null && obj.subscribeSettings.length>0) {
                var subIndex = _.findIndex(obj.subscribeSettings,{'subId':subId});
                if (subIndex > -1) {
                    obj.subscribeSettings.splice(subIndex, 1);
                    Q.invoke(this.db,'setItem',bsId,obj)
                    .then(function(data) {
                        this.emitChange(AppConstants.EVENT_BROKER_SETTINGS_CHANGED,bsId);
                    }.bind(this)).catch(function (error) {
                         alert("Error Saving Data. Try Again");
                    })
                    .done();
                }
            }
        }.bind(this));
    }
}

export default new BrokerSettingsStore();
