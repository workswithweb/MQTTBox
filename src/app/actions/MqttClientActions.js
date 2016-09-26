import AppDispatcher from '../dispatcher/AppDispatcher';
import MqttClientConstants from '../utils/MqttClientConstants';

class MqttClientActions {  

    static saveMqttClientSettings(data) { 
        AppDispatcher.dispatch({ 
            actionType: MqttClientConstants.ACTION_SAVE_MQTT_CLIENT, 
            data: data 
        }); 
    }

    static deleteMqttClientSettings(data) { 
        AppDispatcher.dispatch({ 
            actionType: MqttClientConstants.ACTION_DELETE_MQTT_CLIENT, 
            data: data 
        }); 
    }

    static savePublisherSettings(data) { 
        AppDispatcher.dispatch({ 
            actionType: MqttClientConstants.ACTION_SAVE_MQTT_CLIENT_PUBLISHER, 
            data: data 
        }); 
    }

    static deletePublisher(data) { 
        AppDispatcher.dispatch({ 
            actionType: MqttClientConstants.ACTION_DELETE_MQTT_CLIENT_PUBLISHER, 
            data: data 
        }); 
    }

    static saveSubscriberSettings(data) { 
        AppDispatcher.dispatch({ 
            actionType: MqttClientConstants.ACTION_SAVE_MQTT_CLIENT_SUBSCRIBER, 
            data: data 
        }); 
    }

    static deleteSubscriber(data) { 
        AppDispatcher.dispatch({ 
            actionType: MqttClientConstants.ACTION_DELETE_MQTT_CLIENT_SUBSCRIBER, 
            data: data 
        }); 
    }

    static connectToBroker(mqttClientObj) { 
        AppDispatcher.dispatch({ 
            actionType: MqttClientConstants.ACTION_MQTT_CLIENT_CONNECT, 
            data: mqttClientObj 
        }); 
    }

    static disConnectFromBroker(mcsId) { 
        AppDispatcher.dispatch({ 
            actionType: MqttClientConstants.ACTION_MQTT_CLIENT_DISCONNECT, 
            data: mcsId 
        }); 
    }

    static publishMessage(mcsId,pubId,topic,payload,qos,retain) { 
        AppDispatcher.dispatch({ 
            actionType: MqttClientConstants.ACTION_PUBLISH_MESSAGE, 
            data: {mcsId:mcsId,pubId:pubId,topic:topic,payload:payload,qos:qos,retain:retain} 
        }); 
    }

    static subscribeToTopic(mcsId,subId,topic,qos) { 
        AppDispatcher.dispatch({ 
            actionType: MqttClientConstants.ACTION_SUBSCRIBE_TO_TOPIC, 
            data: {mcsId:mcsId,subId:subId,topic:topic,qos:qos} 
        }); 
    }

    static unSubscribeToTopic(mcsId,subId,topic) { 
        AppDispatcher.dispatch({ 
            actionType: MqttClientConstants.ACTION_UN_SUBSCRIBE_TO_TOPIC, 
            data: {mcsId:mcsId,subId:subId,topic:topic} 
        }); 
    }
}

export default MqttClientActions;