import localforage from 'localforage';
import Q from 'q';
import _ from 'lodash';

import AppConstants from '../utils/AppConstants';

class BrokerSettingsDbWorker {  

    constructor() {
        this.db = localforage.createInstance({name:"brokerSettings",driver:localforage.INDEXEDDB});

        this.workerMessageListener = this.workerMessageListener.bind(this);
        this.saveBrokerSettings = this.saveBrokerSettings.bind(this);
        this.getAllBrokerSettings = this.getAllBrokerSettings.bind(this);
        self.addEventListener('message',this.workerMessageListener,false);
    }

    workerMessageListener(event) {
        var data = event.data;
        switch(data.cmd) {
            case AppConstants.WORKER_CMD_SAVE:
                this.saveBrokerSettings(data.payload);
                break;
            case AppConstants.WORKER_CMD_GET_ALL:
                this.getAllBrokerSettings();
                break;
            case AppConstants.WORKER_CMD_DELETE:
                this.deleteBrokerSettingsById(data.payload.bsId);
                break;
            default:
                break;
        }
    }

    saveBrokerSettings(brokerObj) { 
        Q.invoke(this.db,'setItem',brokerObj.bsId,brokerObj).done();
    }

    getAllBrokerSettings() { 
        var me =this;
        var brokerSettingsList = [];
        return Q.invoke(this.db,'iterate',
            function(value, key, iterationNumber) {
                brokerSettingsList.push(value);
            }
        ).then(function() {
            postMessage({event:AppConstants.WORKER_EVENT_ALL_BROKER_SETTINGS_DATA,
                         payload:_.sortBy(brokerSettingsList, ['createdOn'])
                        });
        }.bind(this));
    }

    deleteBrokerSettingsById(bsId) {
        return Q.invoke(this.db,'removeItem',bsId).done();
    }
}

export default new BrokerSettingsDbWorker();
