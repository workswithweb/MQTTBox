import AppConstants from '../utils/AppConstants';
import BrokerConnWorker from './BrokerConnWorker';

class ChromeConnectionWorker {

    constructor() {
        this.brokerList = {};
        this.cmdListener = this.cmdListener.bind(this);
        this.workerEventListener = this.workerEventListener.bind(this);
        this.reconnectBroker = this.reconnectBroker.bind(this);
        this.sendWorkerCommand = this.sendWorkerCommand.bind(this);
        chrome.runtime.onMessage.addListener(this.cmdListener);
    }

    cmdListener(request, sender, sendResponse) {
        if(request.cmd!=null) {
            switch(request.cmd) {
                case AppConstants.WORKER_CMD_BROKER_RECONNECT:
                    this.reconnectBroker(request);
                    break;
                case AppConstants.WORKER_CMD_BROKER_PUBLISH_MESSAGE:
                    this.sendWorkerCommand(request.payload.bsId,request);
                    break;
                case AppConstants.WORKER_CMD_BROKER_END_CONNECTION:
                    this.sendWorkerCommand(request.payload.bsId,request);
                    break;
                case AppConstants.WORKER_CMD_SUBSCRIBE_TO_TOPIC:
                    this.sendWorkerCommand(request.payload.bsId,request);
                    break;
                case AppConstants.WORKER_CMD_UN_SUBSCRIBE_TO_TOPIC:
                    this.sendWorkerCommand(request.payload.bsId,request);
                    break;
                default:
            }
        }
    }

    workerEventListener(data) {
        if(data.event!=null) {
            if(data.event==AppConstants.WORKER_EVENT_BROKER_CONNECTION_ENDED) {
                delete this.brokerList[data.payload.bsId];
            } else {
                chrome.runtime.sendMessage(data);
            }
        }
    }

    reconnectBroker(data) {
        var bsObj = data.payload.bsObj;
        var connWorker = this.brokerList[bsObj.bsId];

        if(connWorker==null) {
            connWorker = new BrokerConnWorker();
            connWorker.addChangeListener(AppConstants.WORKER_EVENT_DATA,this.workerEventListener);
            this.brokerList[bsObj.bsId] = connWorker;
        }
        this.sendWorkerCommand(bsObj.bsId,data);
    }

    sendWorkerCommand(bsId,data) {
        var connWorker = this.brokerList[bsId];
        if(connWorker!=null) {
            connWorker.workerCmdListener(data);
        }
    }
}

export default new ChromeConnectionWorker();