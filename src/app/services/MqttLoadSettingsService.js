import Events from 'events';
import _ from 'lodash';
import UUID from 'node-uuid';

import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../utils/AppConstants';

class MqttLoadSettingsService extends Events.EventEmitter {

    constructor() {
        super();
        this.dbWorker = new Worker('./js/MqttLoadSettingsDbWorker.js');
        this.mqttLoadResultsDbWorker = new Worker('./js/MqttLoadResultsDbWorker.js');
        this.mqttLoadSettingObjs = {};
        this.loadTestInstances = {};

        this.registerToAppDispatcher = this.registerToAppDispatcher.bind(this);
        this.workerMessageListener = this.workerMessageListener.bind(this);
        this.syncMqttLoadSettingsCache = this.syncMqttLoadSettingsCache.bind(this);
        this.saveMqttLoadSettings = this.saveMqttLoadSettings.bind(this);
        this.getAllMqttLoadSettingsData = this.getAllMqttLoadSettingsData.bind(this);
        this.getMqttLoadSettingsDataByBsId = this.getMqttLoadSettingsDataByBsId.bind(this);
        this.startLoadTest = this.startLoadTest.bind(this);
        this.endLoadTest = this.endLoadTest.bind(this);

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
                    this.startLoadTest(action.data);
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
            case AppConstants.WORKER_EVENT_LOAD_TEST_END:
                this.endLoadTest(data.payload);
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
            this.emitChange(AppConstants.EVENT_MQTT_LOAD_SETTINGS_CHANGED,false);
        }
    }

    startLoadTest(loadObj) { 
        this.mqttLoadResultsDbWorker.postMessage({cmd:AppConstants.WORKER_CMD_MULTI_DELETE,payload:loadObj.instanceIds});
        loadObj.instanceIds = [];
        for(var i=0;i<loadObj.instanceCount;i++) {
            loadObj.instanceIds.push(UUID.v4());
        }
        for(var i=0;i<loadObj.instanceIds.length;i++) {
            var loadTestInstance = new Worker('./js/MqttLoadTestWorker.js');
            this.loadTestInstances[loadObj.instanceIds[i]] =  loadTestInstance;
            loadTestInstance.addEventListener('message',this.workerMessageListener);
            loadTestInstance.postMessage({cmd:AppConstants.WORKER_CMD_START_LOAD_TEST,
                payload:{instanceId:loadObj.instanceIds[i],mqttLoadSettings:loadObj}});
        }

        this.saveMqttLoadSettings(loadObj);
    }

    endLoadTest(data) { 
        console.log('load test ended');
        var loadTestInstance = this.loadTestInstances[data.instanceId];
        loadTestInstance.terminate();
        delete this.loadTestInstances[data.instanceId];
        this.emitChange(AppConstants.EVENT_MQTT_LOAD_TEST_RESULT_CHANGED,data);
    }

    saveMqttLoadSettings(loadObj) { 
        var isNew = false;
        var dbLoadObj = this.mqttLoadSettingObjs[loadObj.bsId];
        if(dbLoadObj == null) {
            loadObj.createdOn = +(new Date());
            isNew = true;
        }

        loadObj.updatedOn = +(new Date());
        this.mqttLoadSettingObjs[loadObj.bsId] = loadObj;
        if(isNew==true) {
            this.emitChange(AppConstants.EVENT_MQTT_LOAD_SETTINGS_CHANGED,false);
        }
        this.dbWorker.postMessage({cmd:AppConstants.WORKER_CMD_SAVE,payload:loadObj});
    }

    deleteMqttLoadSettingsById(bsId) {
        delete this.mqttLoadSettingObjs[bsId];
        this.emitChange(AppConstants.EVENT_MQTT_LOAD_SETTINGS_CHANGED,true);
        this.dbWorker.postMessage({cmd:AppConstants.WORKER_CMD_DELETE,payload:{bsId:bsId}});
    }

    getAllMqttLoadSettingsData() {
        return _.values(this.mqttLoadSettingObjs);
    }

    getMqttLoadSettingsDataByBsId(bsId) {
        return this.mqttLoadSettingObjs[bsId];
    }

}
export default new MqttLoadSettingsService();