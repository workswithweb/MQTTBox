import localforage from 'localforage';
import Q from 'q';
import _ from 'lodash';
import mqtt from 'mqtt';

import MqttLoadConstants from '../utils/MqttLoadConstants';
import PlatformMqttLoadEventService from '../platform/PlatformMqttLoadEventService';

class MqttLoadTestWorker {  

    constructor() {
        this.loadInstanceDb = localforage.createInstance({name:"MQTT_LOAD_INSTANCE_DATA",driver:localforage.INDEXEDDB});
        this.loadObj = null;
        this.iId = null;
        this.inum = null;
        this.client = null;

        this.messageStartTime = null;
        this.messageEndTime = null;
        this.messCount = 0;

        this.qosStartTime = null;
        this.qosEndTime = null;
        this.qosReceivedMessCount = 0;

        this.publishTimeKeeper = null;
        this.payloadCounter = -1;
        this.receivedMessages = [];

        this.runTimeKeeper = null;

    }

    processAction(action) {
        switch(action.actionType) {
            case MqttLoadConstants.ACTION_START_MQTT_LOAD_TEST:
                this.startLoadTest(action.data);
                break;
            case MqttLoadConstants.ACTION_STOP_MQTT_LOAD_TEST:
                this.endLoadTest(MqttLoadConstants.STATE_ERROR,MqttLoadConstants.LOAD_STOPPED);
                break;
            default:
        }
    }

    startRunTimer() {
        clearTimeout(this.runTimeKeeper);
        this.runTimeKeeper = setTimeout(function() {
            this.endLoadTest(MqttLoadConstants.STATE_ERROR,MqttLoadConstants.LOAD_TIME_OUT);
        }.bind(this),(this.loadObj.timeOut)*1000);
    }

    startLoadTest(data) {
        this.loadObj = data.loadObj;
        this.iId = data.iId;
        this.inum = data.inum;
        this.startRunTimer();
        this.publishStatusWithSuccess({status:MqttLoadConstants.STATE_IN_PROGRESS,message:MqttLoadConstants.LOAD_MQTT_CLIENT_CONNECTING,time:+(new Date())});

        if(this.loadObj!=null && this.loadObj.mcsId!=null) {
            this.client = mqtt.connect(this.loadObj.protocol+'://'+this.loadObj.host,this.getConnectOptions());

            this.client.on('connect', function () {
                this.publishStatusWithSuccess({status:MqttLoadConstants.STATE_SUCCESS,message:MqttLoadConstants.LOAD_MQTT_CLIENT_CONNECTED,time:+(new Date())});

                if(this.loadObj.loadTestType == MqttLoadConstants.TYPE_LOAD_TEST_PUBLISHING) {
                    this.startPublishLoad();
                } else if(this.loadObj.loadTestType == MqttLoadConstants.TYPE_LOAD_TEST_SUBSCRIBING) {
                    this.startSubscribeLoad();
                }
            }.bind(this));

            this.client.on('close', function () {
                if(this.messCount!=0 && this.messCount == this.qosReceivedMessCount) {
                    this.publishStatus({status:MqttLoadConstants.STATE_SUCCESS,message:MqttLoadConstants.LOAD_MQTT_CLIENT_CONNECTION_CLOSED,time:+(new Date())},MqttLoadConstants.STATE_IN_PROGRESS,MqttLoadConstants.STATE_SUCCESS);
                } else {
                    this.publishStatus({status:MqttLoadConstants.STATE_ERROR,message:MqttLoadConstants.LOAD_MQTT_CLIENT_CONNECTION_CLOSED,time:+(new Date())},MqttLoadConstants.STATE_IN_PROGRESS,MqttLoadConstants.STATE_ERROR);
                }
                clearInterval(this.publishTimeKeeper);
            }.bind(this));

            this.client.on('offline', function () {
                this.publishStatus({status:MqttLoadConstants.STATE_ERROR,message:MqttLoadConstants.LOAD_BROKER_CONNECTION_OFFLINE,time:+(new Date())},MqttLoadConstants.STATE_IN_PROGRESS,MqttLoadConstants.STATE_ERROR);
                clearInterval(this.publishTimeKeeper);
            }.bind(this));

            this.client.on('error', function (err) {
                this.publishStatus({status:MqttLoadConstants.STATE_ERROR,message:MqttLoadConstants.LOAD_BROKER_CONNECTION_ERROR,time:+(new Date())},MqttLoadConstants.STATE_IN_PROGRESS,MqttLoadConstants.STATE_ERROR);
                clearInterval(this.publishTimeKeeper);
            }.bind(this));

            this.client.on('message', function (topic, message,packet) {
                this.onSubscribedMessageReceived(topic, message,packet);
            }.bind(this));
        }
    }

