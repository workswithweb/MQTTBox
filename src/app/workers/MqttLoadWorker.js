import {Qlobber} from 'qlobber';
import mqtt from 'mqtt';
import Q from 'q';
import _ from 'lodash';
import UUID from 'node-uuid';
import localforage from 'localforage';

import AppConstants from '../utils/AppConstants';
import C from '../utils/MqttLoadConstants';

class MqttLoadWorker {  

    constructor() {
        this.iId = null;
        this.inum = null;
        this.loadObj = null;
        this._matcher = new Qlobber({separator:'/',wildcard_one:'+',wildcard_some:'#'});
        this.client = null;
        this.runTimeKeeper = null;
        this.publishTimeKeeper = null;
        this.receivedMessages = [];
        this.messCount = 0;
        this.payloadCounter = -1;
        this.messageStartTime =null;
        this.messageEndTime = null;
        this.qosEndTime = null;
        this.isConnClosedMessSent = false;
        this.isConnOfflineMessSent = false;
        this.isConnErrorMessSent = false;

        this.workerMessageListener = this.workerMessageListener.bind(this);
        this.startMqttLoad = this.startMqttLoad.bind(this);
        this.stopMqttLoad = this.stopMqttLoad.bind(this);
        this.connect = this.connect.bind(this);
        this.publishLoadMqttMessages = this.publishLoadMqttMessages.bind(this);
        this.publishMqttMessages = this.publishMqttMessages.bind(this);
        this.subscribeLoadMqttMessages = this.subscribeLoadMqttMessages.bind(this);
        this.subscribeMqttMessages = this.subscribeMqttMessages.bind(this);
        this.endConnection = this.endConnection.bind(this);
        this.publishEndConnection = this.publishEndConnection.bind(this);
        this.startRunTimer = this.startRunTimer.bind(this);

        this.publishLoadResults = this.publishLoadResults.bind(this);
        this.getConnectOptions = this.getConnectOptions.bind(this);

        self.addEventListener('message',this.workerMessageListener,false);
    }

    workerMessageListener(event) {
        var data = event.data;
        switch(data.cmd) {
            case C.WORKER_CMD_MQTT_LOAD_START:
                this.startMqttLoad(data.payload);
                break;
            case C.WORKER_CMD_MQTT_LOAD_STOP:
                this.stopMqttLoad();
                break;
            default:
                break;
        }
    }

    startMqttLoad(data) {
        this.iId = data.iId;
        this.inum = data.inum;
        this.loadObj = data.loadObj;
        this.loadObj.clientId = UUID.v4();
        this.publishLoadResults({status:C.STATE_IN_PROGRESS,message:C.LOAD_BROKER_CONNECTING},{fs:C.STATE_IN_PROGRESS,ts:C.STATE_SUCCESS});
        this.connect();
        this.startRunTimer();
    }

    stopMqttLoad() {
        clearInterval(this.publishTimeKeeper);
        this.endConnection({status:C.STATE_STOPPED,message:C.LOAD_STOPPED},{fs:C.STATE_IN_PROGRESS,ts:C.STATE_ERROR});
    }

    startRunTimer() {
        clearTimeout(this.runTimeKeeper);
        this.runTimeKeeper = setTimeout(function() {
            this.endConnection({status:C.STATE_TIME_OUT,message:C.LOAD_TIME_OUT},{fs:C.STATE_IN_PROGRESS,ts:C.STATE_ERROR});
        }.bind(this),(this.loadObj.timeOut)*1000);
    }

