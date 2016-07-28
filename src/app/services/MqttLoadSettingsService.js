import Events from 'events';
import _ from 'lodash';
import UUID from 'node-uuid';
import localforage from 'localforage';
import Q from 'q';

import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../utils/AppConstants';
import MqttLoadConstants from '../utils/MqttLoadConstants';
import MqttLoadSettings from '../models/MqttLoadSettings';

class MqttLoadSettingsService extends Events.EventEmitter {

    constructor() {
        super();
        this.dbWorker = new Worker('./js/MqttLoadSettingsDbWorker.js');
        this.MqttLoadDataDbWorker = new Worker('./js/MqttLoadDataDbWorker.js');
        this.loadDataDb = localforage.createInstance({name:MqttLoadConstants.DB_MQTT_LOAD_DATA,driver:localforage.INDEXEDDB});
        this.mqttLoadSettingObjs = {};
        this.connWorkers = {};

        this.registerToAppDispatcher = this.registerToAppDispatcher.bind(this);
        this.workerMessageListener = this.workerMessageListener.bind(this);
        this.syncMqttLoadSettingsCache = this.syncMqttLoadSettingsCache.bind(this);
        this.saveMqttLoadSettings = this.saveMqttLoadSettings.bind(this);
        this.getAllMqttLoadSettingsData = this.getAllMqttLoadSettingsData.bind(this);
        this.getMqttLoadSettingsDataByBsId = this.getMqttLoadSettingsDataByBsId.bind(this);
        this.startMqttLoad = this.startMqttLoad.bind(this);
        this.stopMqttLoad = this.stopMqttLoad.bind(this);
        this.updateMqttLoadData = this.updateMqttLoadData.bind(this);
        this.mqttLoadFinished = this.mqttLoadFinished.bind(this);
        this.getMqttLoadDataByInstanceId = this.getMqttLoadDataByInstanceId.bind(this);
        this.getMqttLoadDataByInstanceIds = this.getMqttLoadDataByInstanceIds.bind(this);

        this.registerToAppDispatcher();
        this.dbWorker.addEventListener('message',this.workerMessageListener);
        this.dbWorker.postMessage({cmd:AppConstants.WORKER_CMD_GET_ALL});
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
                case AppConstants.ACTION_MQTT_LOAD_SAVE:
                    this.saveMqttLoadSettings(action.data);
                    break;
                case AppConstants.ACTION_MQTT_LOAD_DELETE:
                    this.deleteMqttLoadSettingsById(action.data);
                    break;
                case AppConstants.ACTION_MQTT_LOAD_START:
                    this.startMqttLoad(action.data);
                    break;
                case AppConstants.ACTION_MQTT_LOAD_END:
                    this.stopMqttLoad(action.data);
                    break;
                default:
            }
        }.bind(this));
    }

    workerMessageListener(event) { 
        var data = event.data;
        switch(data.event) {
            case AppConstants.WORKER_EVENT_ALL_MQTT_LOAD_DATA:
                this.syncMqttLoadSettingsCache(data.payload);
                break;
            case MqttLoadConstants.WORKER_EVENT_MQTT_LOAD_DATA:
                this.updateMqttLoadData(data.payload);
                break;
            case MqttLoadConstants.WORKER_EVENT_MQTT_LOAD_FINISHED:
                this.mqttLoadFinished(data.payload);
                break;
            default:
        }
    }

    syncMqttLoadSettingsCache(vsList) { 
        if(vsList!=null && vsList.length>0) {
            for(var i=0;i<vsList.length;i++) {
                var vsObj = vsList[i];
                if(vsObj!=null && vsObj.bsId!=null) {
                    this.mqttLoadSettingObjs[vsObj.bsId] = vsObj;
                }
            }
            this.emitChange(AppConstants.EVENT_MQTT_LOAD_SETTINGS_CHANGED,null);
        }
    }

    saveMqttLoadSettings(loadObj) { 
        var dbLoadObj = this.mqttLoadSettingObjs[loadObj.bsId];
        if(dbLoadObj == null) {
            dbLoadObj = new MqttLoadSettings();
        }
        dbLoadObj.brokerName = loadObj.brokerName;
        dbLoadObj.protocol = loadObj.protocol;
        dbLoadObj.host = loadObj.host;
        dbLoadObj.loadType = loadObj.loadType;
        dbLoadObj.msgCount = loadObj.msgCount;
        dbLoadObj.runTime = loadObj.runTime;
        dbLoadObj.instanceCount = loadObj.instanceCount;
        dbLoadObj.topic = loadObj.topic;
        dbLoadObj.qos = loadObj.qos;
        dbLoadObj.payload = loadObj.payload;
        dbLoadObj.updatedOn = +(new Date());
        this.mqttLoadSettingObjs[dbLoadObj.bsId] = dbLoadObj;
        this.emitChange(AppConstants.EVENT_MQTT_LOAD_SETTINGS_CHANGED,dbLoadObj.bsId);
        this.dbWorker.postMessage({cmd:AppConstants.WORKER_CMD_SAVE,payload:dbLoadObj});
    }

    deleteMqttLoadSettingsById(bsId) {
        var loadObj = this.getMqttLoadSettingsDataByBsId(bsId);
        if(loadObj!=null) {
            var instances = _.values(loadObj.instances);
            if(instances!=null && instances.length>0) {
                var iIds = [];
                for(var i=0;i<instances.length;i++) {
                    iIds.push(instances[i].iId);
                }
                this.MqttLoadDataDbWorker.postMessage({cmd:AppConstants.WORKER_CMD_DELETE,payload:iIds});
            }
            delete this.mqttLoadSettingObjs[bsId];
            this.emitChange(AppConstants.EVENT_MQTT_LOAD_SETTINGS_CHANGED,bsId);
            this.dbWorker.postMessage({cmd:AppConstants.WORKER_CMD_DELETE,payload:{bsId:bsId}});
        }
    }

    getAllMqttLoadSettingsData() {
        return _.values(this.mqttLoadSettingObjs);
    }

    getMqttLoadSettingsDataByBsId(bsId) {
        return this.mqttLoadSettingObjs[bsId];
    }

    updateMqttLoadData(data) { 
        var loadObj = this.getMqttLoadSettingsDataByBsId(data.bsId);
        var instance = loadObj.instances[data.iId];
        if(instance!=null) {
            if(data.status!=null && data.status.fs!=null && data.status.ts!=null) {
                for(var i=0;i<instance.messages.length;i++) {
                    var mess = instance.messages[i];
                    if(mess!=null && mess.status!=null && mess.status == data.status.fs) {
                        instance.messages[i].status = data.status.ts;
                    }
                }
            }
            instance.messages.unshift(data.message);
            this.emitChange(AppConstants.EVENT_MQTT_LOAD_SETTINGS_CHANGED,loadObj.bsId);
        }
    }

    mqttLoadFinished(data) { 
        var connWorker = this.connWorkers[data.iId];
        var loadObj = this.getMqttLoadSettingsDataByBsId(data.bsId);
        loadObj.instances[data.iId].metaData.status = data.message.status;

        if(data.metaData!=null) {
            if(data.metaData.messCount!=null && data.metaData.messCount>0) {
                loadObj.instances[data.iId].metaData['messCount'] = data.metaData.messCount;
            } else {
                loadObj.instances[data.iId].metaData['messCount'] =0;
            }

            if(data.metaData.receivedMessagesCount!=null && data.metaData.receivedMessagesCount>0) {
                loadObj.instances[data.iId].metaData['receivedMessagesCount'] = data.metaData.receivedMessagesCount;
            } else {
                loadObj.instances[data.iId].metaData['receivedMessagesCount'] =0;
            }

            if(data.metaData.messageStartTime!=null) {
                loadObj.instances[data.iId].metaData['messageStartTime'] = data.metaData.messageStartTime;
            }

            if(data.metaData.messageEndTime!=null) {
                loadObj.instances[data.iId].metaData['messageEndTime'] = data.metaData.messageEndTime;
            }

            if(data.metaData.qosEndTime!=null) {
                loadObj.instances[data.iId].metaData['qosEndTime'] = data.metaData.qosEndTime;
            }
        }

        this.updateMqttLoadData(data);
        if(connWorker!=null) {
            connWorker.terminate();
            delete this.connWorkers[data.iId];
        }
        this.dbWorker.postMessage({cmd:AppConstants.WORKER_CMD_SAVE,payload:loadObj});
    }

    startMqttLoad(bsId) { 
         var loadObj = this.getMqttLoadSettingsDataByBsId(bsId);
         if(loadObj!=null) {

            var instances = _.values(loadObj.instances);
            if(instances!=null && instances.length>0) {
                var iIds = [];
                for(var i=0;i<instances.length;i++) {
                    iIds.push(instances[i].iId);
                }
                this.MqttLoadDataDbWorker.postMessage({cmd:AppConstants.WORKER_CMD_DELETE,payload:iIds});
            }

            loadObj.instances = {};
            for(var i=0;i<loadObj.instanceCount;i++) {
                var iId = UUID.v4();
                var startMessage = {
                                        status:MqttLoadConstants.STATE_IN_PROGRESS,
                                        message:MqttLoadConstants.LOAD_STARTED,
                                        time:+(new Date())
                                    };
                var iId = UUID.v4();
                loadObj.instances[iId] = {  iId:iId,
                                            metaData:{
                                                status:MqttLoadConstants.STATE_IN_PROGRESS,
                                                loadType:loadObj.loadType,
                                                topic:loadObj.topic,
                                                qos:loadObj.qos,
                                                startTime:+(new Date()),
                                                endTime:null,
                                                receivedMessagesCount:0,
                                                messCount:0,
                                                messageStartTime:null,
                                                messageEndTime:null,
                                                qosEndTime:null,
                                                instanceNumber:(i+1)
                                            },
                                            messages:[startMessage]};

                this.mqttLoadSettingObjs[loadObj.bsId] = loadObj;

                var connWorker = new Worker('./js/MqttLoadWorker.js');
                connWorker.addEventListener('message',this.workerMessageListener);
                connWorker.postMessage({cmd:MqttLoadConstants.WORKER_CMD_MQTT_LOAD_START,payload:{iId:iId,loadObj:loadObj,inum:(i+1)}});
                this.connWorkers[iId] = connWorker;
            }
            this.emitChange(AppConstants.EVENT_MQTT_LOAD_SETTINGS_CHANGED,loadObj.bsId);
         }
    }

    stopMqttLoad(bsId) {
        var loadObj = this.getMqttLoadSettingsDataByBsId(bsId);
        if(loadObj!=null) {
            var instances = _.values(loadObj.instances);
            if(instances!=null && instances.length>0) {
                for(var i=0;i<instances.length;i++) {
                    var connWorker = this.connWorkers[instances[i].iId];
                    if(connWorker!=null) {
                        connWorker.postMessage({cmd:MqttLoadConstants.WORKER_CMD_MQTT_LOAD_STOP});
                    }
                }
            }
        }
    }

    getMqttLoadDataByInstanceId(iId) {
        return Q.invoke(this.loadDataDb,'getItem',iId);
    }

    getMqttLoadDataByInstanceIds(iIds) {
        var fCalls = [];
        var allData = [];
        for(var i=0;i<iIds.length;i++) {
            fCalls.push(this.getMqttLoadDataByInstanceId(iIds[i]));
        }
        return Q.all(fCalls)
        .then(function(dataLists) {
            return dataLists;
        });
    }
}
export default new MqttLoadSettingsService();