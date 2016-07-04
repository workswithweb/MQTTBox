import AppConstants from '../utils/AppConstants';
import ClientConnection from './ClientConnection';

class ConnectionWorker {

    constructor() {
        this.brokerList = {};
        this.cmdListener = this.cmdListener.bind(this);
        this.workerEventListener = this.workerEventListener.bind(this);
        this.reconnectBroker = this.reconnectBroker.bind(this);
        this.sendWorkerCommand = this.sendWorkerCommand.bind(this);
        //depends on app type
        if(AppConstants.isChromeApp()) {
            chrome.runtime.onMessage.addListener(this.cmdListener);
        } else {
            self.addEventListener('message',function(event){
                this.cmdListener(event.data);
            }.bind(this),false);
        }
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
                //depends on app type
                if(AppConstants.isChromeApp()) {
                    chrome.runtime.sendMessage(data);
                } else {
                    postMessage(data);
                }
            }
        }
    }

    reconnectBroker(data) {
        var bsObj = data.payload.bsObj;
        var clientConnection = this.brokerList[bsObj.bsId];

        if(clientConnection==null) {
            clientConnection = new ClientConnection();
            clientConnection.addChangeListener(AppConstants.WORKER_EVENT_DATA,this.workerEventListener);
            this.brokerList[bsObj.bsId] = clientConnection;
        }
        this.sendWorkerCommand(bsObj.bsId,data);
    }

    sendWorkerCommand(bsId,data) {
        var clientConnection = this.brokerList[bsId];
        if(clientConnection!=null) {
            clientConnection.workerCmdListener(data);
        }
    }
}

export default new ConnectionWorker();