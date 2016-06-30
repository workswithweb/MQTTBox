import {Qlobber} from 'qlobber';
import mqtt from 'mqtt';
import Q from 'q';

import AppConstants from '../utils/AppConstants';

class BrokerConnWorker {  

    constructor() {
        this._matcher = new Qlobber({separator:'/',wildcard_one:'+',wildcard_some:'#'});
        this.brokerSettings = null;
        this.client = null;
        this.workerMessageListener = this.workerMessageListener.bind(this);
        this.connect = this.connect.bind(this);
        this.getConnectOptions = this.getConnectOptions.bind(this);
        this.reconnectBroker = this.reconnectBroker.bind(this);
        this.endConnection = this.endConnection.bind(this);
        this.publishMessage = this.publishMessage.bind(this);
        this.subscribeToTopic = this.subscribeToTopic.bind(this);
        this.unSubscribeTopic = this.unSubscribeTopic.bind(this);
        this.publishBrokerStatus = this.publishBrokerStatus.bind(this);
        self.addEventListener('message',this.workerMessageListener,false);
    }

    workerMessageListener(event) {
        var data = event.data;
        switch(data.cmd) {
            case AppConstants.WORKER_CMD_BROKER_RECONNECT:
                this.reconnectBroker(data.payload.bsObj);
                break;
            case AppConstants.WORKER_CMD_BROKER_END_CONNECTION:
                this.endConnection();
                break;
            case AppConstants.WORKER_CMD_BROKER_PUBLISH_MESSAGE:
                this.publishMessage(data.payload.topic,data.payload.payload,data.payload.options);
                break;
            case AppConstants.WORKER_CMD_SUBSCRIBE_TO_TOPIC:
                this.subscribeToTopic(data.payload.topic,data.payload.options);
                break;
            case AppConstants.WORKER_CMD_UN_SUBSCRIBE_TO_TOPIC:
                this.unSubscribeTopic(data.payload.topic);
                break;
            default:
                break;
        }
    }

    connect() {
        if(this.brokerSettings!=null && this.brokerSettings.bsId!=null) {
            this.client = mqtt.connect(this.brokerSettings.protocol+'://'+this.brokerSettings.host,this.getConnectOptions());

            this.client.on('connect', function () {
                this.publishBrokerStatus(AppConstants.ONLINE);
            }.bind(this));

            this.client.on('close', function () {
                this.publishBrokerStatus(AppConstants.OFFLINE);
            }.bind(this));

            this.client.on('offline', function () {
                this.publishBrokerStatus(AppConstants.OFFLINE);
            }.bind(this));

            this.client.on('error', function (err) {
                this.publishBrokerStatus(AppConstants.OFFLINE);
            }.bind(this));

            this.client.on('message', function (topic, message,packet) {
                var topics = this._matcher.match(topic);
                if(message!=null && topics!=null && topics.length>0) {
                    for(var i=0;i<topics.length;i++) {
                        postMessage({event:AppConstants.WORKER_EVENT_MESSAGE_RECEIVED_FOR_TOPIC,
                        payload:{bsId:this.brokerSettings.bsId,topic:topics[i],message:message.toString(),packet:packet}});
                    }
                }
            }.bind(this));
        }
    }

    publishBrokerStatus(connState) {
        postMessage({event:AppConstants.WORKER_EVENT_BROKER_CONNECTION_STATE,
            payload:{connState:connState,bsId:this.brokerSettings.bsId}});
    }

    getConnectOptions() {
        var options = {
            keepalive:Number(this.brokerSettings.keepalive),
            reschedulePings:this.brokerSettings.reschedulePings,
            clientId:this.brokerSettings.clientId,
            protocolId:this.brokerSettings.protocolId,
            protocolVersion:this.brokerSettings.protocolVersion,
            clean:this.brokerSettings.clean,
            reconnectPeriod:Number(this.brokerSettings.reconnectPeriod),
            connectTimeout:Number(this.brokerSettings.connectTimeout)
        };
        if(this.brokerSettings.username!=null && this.brokerSettings.username.trim().length>0) {
            options['username']=this.brokerSettings.username;
        }
        if(this.brokerSettings.password!=null && this.brokerSettings.password.trim().length>0) {
            options['password']=this.brokerSettings.password;
        }
        if(this.brokerSettings.willTopic!=null && this.brokerSettings.willTopic.length>0 && this.brokerSettings.willPayload!=null) {
            options['will']= {
                topic:this.brokerSettings.willTopic,
                payload:this.brokerSettings.willPayload,
                qos:this.brokerSettings.willQos,
                retain:this.brokerSettings.willRetain
            }
        }
        return options;
    }

    reconnectBroker(newBrokerSettings) {
        this.brokerSettings = newBrokerSettings;
        if(this.client!=null) {
            Q.invoke(this.client,'end',true)
            .then(function() {
                this.connect();
            }.bind(this));
        } else {
            this.connect();
        }
    }

    endConnection() {
        return this.client.end(true);
        self.close();
    }

    publishMessage(topic,payload,options) {
        //add validation for invalid topics with # and + etc
        if(topic!=null && topic.trim().length>0) {
            this.client.publish(topic,payload,options);
        }
    }

    subscribeToTopic(topic,options) {
        if(topic!=null && topic.trim().length>0) {
            this.client.subscribe(topic,options);
            this._matcher.add(topic,topic);
        }
    }

    unSubscribeTopic(topic) {
        if(topic!=null && topic.trim().length>0) {
            this.client.unsubscribe(topic);
            this._matcher.remove(topic);
        }
    }

}
export default new BrokerConnWorker();
