const ipcMain = require('electron').ipcMain;

const MqttClientConstants = require('../utils/MqttClientConstants');
const MqttClientsElectronService = require('./MqttClientsElectronService');

class ElectronIpcMainService {  

    constructor() {
        ipcMain.on(MqttClientConstants.CHANNEL_MQTT_CLIENTS, this.handleMqttClientsIpcRequests);
    }

    handleMqttClientsIpcRequests(event, arg) {
        MqttClientsElectronService.processAction(arg);
    }

    killChildProcess() {
        MqttClientsElectronService.killChildProcess();
    }

}

module.exports = new ElectronIpcMainService();