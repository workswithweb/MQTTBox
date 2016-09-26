import localforage from 'localforage';
import Q from 'q';
import _ from 'lodash';

class MqttLoadDbService {  

    constructor() {
        this.loadSettingsDb = localforage.createInstance({name:"MQTT_LOAD_SETTINGS",driver:localforage.INDEXEDDB});
        this.loadInstanceDataDb = localforage.createInstance({name:"MQTT_LOAD_INSTANCE_DATA",driver:localforage.INDEXEDDB});
    }

    saveMqttLoadSettings(obj) { 
        Q.invoke(this.loadSettingsDb,'setItem',obj.mcsId,obj).done();
    }

    getAllMqttLoadSettings() { 
        var me =this;
        var mqttLoadSettingsList = [];
        return Q.invoke(this.loadSettingsDb,'iterate',
            function(value, key, iterationNumber) {
                mqttLoadSettingsList.push(value);
            }
        ).then(function() {
            return _.sortBy(mqttLoadSettingsList, ['createdOn']);
        });
    }

    deleteMqttLoadSettingsById(mcsId) {
        return Q.invoke(this.loadSettingsDb,'removeItem',mcsId).done();
    }

    deleteMqttLoadDataByInstanceId(iId) {
        return Q.invoke(this.loadInstanceDataDb,'removeItem',iId).done();
    }

    getMqttLoadDataByIIds(iIds) {
        var mqttLoadData = [];
        var promises  = iIds.map(function(iId) {return this.loadInstanceDataDb.getItem(iId);}.bind(this));
        return Promise.all(promises);
    }

}

export default new MqttLoadDbService();