import React, {Component} from 'react';

import LeftMenuButton from '../common/LeftMenuButton';
import NavUtils from '../../utils/NavUtils';
import MqttLoadService from '../../services/MqttLoadService';
import MqttLoadConstants from '../../utils/MqttLoadConstants';

const styles = {
    container: {
        marginTop:10
    },
    buttonContainer: {
        marginTop:10,
        marginRight:5
    },
    loadSettings: {
        textAlign:'center',
        cursor:'pointer',
        border:'2px solid #2e6da4'
    }
}

class MqttLoadList extends Component {

    constructor(props) {
        super(props);
        this.getAllMqttLoadSettings = this.getAllMqttLoadSettings.bind(this);
        this.state = {mqttLoadSettings:MqttLoadService.getAllMqttLoadSettings()};
    }

    getAllMqttLoadSettings() {
        this.setState({mqttLoadSettings:MqttLoadService.getAllMqttLoadSettings()});
    }

    componentDidMount() {
        MqttLoadService.addChangeListener(MqttLoadConstants.EVENT_MQTT_LOAD_SETTINGS_CHANGED,this.getAllMqttLoadSettings);
    }

    componentWillUnmount() {
        MqttLoadService.removeChangeListener(MqttLoadConstants.EVENT_MQTT_LOAD_SETTINGS_CHANGED,this.getAllMqttLoadSettings);
    }

    render() {
        var mqttLoads = [],message = '';

        if(this.state.mqttLoadSettings!=null && this.state.mqttLoadSettings.length>0) {
            for(var i=0;i<this.state.mqttLoadSettings.length;i++) {
                var mqttLoad = this.state.mqttLoadSettings[i];

                mqttLoads.push(
                    <div key={this,mqttLoad.mcsId} className="col-xs-12 col-sm-6 col-md-3" onClick={NavUtils.goToMqttLoadDashboard.bind(this,mqttLoad.mcsId)}>
                        <div style={styles.loadSettings} className="thumbnail">
                            <div>
                                <h4>{mqttLoad.mqttClientName}</h4>
                                <div><small>{mqttLoad.protocol+' '+mqttLoad.host}</small></div>
                                <div><small>{mqttLoad.loadTestType+' '+mqttLoad.instanceCount}</small></div>
                            </div>
                        </div>
                    </div>
                );
            }
        }

        if(mqttLoads.length ==0) {
            message = <div className="alert" role="alert">
                <b>No MQTT load tests added. Click <button onClick={NavUtils.gotToAddEditMqttLoad} type="button" style={{margin:10}} className="btn btn-danger"><b>Add New MQTT Load</b></button> to add new MQTT load test</b></div>;
        }

        return (
            <div>
                <nav className="navbar navbar-default navbar-fixed-top">
                    <div>
                        <div className="navbar-header">
                            <LeftMenuButton/>
                            <span style={{margin:15}}>MQTT LOAD</span>
                        </div>
                        <div id="navbar" className="navbar-collapse collapse">
                            <ul className="nav navbar-nav">
                                <li style={styles.buttonContainer}>
                                    <button onClick={NavUtils.gotToAddEditMqttLoad} type="button" className="btn btn-danger">
                                        <b>Add New MQTT Load</b>
                                    </button>
                                </li>
                                <li style={styles.buttonContainer}>
                                    <button onClick={NavUtils.goToMqttClientList} title="MQTT CLIENTS" type="button" className="btn btn-default">
                                      <span className="glyphicon glyphicon-modal-window" aria-hidden="true"></span>
                                    </button>
                                </li>
                                <li style={styles.buttonContainer}>
                                    <button onClick={NavUtils.goToAboutMqttBox} title="ABOUT" type="button" className="btn btn-default">
                                      <span className="glyphicon glyphicon-info-sign" aria-hidden="true"></span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div className="container-fluid" style={styles.container}>
                    <div className="row">
                        {mqttLoads}
                    </div>
                    <div>
                        {message}
                    </div>
                </div>
            </div>
        );
    }
}

export default MqttLoadList;