    connect() {
        if(this.loadObj!=null && this.loadObj.bsId!=null) {
            this.client = mqtt.connect(this.loadObj.protocol+'://'+this.loadObj.host,this.getConnectOptions());

            this.client.on('connect', function () {
                var message = {status:C.STATE_SUCCESS,message:C.LOAD_BROKER_CONNECTED};
                var status = {fs:C.STATE_IN_PROGRESS,ts:C.STATE_SUCCESS};
                this.publishLoadResults(message,status);
                this.isConnClosedMessSent = false;
                this.isConnOfflineMessSent = false;
                this.isConnErrorMessSent = false;

                if(this.loadObj.loadType == C.LOAD_TYPE_PUBLISHING) {
                    this.publishLoadMqttMessages();
                } else if(this.loadObj.loadType == C.LOAD_TYPE_SUBSCRIBING) {
                    this.subscribeLoadMqttMessages();
                }
            }.bind(this));

            this.client.on('close', function () {
                clearInterval(this.publishTimeKeeper);
                if(this.isConnClosedMessSent == false) {
                    var message = {status:C.STATE_ERROR,message:C.LOAD_BROKER_CONNECTION_CLOSED};
                    this.publishLoadResults(message,null);
                   // this.isConnClosedMessSent = true;
                }
            }.bind(this));

            this.client.on('offline', function () {
                clearInterval(this.publishTimeKeeper);
                if(this.isConnOfflineMessSent == false) {
                    var message = {status:C.STATE_ERROR,message:C.LOAD_BROKER_CONNECTION_OFFLINE};
                    this.publishLoadResults(message,null);
                   // this.isConnOfflineMessSent = true;
                }
            }.bind(this));

            this.client.on('error', function (err) {
                clearInterval(this.publishTimeKeeper);
                if(this.isConnErrorMessSent == false) {
                    var message = {status:C.STATE_ERROR,message:C.LOAD_BROKER_CONNECTION_ERROR};
                    this.publishLoadResults(message,null);
                    this.isConnErrorMessSent = true;
                }
            }.bind(this));

            this.client.on('message', function (topic, message,packet) {
                this.subscribeMqttMessages(topic, message,packet);
            }.bind(this));
        }
    }

    publishLoadMqttMessages() {
        this.publishLoadResults({status:C.STATE_IN_PROGRESS,message:C.LOAD_BROKER_PUBLISHING},{fs:C.STATE_IN_PROGRESS,ts:C.STATE_SUCCESS});
        var messPerSec = this.loadObj.msgCount/this.loadObj.runTime;
        var timeDiffPerMess = 1000/messPerSec;

        if(this.messageStartTime == null) {
            this.messageStartTime = +(new Date());
        }
        this.publishMqttMessages();
        this.publishTimeKeeper = setInterval(this.publishMqttMessages.bind(this),timeDiffPerMess);
    }

    publishMqttMessages() {
        if(this.messCount<this.loadObj.msgCount) {
            this.payloadCounter++;
            if(this.payloadCounter>=this.loadObj.payload.length) {
                this.payloadCounter = 0;
            }

            if(this.loadObj.qos ==0) {
                this.client.publish(this.loadObj.topic,this.loadObj.payload[this.payloadCounter],{qos:this.loadObj.qos,retain:false});
                this.receivedMessages.push({time:+(new Date()),data:{messageId:'',payload:this.loadObj.payload[this.payloadCounter],qos:this.loadObj.qos,topic:this.loadObj.topic,inum:this.inum}});
                if(this.receivedMessages.length>=this.loadObj.msgCount) {
                    clearInterval(this.publishTimeKeeper);
                    this.qosEndTime = +(new Date());
                    this.endConnection({status:C.STATE_SUCCESS,message:C.LOAD_COMPLETED},{fs:C.STATE_IN_PROGRESS,ts:C.STATE_SUCCESS});
                }
            } else {
                this.client.publish(this.loadObj.topic,this.loadObj.payload[this.payloadCounter],{qos:this.loadObj.qos,retain:false},
                function(data,packet) {
                    if(packet == null) {
                        packet = {};
                    }
                    this.receivedMessages.push({time:+(new Date()),data:{messageId:packet.messageId,payload:packet.payload,qos:this.loadObj.qos,topic:this.loadObj.topic,inum:this.inum}});
                    if(this.receivedMessages.length>=this.loadObj.msgCount) {
                        clearInterval(this.publishTimeKeeper);
                        this.qosEndTime = +(new Date());
                        this.endConnection({status:C.STATE_SUCCESS,message:C.LOAD_COMPLETED},{fs:C.STATE_IN_PROGRESS,ts:C.STATE_SUCCESS});
                    }
                }.bind(this));
            }

            this.messCount++;
            if(this.loadObj.msgCount == this.messCount) {
                this.messageEndTime = +(new Date());
                this.publishLoadResults({status:C.STATE_SUCCESS,message:C.LOAD_BROKER_PUBLISHED},{fs:C.STATE_IN_PROGRESS,ts:C.STATE_SUCCESS});
                this.publishLoadResults({status:C.STATE_IN_PROGRESS,message:C.LOAD_BROKER_WAITING_FOR_QOS},{fs:C.STATE_IN_PROGRESS,ts:C.STATE_SUCCESS});
            }
        }
    }

