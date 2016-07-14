import BrokerConnectionService from '../services/BrokerConnectionService';
import AppConstants from './AppConstants';

class WorkerAdapter {

    constructor() {
        this.receiveFromWorker = this.receiveFromWorker.bind(this);
        this.postMessage = this.postMessage.bind(this);
        this.connWorker = {};
        //depends on app type
        if(AppConstants.isChromeApp()) {
            chrome.runtime.onMessage.addListener(this.receiveFromWorker);
        } else {
            this.connWorker = new Worker('./js/ConnectionWorker.js');
            this.connWorker.addEventListener('message',function(event){
                this.receiveFromWorker(event.data);
            }.bind(this));
        }
    }

    postMessage(data) {
        //depends on app type
        if(AppConstants.isChromeApp()) {
            chrome.runtime.sendMessage(data);
        } else {
            this.connWorker.postMessage(data);
        }
    }

    receiveFromWorker(data) {
        if(data.event!=null) {
            BrokerConnectionService.workerMessageListener(data);
        }
    }
}

export default new WorkerAdapter();