import BrokerSettings from './BrokerSettings';

class MqttLoadSettings extends BrokerSettings {
    constructor() {
        super();
        this.loadType = "publishing";
        this.msgCount = 20;
        this.runTime = 5;
        this.timeOut = 30;
        this.instanceCount = 2;
        this.topic = '';
        this.qos = 1;
        this.payload = [''];
        this.instances = {};
    }
}

export default MqttLoadSettings;