    subscribeLoadMqttMessages() {
        this.publishLoadResults({status:C.STATE_IN_PROGRESS,message:C.LOAD_BROKER_SUBSCRIBING},{fs:C.STATE_IN_PROGRESS,ts:C.STATE_SUCCESS});

        if(this.messageStartTime == null) {
            this.messageStartTime = +(new Date());
        }

        this.client.subscribe(this.loadObj.topic,{qos:this.loadObj.qos},function(err,granted) {
            if(err==null) {
                this.publishLoadResults({status:C.STATE_IN_PROGRESS,message:C.LOAD_BROKER_SUBSCRIBED},{fs:C.STATE_IN_PROGRESS,ts:C.STATE_SUCCESS});
            } else {
                this.endConnection({status:C.STATE_ERROR,message:C.LOAD_BROKER_SUBSCRIBING_ERROR},{fs:C.STATE_IN_PROGRESS,ts:C.STATE_ERROR});
            }
        }.bind(this));
    }

    subscribeMqttMessages(topic, message,packet) {
        this.receivedMessages.push({time:+(new Date()),data:{messageId:packet.messageId,payload:message.toString(),qos:packet.qos,topic:topic,inum:this.inum}});
        if(this.receivedMessages.length>=this.loadObj.msgCount) {
            this.messageEndTime = +(new Date());
            this.endConnection({status:C.STATE_SUCCESS,message:C.LOAD_COMPLETED},{fs:C.STATE_IN_PROGRESS,ts:C.STATE_SUCCESS});
        }
    }

    endConnection(message,status) {
        clearTimeout(this.runTimeKeeper);
        this.isConnClosedMessSent = true;
        this.client.end(true);
        this.publishLoadResults({status:C.STATE_IN_PROGRESS,message:C.LOAD_BROKER_SAVING_DATA},{fs:C.STATE_IN_PROGRESS,ts:C.STATE_SUCCESS});

        if(this.receivedMessages!=null && this.receivedMessages.length>0) {
            var db = localforage.createInstance({name:C.DB_MQTT_LOAD_DATA,driver:localforage.INDEXEDDB});
            var archiveData = {metaData:{name:'Instance '+this.inum},receivedMessages:this.receivedMessages}
            Q.invoke(db,'setItem',this.iId,archiveData)
            .then(function() {
                this.publishEndConnection(message,status);
            }.bind(this))
            .catch(function (error) {
                this.endConnection({status:C.STATE_ERROR,message:C.LOAD_BROKER_ERROR_SAVING_DATA},{fs:C.STATE_IN_PROGRESS,ts:C.STATE_ERROR});
            })
            .done();
        } else {
            this.publishEndConnection(message,status);
        }
    }

    publishEndConnection(message,status) {
        message['time'] = +(new Date());
        postMessage({event:C.WORKER_EVENT_MQTT_LOAD_FINISHED,
            payload:
            {
                bsId:this.loadObj.bsId,
                iId:this.iId,
                message:message,
                status:status,
                metaData:{
                    receivedMessagesCount:this.receivedMessages.length,
                    messCount:this.messCount,
                    messageStartTime: this.messageStartTime,
                    messageEndTime:this.messageEndTime,
                    qosEndTime:this.qosEndTime
                }
            }
        });
        close();
    }

    publishLoadResults(message,status) {
        message['time'] = +(new Date());
        postMessage({event:C.WORKER_EVENT_MQTT_LOAD_DATA,
                        payload:{bsId:this.loadObj.bsId,iId:this.iId,message:message,status:status}});
    }

    getConnectOptions() {
        var options = {
            keepalive:Number(this.loadObj.keepalive),
            reschedulePings:this.loadObj.reschedulePings,
            clientId:this.loadObj.clientId,
            protocolId:this.loadObj.protocolId,
            protocolVersion:this.loadObj.protocolVersion,
            clean:this.loadObj.clean,
            reconnectPeriod:Number(this.loadObj.reconnectPeriod),
            connectTimeout:Number(this.loadObj.connectTimeout)
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
}

export default new MqttLoadWorker();