    publishStatusWithSuccess(statusObj) {
        PlatformMqttLoadEventService.processEvent({event:MqttLoadConstants.EVENT_MQTT_LOAD_STATUS_MESSAGE,
                        data:{mcsId:this.loadObj.mcsId,iId:this.iId,statusObj:statusObj,
                        fromState:MqttLoadConstants.STATE_IN_PROGRESS,toState:MqttLoadConstants.STATE_SUCCESS}});
    }

    publishStatus(statusObj,fromState,toState) {
        PlatformMqttLoadEventService.processEvent({event:MqttLoadConstants.EVENT_MQTT_LOAD_STATUS_MESSAGE,
                        data:{mcsId:this.loadObj.mcsId,iId:this.iId,statusObj:statusObj,
                        fromState:fromState,toState:toState}});
    }

    getConnectOptions() {
        var clId = this.loadObj.mqttClientId;
        if(this.loadObj.timestampClientId == true) {
            clId = clId + (+new Date());
        }

        var options = {
            protocolId:this.loadObj.protocolId,
            protocolVersion:this.loadObj.protocolVersion,
            keepalive:Number(this.loadObj.keepalive),
            reschedulePings:this.loadObj.reschedulePings,
            clientId:clId,
            clean:this.loadObj.clean,
            reconnectPeriod:Number(this.loadObj.reconnectPeriod),
            connectTimeout:Number(this.loadObj.connectTimeout),
            queueQoSZero:this.loadObj.queueQoSZero
        };

        if(this.loadObj.username!=null && this.loadObj.username.trim().length>0) {
            options['username']=this.loadObj.username;
        }
        if(this.loadObj.password!=null && this.loadObj.password.trim().length>0) {
            options['password']=this.loadObj.password;
        }

        if(this.loadObj.willTopic!=null && this.loadObj.willTopic.length>0 && this.loadObj.willPayload!=null) {
            options['will']= {
                topic:this.loadObj.willTopic,
                payload:this.loadObj.willPayload,
                qos:this.loadObj.willQos,
                retain:this.loadObj.willRetain
            }
        }
        return options;
    }

    startPublishLoad() {
        this.publishStatusWithSuccess({status:MqttLoadConstants.STATE_IN_PROGRESS,message:MqttLoadConstants.LOAD_MQTT_CLIENT_PUBLISHING,time:+(new Date())});

        var messPerSec = this.loadObj.msgCount/this.loadObj.runTime;
        var timeDiffPerMess = 1000/messPerSec;
        if(this.messageStartTime == null) {
            this.messageStartTime = +(new Date());
            this.qosStartTime = +(new Date());
        }
        this.publishMqttMessages();
        this.publishTimeKeeper = setInterval(this.publishMqttMessages.bind(this),timeDiffPerMess);
    }

    startSubscribeLoad() {
        this.client.unsubscribe(this.loadObj.topic,function(){
            this.publishStatusWithSuccess({status:MqttLoadConstants.STATE_IN_PROGRESS,message:MqttLoadConstants.LOAD_MQTT_CLIENT_SUBSCRIBING,time:+(new Date())});
            if(this.messageStartTime == null) {
                this.messageStartTime = +(new Date());
            }

            this.client.subscribe(this.loadObj.topic,{qos:this.loadObj.qos},function(err,granted) {
                if(err==null) {
                    this.publishStatusWithSuccess({status:MqttLoadConstants.STATE_IN_PROGRESS,message:MqttLoadConstants.LOAD_MQTT_CLIENT_SUBSCRIBED,time:+(new Date())});
                } else {
                    this.publishStatusWithSuccess({status:MqttLoadConstants.STATE_ERROR,message:MqttLoadConstants.LOAD_MQTT_CLIENT_SUBSCRIBING_ERROR,time:+(new Date())});
                }
            }.bind(this));
        }.bind(this));
    }

    onSubscribedMessageReceived(topic, message,packet) {
        this.messCount++;
        this.qosReceivedMessCount++;
        this.receivedMessages.push({time:+(new Date()),data:{messageId:packet.messageId,payload:message.toString(),qos:packet.qos,topic:topic,inum:this.inum}});
        if(this.receivedMessages.length>=this.loadObj.msgCount) {
            this.messageEndTime = +(new Date());
            this.endLoadTest(MqttLoadConstants.STATE_SUCCESS,MqttLoadConstants.LOAD_COMPLETED);
        }
    }

