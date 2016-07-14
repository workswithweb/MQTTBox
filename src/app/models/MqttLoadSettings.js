import BrokerSettings from './BrokerSettings';

class MqttLoadSettings extends BrokerSettings {
    constructor() {
        super();
        this.msgPerSecond = 10;
        this.runTime = 5;
        this.instanceCount = 2;
        this.instanceIds = [];
        this.timeOut = 30;
        this.loadType = "publish";
    }
}

export default MqttLoadSettings;

//each instance data [{"state":"","message":"","data":"","updatedOn":""}]
//state - SUCCESS,ERROR
//message for publish -
                        //Connecting  to broker...
                        //connected to broker
                        //Connection failed. Please check broker settings
                        //publishing messages "OR" subscribing to topic
                        //waiting for QoS response for all messages "OR" waiting for all subscribed messages
                        //time out
                        //saving data
                        //Completed
//data - {}

