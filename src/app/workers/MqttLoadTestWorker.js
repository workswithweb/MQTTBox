import AppConstants from '../utils/AppConstants';

class MqttLoadTestWorker {  

    constructor() {
        this.instanceId = null;
        this.mqttLoadSettings = null;
        this.workerMessageListener = this.workerMessageListener.bind(this);
        this.startLoadTest = this.startLoadTest.bind(this);
        self.addEventListener('message',this.workerMessageListener,false);
    }

    workerMessageListener(event) {
        var data = event.data;
        switch(data.cmd) {
            case AppConstants.WORKER_CMD_START_LOAD_TEST:
                this.startLoadTest(data.payload);
                break;
            default:
                break;
        }
    }

    startLoadTest(data) {
        this.instanceId = data.instanceId;
        this.mqttLoadSettings = data.mqttLoadSettings;

        postMessage({event:AppConstants.WORKER_EVENT_LOAD_TEST_END,
            payload:{bsId:this.mqttLoadSettings.bsId,instanceId:this.instanceId}});
        self.close();
    }
}

export default new MqttLoadTestWorker();