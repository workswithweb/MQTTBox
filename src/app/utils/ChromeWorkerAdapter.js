import BrokerConnectionService from '../services/BrokerConnectionService';

class ChromeWorkerAdapter {

    constructor() {
        this.receiveFromWorker = this.receiveFromWorker.bind(this);
        this.postMessage = this.postMessage.bind(this);
        chrome.runtime.onMessage.addListener(this.receiveFromWorker);
    }

    postMessage(data) {
        chrome.runtime.sendMessage(data);
    }

    receiveFromWorker(data) {
        if(data.event!=null) {
            BrokerConnectionService.workerMessageListener(data);
        }
    }

}

export default new ChromeWorkerAdapter();