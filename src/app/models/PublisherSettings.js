import UUID from 'node-uuid';

class PublisherSettings {
    constructor() {
        this.pubId = UUID.v4();
        this.topic = '';
        this.qos = 0;
        this.retain = false;
        this.payload = '';
        this.addedOn = +(new Date());
        this.updatedOn = +(new Date());
        this.publishedMessages = [];
    }
}

export default PublisherSettings;
