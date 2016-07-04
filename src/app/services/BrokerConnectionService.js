import Events from 'events';

import AppConstants from '../utils/AppConstants';
import AppDispatcher from '../dispatcher/AppDispatcher';
import WorkerAdapter from '../utils/ChromeWorkerAdapter';

class BrokerConnectionService extends Events.EventEmitter {

    constructor() {
        super();
        this.publishedMessages = {};
        this.subscribedData = {};
        this.brokerMetaData = {};

        this.workerMessageListener = this.workerMessageListener.bind(this);
        this.syncBrokerStatus = this.syncBrokerStatus.bind(this);
        this.connectBroker = this.connectBroker.bind(this);
        this.publishMessage = this.publishMessage.bind(this);
        this.getPublishedMessages = this.getPublishedMessages.bind(this);
        this.subscribeToTopic = this.subscribeToTopic.bind(this);
        this.getBrokerMetaData = this.getBrokerMetaData.bind(this);
        this.clearPublishedMessages = this.clearPublishedMessages.bind(this);
        this.stopConnectionWorker = this.stopConnectionWorker.bind(this);
        this.updateSubscribedMessagesFromWorker = this.updateSubscribedMessagesFromWorker.bind(this);
        this.getBrokerState = this.getBrokerState.bind(this);
        this.clearSubscriberDataByBsId = this.clearSubscriberDataByBsId.bind(this);

        this.registerToAppDispatcher();
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
                case AppConstants.ACTION_PUBLISH_MESSAGE_TO_TOPIC:
                    this.publishMessage(action.data);
                    break;
                case AppConstants.ACTION_SUBSCRIBE_TO_TOPIC:
                    this.subscribeToTopic(action.data);
                    break;
                case AppConstants.ACTION_UN_SUBSCRIBE_TO_TOPIC:
                    this.unSubscribeToTopic(action.data,true);
                    break;
                default:
            }
        }.bind(this));
    }

    workerMessageListener(data) { 
        switch(data.event) {
            case AppConstants.WORKER_EVENT_BROKER_CONNECTION_STATE:
                this.syncBrokerStatus(data.payload);
                break;
            case AppConstants.WORKER_EVENT_MESSAGE_RECEIVED_FOR_TOPIC:
                this.updateSubscribedMessagesFromWorker(data.payload);
                break;
            default:
        }
    }

    syncBrokerStatus(data) {
        var metaData = this.brokerMetaData[data.bsId];
        if(metaData==null) {
            metaData = {};
        }

        if(metaData.connState!=data.connState) {
            metaData.connState = data.connState;
            this.brokerMetaData[data.bsId] = metaData;
            this.emitChange(AppConstants.EVENT_BROKER_SETTINGS_CHANGED,data.bsId);
            this.clearSubscriberDataByBsId(data.bsId,true);
        }
    }

    getBrokerMetaData(bsId) {
        var metaData = this.brokerMetaData[bsId];
        if(metaData==null) {
            metaData = {connState:AppConstants.OFFLINE};
        }
        return metaData;
    }

    getBrokerState(bsId) {
        var metaData = this.brokerMetaData[bsId];
        var state = AppConstants.OFFLINE;
        if(metaData!=null && metaData.connState!=null) {
            state = metaData.connState;
        }
        return state;
    }

    connectBroker(bsObj) {
        this.clearSubscriberDataByBsId(bsObj.bsId);
        delete this.brokerMetaData[bsObj.bsId];
        WorkerAdapter.postMessage({cmd:AppConstants.WORKER_CMD_BROKER_RECONNECT,payload:{bsObj:bsObj}});
    }

    publishMessage(data) {
        WorkerAdapter.postMessage({cmd:AppConstants.WORKER_CMD_BROKER_PUBLISH_MESSAGE,payload:data});
        var publishedMess = this.publishedMessages[data.bsId+data.pubId];
        if(publishedMess==null) {
            publishedMess = [];
        }
        publishedMess.push({topic:data.topic,payload:data.payload,qos:data.options.qos,retain:data.options.retain});
        if(publishedMess.length>10) {
            publishedMess.shift();
        }
        this.publishedMessages[data.bsId+data.pubId] = publishedMess;
    }

    stopConnectionWorker(bsId) {
        WorkerAdapter.postMessage({cmd:AppConstants.WORKER_CMD_BROKER_END_CONNECTION,payload:{bsId:bsId}});
        for (var key in this.publishedMessages) {
            if(key.startsWith(bsId)) {
                delete this.publishedMessages[key];
            }
        }
        this.clearSubscriberDataByBsId(bsId);
        delete this.brokerMetaData[bsId];
    }

    clearPublishedMessages(bsId,pubId) {
        delete this.publishedMessages[bsId+pubId];
    }

    clearSubscriberDataByBsId(bsId,unsubFromBroker) {
       for (var key in this.subscribedData) {
           if(key.startsWith(bsId)) {
               var d = this.subscribedData[key];
               this.unSubscribeToTopic({bsId:bsId,subId:d.subId,topic:d.topic},unsubFromBroker);
           }
       }
    }

    getPublishedMessages(bsId,pubId) {
        var pubMess = this.publishedMessages[bsId+pubId];
        if(pubMess==null || pubMess.length<0) {
            pubMess = [];
        }
        return pubMess;
    }

    subscribeToTopic(data) {
        WorkerAdapter.postMessage({cmd:AppConstants.WORKER_CMD_SUBSCRIBE_TO_TOPIC,payload:data});
        var subData = this.subscribedData[data.bsId+data.subId];
        if(subData==null) {
            subData = {bsId:data.bsId,subId:data.subId,isSubscribed:true,topic:data.topic,receivedMessages:[]};
        }
        this.subscribedData[data.bsId+data.subId] = subData;
        this.emitChange(AppConstants.EVENT_SUBSCRIBER_DATA,{bsId:data.bsId,subId:data.subId});
    }

    unSubscribeToTopic(data,unsubFromBroker) {
        delete this.subscribedData[data.bsId+data.subId];
        if(unsubFromBroker) {
            WorkerAdapter.postMessage({cmd:AppConstants.WORKER_CMD_UN_SUBSCRIBE_TO_TOPIC,payload:data});
            this.emitChange(AppConstants.EVENT_SUBSCRIBER_DATA,{bsId:data.bsId,subId:data.subId});
        }
    }

    updateSubscribedMessagesFromWorker(data) {
        _.forOwn(this.subscribedData, function(subData, key) {
            if(subData!=null && subData.topic == data.topic && subData.bsId == data.bsId) {
                if(subData.receivedMessages == null) {
                    subData.receivedMessages = [];
                }
                subData.receivedMessages.push({message:data.message,packet:data.packet});
                if(subData.receivedMessages.length>20) {
                    subData.receivedMessages.shift();
                }
                this.emitChange(AppConstants.EVENT_SUBSCRIBER_DATA,{bsId:subData.bsId,subId:subData.subId});
            }
        }.bind(this));
    }

    getSubscriberData(bsId,subId) {
        var subObj = this.subscribedData[bsId+subId];
        if(subObj==null) {
            return {isSubscribed:false,receivedMessages:[]};
        } else {
            return {isSubscribed:subObj.isSubscribed,receivedMessages:subObj.receivedMessages};
        }
    }
}

export default new BrokerConnectionService();
