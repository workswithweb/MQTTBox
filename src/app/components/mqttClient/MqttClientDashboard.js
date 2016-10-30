import React, {Component} from 'react';

import LeftMenuButton from '../common/LeftMenuButton';
import NavUtils from '../../utils/NavUtils';
import MqttClientService from '../../services/MqttClientService';
import MqttClientPublisher from './MqttClientPublisher';
import MqttClientSubscriber from './MqttClientSubscriber';
import MqttClientActions from '../../actions/MqttClientActions';
import MqttClientConstants from '../../utils/MqttClientConstants';
import PublisherSettings from '../../models/PublisherSettings';
import SubscriberSettings from '../../models/SubscriberSettings';

const styles = {
    container: {
        marginTop:10
    },
    button: {
        margin: 10
    },
    menuText: {
        marginTop: 20
    }
};

class MqttClientDashboard extends Component {

    constructor(props) {
        super(props);

        this.savePublisherSettings = this.savePublisherSettings.bind(this);
        this.saveSubscriberSettings = this.saveSubscriberSettings.bind(this);
        this.changeConnectionState = this.changeConnectionState.bind(this);
        this.updatePageData = this.updatePageData.bind(this);
        this.updateConnectionStatus = this.updateConnectionStatus.bind(this);

        this.state = {conState:MqttClientService.getMqttClientStateByMcsId(this.props.params.mcsId),
                        mqttClientSettings:MqttClientService.getMqttClientSettingsByMcsId(this.props.params.mcsId)};
    }

    savePublisherSettings() {
        MqttClientActions.savePublisherSettings({mcsId:this.props.params.mcsId,publisher:new PublisherSettings()});
    }

    saveSubscriberSettings() {
        MqttClientActions.saveSubscriberSettings({mcsId:this.props.params.mcsId,subscriber:new SubscriberSettings()});
    }

    changeConnectionState() {
        if(this.state.conState == MqttClientConstants.CONNECTION_STATE_CONNECTED) {
            MqttClientActions.disConnectFromBroker(this.props.params.mcsId);
        } else {
            MqttClientActions.connectToBroker(this.state.mqttClientSettings);
        }
    }

    updatePageData(mcsId) {
        if(mcsId == this.props.params.mcsId) {
            this.setState({mqttClientObj:MqttClientService.getMqttClientSettingsByMcsId(this.props.params.mcsId),
            conState:MqttClientService.getMqttClientStateByMcsId(this.props.params.mcsId)});
        }
    }

    updateConnectionStatus(connStateObj) {
        if(connStateObj.mcsId == this.props.params.mcsId) {
            this.setState({conState:MqttClientService.getMqttClientStateByMcsId(this.props.params.mcsId)});
        }
    }

    componentDidMount() {
        MqttClientService.addChangeListener(MqttClientConstants.EVENT_MQTT_CLIENT_DATA_CHANGED,this.updatePageData);
        MqttClientService.addChangeListener(MqttClientConstants.EVENT_MQTT_CLIENT_CONN_STATE_CHANGED,this.updateConnectionStatus);
    }

    componentWillUnmount() {
        MqttClientService.removeChangeListener(MqttClientConstants.EVENT_MQTT_CLIENT_DATA_CHANGED,this.updatePageData);
        MqttClientService.removeChangeListener(MqttClientConstants.EVENT_MQTT_CLIENT_CONN_STATE_CHANGED,this.updateConnectionStatus);
    }

    render() {
        var gridList = [];
        var message = '';
        var conStateColor = 'btn btn-primary';
        var conStateText = 'Not Connected';

        if(this.state.conState == MqttClientConstants.CONNECTION_STATE_CONNECTED) {
            conStateColor = 'btn btn-success';
            conStateText = 'Connected';
        } else if(this.state.conState == MqttClientConstants.CONNECTION_STATE_ERROR) {
           conStateColor = 'btn btn-danger';
           conStateText = 'Connection Error';
        }

        if(this.state.mqttClientSettings!=null) {
            if(this.state.mqttClientSettings.publishSettings!=null && this.state.mqttClientSettings.publishSettings.length>0) {
                for(var i=0;i<this.state.mqttClientSettings.publishSettings.length;i++) {
                    gridList.push(<MqttClientPublisher conState={this.state.conState} key={this.state.mqttClientSettings.publishSettings[i].pubId} mcsId={this.props.params.mcsId} publisherSettings={this.state.mqttClientSettings.publishSettings[i]}/>);
                }
            }

            if(this.state.mqttClientSettings.subscribeSettings!=null && this.state.mqttClientSettings.subscribeSettings.length>0) {
                for(var i=0;i<this.state.mqttClientSettings.subscribeSettings.length;i++) {
                    gridList.push(<MqttClientSubscriber conState={this.state.conState} key={this.state.mqttClientSettings.subscribeSettings[i].subId} mcsId={this.props.params.mcsId} subscriberSettings={this.state.mqttClientSettings.subscribeSettings[i]}/>);
                }
            }
        }

        if(gridList.length ==0) {
            message = <div className="alert alert-success" role="alert"><b>You have no publisher or subscriber added for this MQTT client. Please click above buttons to add new MQTT publisher or MQTT subscriber for this MQTT client</b></div>;
        }

        return (
            <div>
                <nav className="navbar navbar-default navbar-fixed-top">
                    <div>
                        <div className="navbar-header">
                            <LeftMenuButton/>
                            <a href="#/mqttclientslist" className="btn btn-default"><span className="glyphicon glyphicon-arrow-left" aria-hidden="true"> </span></a>
                        </div>
                        <div id="navbar" className="navbar-collapse collapse">
                            <ul className="nav navbar-nav">
                                <li>
                                    <button onClick={this.changeConnectionState} style={styles.button} type="button" className={conStateColor} aria-label="Left Align">
                                        <span className="glyphicon glyphicon-signal" aria-hidden="true"></span> {conStateText}
                                    </button>
                                </li>
                                <li>
                                    <button onClick={this.savePublisherSettings} title="Add new publisher" style={styles.button} type="button" className="btn btn-default" aria-label="Left Align">
                                        <span style={{color:"#337ab7"}} className="glyphicon glyphicon-upload" aria-hidden="true"></span> Add publisher
                                    </button>
                                </li>
                                <li>
                                    <button onClick={this.saveSubscriberSettings} title="Add new subscriber" style={styles.button} type="button" className="btn btn-default" aria-label="Left Align">
                                        <span style={{color:"#eea236"}} className="glyphicon glyphicon-download" aria-hidden="true"></span> Add subscriber
                                    </button>
                                </li>
                                <li>
                                    <button onClick={NavUtils.gotToAddMqttClient.bind(this,this.props.params.mcsId)} title="Edit MQTT Client Settings"
                                    style={styles.button} type="button" className="btn btn-default" aria-label="Left Align">
                                        <span className="glyphicon glyphicon-cog" aria-hidden="true"></span>
                                    </button>
                                </li>
                                <li>

                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div style={{marginLeft:15}}><small><code style={{color:'#337ab7'}}>{this.state.mqttClientSettings.mqttClientName+' - '+this.state.mqttClientSettings.protocol+'://'+this.state.mqttClientSettings.host}</code></small></div>
                <div className="container-fluid">
                    <div className="row">
                        {gridList}
                    </div>
                    <div>
                        {message}
                    </div>
                </div>
            </div>
        );
    }
}

export default MqttClientDashboard;
