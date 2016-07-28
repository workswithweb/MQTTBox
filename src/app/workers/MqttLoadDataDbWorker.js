import localforage from 'localforage';

import MqttLoadConstants from '../utils/MqttLoadConstants';
import AppConstants from '../utils/AppConstants';

class MqttLoadDataDbWorker {  

    constructor() {
        this.db = localforage.createInstance({name:MqttLoadConstants.DB_MQTT_LOAD_DATA,driver:localforage.INDEXEDDB});

        this.workerMessageListener = this.workerMessageListener.bind(this);
        this.deleteLoadDataByIids = this.deleteLoadDataByIids.bind(this);
        self.addEventListener('message',this.workerMessageListener,false);
    }

    workerMessageListener(event) {
        var data = event.data;
        switch(data.cmd) {
            case AppConstants.WORKER_CMD_DELETE:
                this.deleteLoadDataByIids(data.payload);
                break;
            default:
                break;
        }
    }

    deleteLoadDataByIids(iIds) {
        for(var i=0;i<iIds.length;i++) {
            this.db.removeItem(iIds[i]);
        }
    }
}

export default new MqttLoadDataDbWorker();