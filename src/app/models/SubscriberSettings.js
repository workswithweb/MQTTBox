import UUID from 'node-uuid';

class SubscriberSettings {
    constructor() {
        this.subId = UUID.v4();
        this.topic = '';
        this.qos = 0;
        this.addedOn = +(new Date());
        this.updatedOn = +(new Date());
        this.subscribedMessages = [];
    }
}

export default SubscriberSettings;