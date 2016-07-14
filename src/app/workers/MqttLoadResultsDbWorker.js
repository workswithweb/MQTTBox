import localforage from 'localforage';
import Q from 'q';

import AppConstants from '../utils/AppConstants';

class MqttLoadResultsDbWorker {  

    constructor() {
        this.db = localforage.createInstance({name:"mqttLoadResults",driver:localforage.INDEXEDDB});

        this.workerMessageListener = this.workerMessageListener.bind(this);
        this.multiDeleteMqttLoadResults = this.multiDeleteMqttLoadResults.bind(this);
        self.addEventListener('message',this.workerMessageListener,false);
    }

    workerMessageListener(event) {
        var data = event.data;
        switch(data.cmd) {
            case AppConstants.WORKER_CMD_MULTI_DELETE:
                this.multiDeleteMqttLoadResults(data.payload);
                break;
            default:
                break;
        }
    }

    multiDeleteMqttLoadResults(ids) {
        for(var i=0;i<ids.length;i++) {
            Q.invoke(this.db,'removeItem',ids[i]).done();
        }
    }
}

export default new MqttLoadResultsDbWorker();