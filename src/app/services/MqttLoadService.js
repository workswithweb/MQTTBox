import Events from 'events';
import _ from 'lodash';
import UUID from 'node-uuid';

import AppDispatcher from '../dispatcher/AppDispatcher';
import MqttLoadConstants from '../utils/MqttLoadConstants';
import CommonConstants from '../utils/CommonConstants';
import MqttLoadSettings from '../models/MqttLoadSettings';
import MqttLoadDbService from './MqttLoadDbService';
import PlatformDispatcherService from '../platform/PlatformDispatcherService';

class MqttLoadService extends Events.EventEmitter {

    constructor() {
        super();
        this.mqttLoadSettingObjs = {};

        this.registerToAppDispatcher();
        this.syncMqttLoadSettingsCache();
    }

    registerToAppDispatcher() { 
        AppDispatcher.register(function(action) {
            switch(action.actionType) {
                case MqttLoadConstants.ACTION_SAVE_MQTT_LOAD:
                    this.saveMqttLoadSettings(action.data);
                    break;
                case MqttLoadConstants.ACTION_DELETE_MQTT_LOAD:
                    this.deleteMqttLoadSettings(action.data);
                    break;
                case MqttLoadConstants.ACTION_START_MQTT_LOAD_TEST:
                    this.startMqttLoadTest(action.data);
                    break;
                case MqttLoadConstants.ACTION_STOP_MQTT_LOAD_TEST:
                    this.stopMqttLoadTest(action.data);
                    break;
                default:
            }
        }.bind(this));
    }

    syncMqttLoadSettingsCache() { 
        MqttLoadDbService.getAllMqttLoadSettings()
        .then(function(mqttLoadList) {
            if(mqttLoadList!=null && mqttLoadList.length>0) {
                for(var i=0;i<mqttLoadList.length;i++) {
                    var mqttLoadObj = mqttLoadList[i];
                    if(mqttLoadObj!=null && mqttLoadObj.mcsId!=null) {
                        this.mqttLoadSettingObjs[mqttLoadObj.mcsId] = mqttLoadObj;
                    }
                }
                this.emitChange(MqttLoadConstants.EVENT_MQTT_LOAD_SETTINGS_CHANGED,mqttLoadList[0].mcsId);
            }
        }.bind(this))
        .done();
    }

    saveMqttLoadSettings(loadObj) { 
        var dbLoadObj = this.mqttLoadSettingObjs[loadObj.mcsId];
        if(dbLoadObj == null) {
            dbLoadObj = new MqttLoadSettings();
        }
        dbLoadObj.mqttClientName = loadObj.mqttClientName;
        dbLoadObj.protocol = loadObj.protocol;
        dbLoadObj.host = loadObj.host;
        dbLoadObj.loadTestType = loadObj.loadTestType;
        dbLoadObj.msgCount = loadObj.msgCount;
        dbLoadObj.runTime = loadObj.runTime;
        dbLoadObj.timeOut = loadObj.timeOut;
        dbLoadObj.instanceCount = loadObj.instanceCount;
        dbLoadObj.topic = loadObj.topic;
        dbLoadObj.qos = loadObj.qos;
        dbLoadObj.payload = loadObj.payload;
        dbLoadObj.updatedOn = +(new Date());
        this.mqttLoadSettingObjs[dbLoadObj.mcsId] = dbLoadObj;
        this.emitChange(MqttLoadConstants.EVENT_MQTT_LOAD_SETTINGS_CHANGED,dbLoadObj.mcsId);
        MqttLoadDbService.saveMqttLoadSettings(dbLoadObj);
    }

    deleteMqttLoadSettings(mcsId) {
        var dbLoadObj = this.mqttLoadSettingObjs[mcsId];
        if(dbLoadObj!=null) {
            //TO-DO delete instance data
            delete this.mqttLoadSettingObjs[mcsId];
            this.emitChange(MqttLoadConstants.EVENT_MQTT_LOAD_SETTINGS_CHANGED,mcsId);
            MqttLoadDbService.deleteMqttLoadSettingsById(mcsId);
        }
    }

    getAllMqttLoadSettings() { 
        return _.values(this.mqttLoadSettingObjs);
    }

