import Q from 'q';
import {Qlobber} from 'qlobber';
import _ from 'lodash';
import mqtt from 'mqtt';

import MqttClientConstants from '../utils/MqttClientConstants';
import PlatformMqttClientEventService from '../platform/PlatformMqttClientEventService';

class MqttClientConnectionWorker {  

    constructor() {
        this.mqttClientObj = null;
        this.client = null;
        this._matcher = new Qlobber({separator:'/',wildcard_one:'+',wildcard_some:'#'});
    }

    processAction(action) {
        switch(action.actionType) {
            case MqttClientConstants.ACTION_MQTT_CLIENT_CONNECT:
                this.connect(action.data);
                break;
            case MqttClientConstants.ACTION_MQTT_CLIENT_DISCONNECT:
                this.disConnect();
                break;
            case MqttClientConstants.ACTION_PUBLISH_MESSAGE:
                this.publishMessage(action.data.topic,action.data.payload,action.data.qos,action.data.retain);
                break;
            case MqttClientConstants.ACTION_SUBSCRIBE_TO_TOPIC:
                this.subscribeToTopic(action.data.topic,action.data.qos);
                break;
            case MqttClientConstants.ACTION_UN_SUBSCRIBE_TO_TOPIC:
                this.unSubscribeTopic(action.data.topic);
                break;
            default:
        }
    }

    connectToBroker() {
        if(this.mqttClientObj!=null && this.mqttClientObj.mcsId!=null) {

            this.client = mqtt.connect(this.mqttClientObj.protocol+'://'+this.mqttClientObj.host,this.getConnectOptions());

            this.client.on('connect', function () {
                this.publishClientConnectionStatus(MqttClientConstants.CONNECTION_STATE_CONNECTED);
            }.bind(this));

            this.client.on('close', function () {
                this.publishClientConnectionStatus(MqttClientConstants.CONNECTION_STATE_ERROR);
            }.bind(this));

            this.client.on('offline', function () {
                this.publishClientConnectionStatus(MqttClientConstants.CONNECTION_STATE_ERROR);
            }.bind(this));

            this.client.on('error', function (err) {
                this.publishClientConnectionStatus(MqttClientConstants.CONNECTION_STATE_ERROR);
            }.bind(this));

            this.client.on('message', function (topic, message,packet) {
                var topics = _.uniq(this._matcher.match(topic));
                if(message!=null && topics!=null && topics.length>0) {
                    for(var i=0;i<topics.length;i++) {
                        PlatformMqttClientEventService.processEvent({event:MqttClientConstants.EVENT_MQTT_CLIENT_SUBSCRIBED_DATA_RECIEVED,
                            data:{mcsId:this.mqttClientObj.mcsId,topic:topics[i],
                            message:message.toString(),packet:packet}});
                    }
                }
            }.bind(this));
        }
    }

    publishClientConnectionStatus(connState) {
        PlatformMqttClientEventService.processEvent({event:MqttClientConstants.EVENT_MQTT_CLIENT_CONN_STATE_CHANGED, data:{mcsId:this.mqttClientObj.mcsId,connState:connState}});
    }

    getConnectOptions() {
        var clId = this.mqttClientObj.mqttClientId;
        if(this.mqttClientObj.timestampClientId == true) {
            clId = clId + (+new Date());
        }

        var options = {
            protocolId:this.mqttClientObj.protocolId,
            protocolVersion:this.mqttClientObj.protocolVersion,
            keepalive:Number(this.mqttClientObj.keepalive),
            reschedulePings:this.mqttClientObj.reschedulePings,
            clientId:clId,
            clean:this.mqttClientObj.clean,
            reconnectPeriod:Number(this.mqttClientObj.reconnectPeriod),
            connectTimeout:Number(this.mqttClientObj.connectTimeout),
            queueQoSZero:this.mqttClientObj.queueQoSZero
        };

        if(this.mqttClientObj.username!=null && this.mqttClientObj.username.trim().length>0) {
            options['username']=this.mqttClientObj.username;
        }
        if(this.mqttClientObj.password!=null && this.mqttClientObj.password.trim().length>0) {
            options['password']=this.mqttClientObj.password;
        }

        if(this.mqttClientObj.willTopic!=null && this.mqttClientObj.willTopic.length>0 && this.mqttClientObj.willPayload!=null) {
            options['will']= {
                topic:this.mqttClientObj.willTopic,
                payload:this.mqttClientObj.willPayload,
                qos:this.mqttClientObj.willQos,
                retain:this.mqttClientObj.willRetain
            }
        }
        return options;
    }

    connect(newMqttClient) {
        this.mqttClientObj = newMqttClient;
        if(this.client!=null) {
            Q.invoke(this.client,'end',true)
            .then(function() {
                this.connectToBroker();
            }.bind(this));
        } else {
            this.connectToBroker();
        }
    }

    disConnect() {
        if(this.client!=null) {
            Q.invoke(this.client,'end',true)
            .then(function() {
                PlatformMqttClientEventService.processEvent({event:MqttClientConstants.EVENT_MQTT_CLIENT_CONNECTION_CLOSED, data:{mcsId:this.mqttClientObj.mcsId}});
            }.bind(this));
        } else {
            PlatformMqttClientEventService.processEvent({event:MqttClientConstants.EVENT_MQTT_CLIENT_CONNECTION_CLOSED, data:{mcsId:this.mqttClientObj.mcsId}});
        }
    }

    publishMessage(topic,payload,qos,retain) {
        if(topic!=null && topic.trim().length>0) {
            this.client.publish(topic,payload,{qos:parseInt(qos),retain:retain});
        }
    }

    subscribeToTopic(topic,qos) {
        if(topic!=null && topic.trim().length>0) {
            this.client.subscribe(topic,{qos:parseInt(qos)});
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

export default new MqttClientConnectionWorker();