    publishMqttMessages() {

        if(this.messCount<this.loadObj.msgCount) {
            this.payloadCounter++;
            if(this.payloadCounter>=this.loadObj.payload.length) {
                this.payloadCounter = 0;
            }

            if(this.loadObj.qos == 0) {
                this.client.publish(this.loadObj.topic,this.loadObj.payload[this.payloadCounter],{qos:this.loadObj.qos,retain:false});
                this.receivedMessages.push({time:+(new Date()),data:{messageId:'',payload:this.loadObj.payload[this.payloadCounter],qos:this.loadObj.qos,topic:this.loadObj.topic,inum:this.inum}});
                this.qosReceivedMessCount++;
            } else {
                this.client.publish(this.loadObj.topic,this.loadObj.payload[this.payloadCounter],{qos:this.loadObj.qos,retain:false},
                    function(data,packet) {
                        if(packet == null) {
                            packet = {};
                        }
                        this.receivedMessages.push({time:+(new Date()),data:{messageId:packet.messageId,payload:packet.payload,qos:this.loadObj.qos,topic:this.loadObj.topic,inum:this.inum}});
                        this.qosReceivedMessCount++;
                        if(this.qosReceivedMessCount>=this.loadObj.msgCount) {
                            this.endLoadTest(MqttLoadConstants.STATE_SUCCESS,MqttLoadConstants.LOAD_COMPLETED);
                        }
                    }.bind(this));
            }
            this.messCount++;
        }

        if(this.loadObj.msgCount == this.messCount) {
            clearInterval(this.publishTimeKeeper);
            if(this.messageEndTime == null) {
                this.messageEndTime = +(new Date());
            }

            this.publishStatusWithSuccess({status:MqttLoadConstants.STATE_SUCCESS,message:MqttLoadConstants.LOAD_MQTT_CLIENT_PUBLISHED,time:+(new Date())});
            if(this.loadObj.qos == 0) {
                this.endLoadTest(MqttLoadConstants.STATE_SUCCESS,MqttLoadConstants.LOAD_COMPLETED);
            } else {
                this.publishStatusWithSuccess({status:MqttLoadConstants.STATE_IN_PROGRESS,message:MqttLoadConstants.LOAD_MQTT_CLIENT_WAITING_FOR_QOS,time:+(new Date())});
            }
        }
    }

    endLoadTest(finalStatus,finalMessage) {
        clearInterval(this.publishTimeKeeper);
        clearTimeout(this.runTimeKeeper);

        if(this.qosEndTime == null) {
            this.qosEndTime = +(new Date());
        }

        if(this.messageEndTime == null) {
            this.messageEndTime = +(new Date());
        }

        this.client.end(true);

        if(this.receivedMessages!=null && this.receivedMessages.length>0) {
            this.publishStatusWithSuccess({status:MqttLoadConstants.STATE_IN_PROGRESS,message:MqttLoadConstants.LOAD_MQTT_CLIENT_SAVING_DATA,time:+(new Date())});
            var archiveData = {metaData:{iId:this.iId,inum:this.inum},receivedMessages:this.receivedMessages}
            Q.invoke(this.loadInstanceDb,'setItem',this.iId,archiveData)
            .catch(function (error) {
                this.publishStatusWithSuccess({status:MqttLoadConstants.STATE_ERROR,message:MqttLoadConstants.LOAD_MQTT_CLIENT_ERROR_SAVING_DATA,time:+(new Date())});
            })
            .done(function() {
                this.publishStatusWithSuccess({status:finalStatus,message:finalMessage,time:+(new Date())});
                this.publishLoadTestEndMessage();
            }.bind(this));
        } else {
            this.publishStatusWithSuccess({status:finalStatus,message:finalMessage,time:+(new Date())});
            this.publishLoadTestEndMessage();
        }
    }

    publishLoadTestEndMessage() {
        PlatformMqttLoadEventService.processEvent({event:MqttLoadConstants.EVENT_MQTT_LOAD_TEST_ENDED,
                        data:{mcsId:this.loadObj.mcsId,iId:this.iId,messageStartTime:this.messageStartTime,messageEndTime:this.messageEndTime,
                        messCount:this.messCount,qosStartTime:this.qosStartTime,qosEndTime:this.qosEndTime,qosReceivedMessCount:this.qosReceivedMessCount}});
    }
}

export default new MqttLoadTestWorker();