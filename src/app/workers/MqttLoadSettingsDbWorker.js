import localforage from 'localforage';
import Q from 'q';
import _ from 'lodash';

import AppConstants from '../utils/AppConstants';

class MqttLoadSettingsDbWorker {  

    constructor() {
        this.db = localforage.createInstance({name:"mqttLoadSettings",driver:localforage.INDEXEDDB});

        this.workerMessageListener = this.workerMessageListener.bind(this);
        this.saveMqttLoadSettings = this.saveMqttLoadSettings.bind(this);
        this.getAllMqttLoadSettings = this.getAllMqttLoadSettings.bind(this);
        this.deleteMqttLoadSettingsById = this.deleteMqttLoadSettingsById.bind(this);
        self.addEventListener('message',this.workerMessageListener,false);
    }

    workerMessageListener(event) {
        var data = event.data;
        switch(data.cmd) {
            case AppConstants.WORKER_CMD_SAVE:
                this.saveMqttLoadSettings(data.payload);
                break;
            case AppConstants.WORKER_CMD_GET_ALL:
                this.getAllMqttLoadSettings();
                break;
            case AppConstants.WORKER_CMD_DELETE:
                this.deleteMqttLoadSettingsById(data.payload.bsId);
                break;
            default:
                break;
        }
    }

    saveMqttLoadSettings(mqttLoadSettingsObj) { 
        Q.invoke(this.db,'setItem',mqttLoadSettingsObj.bsId,mqttLoadSettingsObj).done();
    }

    getAllMqttLoadSettings() { 
        var me =this;
        var mqttLoadSettingsList = [];
        return Q.invoke(this.db,'iterate',
            function(value, key, iterationNumber) {
                mqttLoadSettingsList.push(value);
            }
        ).then(function() {
            postMessage({event:AppConstants.WORKER_EVENT_ALL_MQTT_LOAD_DATA,
                         payload:_.sortBy(mqttLoadSettingsList, ['createdOn'])
                        });
        }.bind(this));
    }

    deleteMqttLoadSettingsById(bsId) {
        return Q.invoke(this.db,'removeItem',bsId).done();
    }
}

export default new MqttLoadSettingsDbWorker();
