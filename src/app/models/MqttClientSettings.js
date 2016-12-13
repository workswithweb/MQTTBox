import UUID from 'node-uuid';

class MqttClientSettings {
    constructor() {

        this.protocol = 'ws';
        this.host = 'test.mosca.io:80';

        this.mqtt311Compliant = true;
        this.keepalive = 10;
        this.reschedulePings = true;
        this.mqttClientId = UUID.v4();
        this.timestampClientId = true;
        this.protocolId = 'MQTT';
        this.protocolVersion = 4;
        this.clean = true;
        this.reconnectPeriod = 1000;
        this.connectTimeout = 30000;
        this.username = '';
        this.password = '';
        this.queueQoSZero = true;
        this.autoConnectOnAppLaunch = true;

        //ssl/tls settings
        this.sslTlsVersion = 'auto';
        this.certificateType = 'ssc';
        this.caFilePath = '';
        this.caFile = '';
        this.clientCertificateFilePath = '';
        this.clientCertificateFile = '';
        this.clientKeyFilePath = '';
        this.clientKeyFile = '';
        this.clientKeyPassphrase = '';

        this.willTopic = '';
        this.willPayload = '';
        this.willQos = 0;
        this.willRetain = false;

        this.mcsId = UUID.v4();
        this.mqttClientName = '';
        this.tag='';
        this.publishSettings = [];
        this.subscribeSettings= [];

        this.createdOn = +(new Date());
        this.updatedOn = +(new Date());
    }
}

export default MqttClientSettings;