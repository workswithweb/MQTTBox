import UUID from 'node-uuid';
import PublisherSettings from './PublisherSettings';
import SubscriberSettings from './SubscriberSettings';

class BrokerSettings {
    constructor() {
        this.protocol = 'ws';
        this.host = 'test.mosquitto.org:8080';
        this.mqtt311Compliant = true;
        this.keepalive = 10;
        this.reschedulePings = true;
        this.clientId = UUID.v4();
        this.protocolId = 'MQTT';
        this.protocolVersion = 4;
        this.queueQoSZero = true,
        this.clean = true;
        this.reconnectPeriod = 1000;
        this.connectTimeout = 30000;
        this.username = '';
        this.password = '';
        this.willTopic = '';
        this.willPayload = '';
        this.willQos = 0;
        this.willRetain = false;

        this.bsId = UUID.v4();
        this.brokerName = '';
        this.publishSettings = [];
        this.subscribeSettings= [];

        this.createdOn = +(new Date());
        this.updatedOn = +(new Date());
    }
}

export default BrokerSettings;
