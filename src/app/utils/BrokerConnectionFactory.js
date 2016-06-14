import Events from 'events';
import Q from 'q';

import AppConstants from './AppConstants';

class BrokerConnectionFactory extends Events.EventEmitter {

    constructor(brokerSettings) {
        super();
        this.brokerSettings = brokerSettings;
        this.client = null;
        this.connState = AppConstants.CLOSE;
        this.publishedMessages = {};
        this.subscriberData = {};
        this.subscribedMessages = {};

        this.emitChange = this.emitChange.bind(this);
        this.addChangeListener = this.addChangeListener.bind(this);
        this.removeChangeListener = this.removeChangeListener.bind(this);
        this.unSubscribeFromAllTopics = this.unSubscribeFromAllTopics.bind(this);

        this.connect = this.connect.bind(this);
        this.getConnectOptions = this.getConnectOptions.bind(this);
        this.reconnectBroker = this.reconnectBroker.bind(this);
        this.endConnection = this.endConnection.bind(this);
        this.publishMessage = this.publishMessage.bind(this);
        this.subscribeToTopic = this.subscribeToTopic.bind(this);
        this.unSubscribeTopic = this.unSubscribeTopic.bind(this);
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

    connect() {
        if(this.brokerSettings!=null && this.brokerSettings.bsId!=null) {
            this.client = mqtt.connect(this.brokerSettings.protocol+'://'+this.brokerSettings.host,this.getConnectOptions());

            this.client.on('connect', function () {
                this.connState = AppConstants.ONLINE;
                this.emitChange(AppConstants.EVENT_BROKER_CONNECTION_STATE_CHANGED,{bsId:this.brokerSettings.bsId,status:AppConstants.ONLINE});
            }.bind(this));

            this.client.on('close', function () {
                this.unSubscribeFromAllTopics(AppConstants.CLOSE);
            }.bind(this));

            this.client.on('offline', function () {
                this.unSubscribeFromAllTopics(AppConstants.OFFLINE);
            }.bind(this));

            this.client.on('error', function (err) {
                this.unSubscribeFromAllTopics(AppConstants.ERROR);
            }.bind(this));

            this.client.on('message', function (topic, message,packet) {
                if(message!=null) {
                    var mess = this.subscribedMessages[topic];
                    if(mess == null) {
                        mess = [];
                    }
                    mess.push({message:message.toString(),packet:packet});
                    if(mess.length>50) {
                        mess.shift();
                    }
                    this.subscribedMessages[topic] = mess;
                    this.emitChange(AppConstants.EVENT_MESSAGE_RECEIVED,{bsId:this.brokerSettings.bsId,topic:topic});
                }

            }.bind(this));
        }
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

    unSubscribeFromAllTopics(status) {
        this.connState = status;
        var publishAllData = false;
        this.subscribedMessages = {};
        _.forOwn(this.subscriberData, function(value, key) {
            if(value!=null) {
                this.client.unsubscribe(value.topic);
                value.isSubscribed=false;
                publishAllData = true;
            }
        }.bind(this));
        this.emitChange(AppConstants.EVENT_BROKER_CONNECTION_STATE_CHANGED,{bsId:this.brokerSettings.bsId,status:status,publishAllData:publishAllData});
    }

    reconnectBroker(newBrokerSettings) {
        this.unSubscribeFromAllTopics(AppConstants.CLOSE);
        Q.invoke(this.client,'end',true)
        .then(function() {
            this.brokerSettings = newBrokerSettings;
            this.connect();
        }.bind(this));
    }

    endConnection() {
        return Q.invoke(this.client,'end',true);
    }

    publishMessage(pubId,topic,message,options) {
        if(topic!=null && topic.trim().length>0) {
            this.client.publish(topic,message,options);

            var pubMess = this.publishedMessages[pubId];
            if(pubMess==null) {
                pubMess = [];
            }
            pubMess.push({topic:topic,payload:message,qos:options.qos,retain:options.retain});
            if(pubMess.length>10) {
                pubMess.shift();
            }
            this.publishedMessages[pubId] = pubMess;
        }
    }

    subscribeToTopic(subId,topic,options) {
        if(topic!=null && topic.trim().length>0) {
            this.client.subscribe(topic,options);
            var subData = {};
            subData['isSubscribed'] = true;
            subData['subId'] = subId;
            subData['topic'] = topic;
            this.subscriberData[subId] = subData;
        }
    }

    unSubscribeTopic(subId,topic) {
        if(topic!=null && topic.trim().length>0) {
            this.client.unsubscribe(topic);
            delete this.subscriberData[subId];
            delete this.subscribedMessages[topic];
        }
    }
}

export default BrokerConnectionFactory;
