import { hashHistory } from 'react-router'
import MqttClientService from '../services/MqttClientService';

class NavUtils {
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

    static goToMqttClientList() {
        hashHistory.replace('/mqttclientslist');
    }
}

export default NavUtils;