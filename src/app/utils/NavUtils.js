import { hashHistory } from 'react-router'
import MqttClientService from '../services/MqttClientService';
import MqttLoadService from '../services/MqttLoadService';

class NavUtils {

    static goToMqttClientList() {
        hashHistory.replace('/mqttclientslist');
    }

    static gotToAddMqttClient(mcsId) { 
        if(mcsId!=null && mcsId.length>1) {
            hashHistory.replace('/addeditmqttclient/'+mcsId);
        } else {
            hashHistory.replace('/addeditmqttclient');
        }
    }

    static goToMqttClientDashboard(mcsId) {
        var obj = MqttClientService.getMqttClientSettingsByMcsId(mcsId);
        if(obj!=null && obj.mcsId==mcsId) {
            hashHistory.replace('/mqttclientdashboard/'+mcsId);
        } else {
            hashHistory.replace('/mqttclientslist');
        }
    }

    static goToMqttLoadList() {
        hashHistory.replace('/mqttloadlist');
    }

    static gotToAddEditMqttLoad(mcsId) { 
        if(mcsId!=null && mcsId.length>1) {
            hashHistory.replace('/addeditmqttload/'+mcsId);
        } else {
            hashHistory.replace('/addeditmqttload');
        }
    }

    static goToMqttLoadDashboard(mcsId) {
         var obj = MqttLoadService.getMqttLoadSettingsByMcsId(mcsId);
         if(obj!=null && obj.mcsId==mcsId) {
             hashHistory.replace('/mqttloaddashboard/'+mcsId);
         } else {
             hashHistory.replace('/mqttloadlist');
         }
    }

    static goToAboutMqttBox() {
        hashHistory.replace('/aboutapp');
    }

    static goToMqttLoadTestData(mcsId) {
        hashHistory.replace('/mqttloadtestdata/'+mcsId);
    }

    static goToMqttLoadTestGraph(mcsId) {
        hashHistory.replace('/mqttloadtestgraph/'+mcsId);
    }
}

export default NavUtils;