    getMqttLoadSettingsByMcsId(mcsId) {
        return this.mqttLoadSettingObjs[mcsId];
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

    startMqttLoadTest(mcsId) { 
        var loadObj = this.getMqttLoadSettingsByMcsId(mcsId);
        if(loadObj!=null) {
            var instances = _.values(loadObj.instances);
            if(instances!=null && instances.length>0) {
                for(var i=0;i<instances.length;i++) {
                   MqttLoadDbService.deleteMqttLoadDataByInstanceId(instances[i].iId);
                }
            }
            loadObj.instances = {};
            for(var i=0;i<loadObj.instanceCount;i++) {
                var iId = UUID.v4();
                var startMessage = {status:MqttLoadConstants.STATE_IN_PROGRESS,message:MqttLoadConstants.LOAD_STARTED,time:+(new Date())};

                loadObj.instances[iId] = {  iId:iId,
                                            overallStatus:MqttLoadConstants.STATE_IN_PROGRESS,
                                            loadTestType:loadObj.loadTestType,
                                            testStartTime:+(new Date()),
                                            testEndTime:null,
                                            messCount:0,
                                            messageStartTime:null,
                                            messageEndTime:null,
                                            qosReceivedMessCount:0,
                                            qosStartTime:null,
                                            qosEndTime:null,
                                            instanceNumber:(i+1),
                                            messages:[startMessage]
                                         };
                PlatformDispatcherService.dispatcherAction({actionType: MqttLoadConstants.ACTION_START_MQTT_LOAD_TEST,data:{loadObj:loadObj,iId:iId,inum:(i+1)}},CommonConstants.SERVICE_TYPE_MQTT_LOAD);
            }

            this.mqttLoadSettingObjs[loadObj.mcsId] = loadObj;
            this.emitChange(MqttLoadConstants.EVENT_MQTT_LOAD_SETTINGS_CHANGED,loadObj.mcsId);
        }
    }

    stopMqttLoadTest(mcsId) { 
        var loadObj = this.getMqttLoadSettingsByMcsId(mcsId);
        if(loadObj!=null) {
            var instances = _.values(loadObj.instances);
            if(instances!=null && instances.length>0) {
                for(var i=0;i<instances.length;i++) {
                    var instanceObj= instances[i];
                    if(instanceObj!=null) {
                        instanceObj.overallStatus = MqttLoadConstants.STATE_STOPPED;
                        PlatformDispatcherService.dispatcherAction({actionType: MqttLoadConstants.ACTION_STOP_MQTT_LOAD_TEST,data:{iId:instanceObj.iId}},CommonConstants.SERVICE_TYPE_MQTT_LOAD);
                    }
                }
            }
            this.mqttLoadSettingObjs[loadObj.mcsId] = loadObj;
            this.emitChange(MqttLoadConstants.EVENT_MQTT_LOAD_SETTINGS_CHANGED,loadObj.mcsId);
            MqttLoadDbService.saveMqttLoadSettings(loadObj);
        }
    }

    updateStatusMessage(data) { 
        var mqttLoadSettingObj = this.mqttLoadSettingObjs[data.mcsId];
        if(mqttLoadSettingObj!=null) {
            var instanceObj = mqttLoadSettingObj.instances[data.iId];
            if(instanceObj!=null && instanceObj.messages!=null && instanceObj.messages.length>0) {
                if(data.fromState!=null && data.toState!=null) {
                    for(var i=0;i<instanceObj.messages.length;i++) {
                        if(instanceObj.messages[i].status == data.fromState) {
                            instanceObj.messages[i].status = data.toState;
                        }
                    }
                }
                instanceObj.messages.push(data.statusObj);
            }
            this.emitChange(MqttLoadConstants.EVENT_MQTT_LOAD_SETTINGS_CHANGED,data.mcsId);
        }
    }

    updateLoadTestMetadataAfterComplete(data) { 
        MqttLoadDbService.saveMqttLoadArchiveDataByIId(data.iId,data.archiveData);
        var mqttLoadSettingObj = this.mqttLoadSettingObjs[data.mcsId];
        if(mqttLoadSettingObj!=null) {
            var instanceObj = mqttLoadSettingObj.instances[data.iId];
            if(instanceObj!=null) {
                instanceObj.overallStatus = MqttLoadConstants.STATE_DONE;
                instanceObj.testEndTime = +(new Date());
                instanceObj.messCount =data.messCount;
                instanceObj.messageStartTime = data.messageStartTime;
                instanceObj.messageEndTime = data.messageEndTime;
                instanceObj.qosReceivedMessCount = data.qosReceivedMessCount;
                instanceObj.qosStartTime = data.qosStartTime;
                instanceObj.qosEndTime = data.qosEndTime;
                this.emitChange(MqttLoadConstants.EVENT_MQTT_LOAD_SETTINGS_CHANGED,data.mcsId);
            }
            MqttLoadDbService.saveMqttLoadSettings(mqttLoadSettingObj);
        }
    }

    processEvents(eventObj) { 
        switch(eventObj.event) {
            case MqttLoadConstants.EVENT_MQTT_LOAD_STATUS_MESSAGE:
                this.updateStatusMessage(eventObj.data);
                break;
            case MqttLoadConstants.EVENT_MQTT_LOAD_TEST_ENDED:
                this.updateLoadTestMetadataAfterComplete(eventObj.data);
                break;
            default:
        }
    }

    getMqttLoadDataByIIds(iIds) { 
        return MqttLoadDbService.getMqttLoadDataByIIds(iIds);
    }
}

export default new MqttLoadService();