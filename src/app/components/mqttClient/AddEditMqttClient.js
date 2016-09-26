import React, {Component} from 'react';
import UUID from 'node-uuid';

import LeftMenuButton from '../common/LeftMenuButton';
import MqttClientSettings from '../../models/MqttClientSettings';
import CommonActions from '../../actions/CommonActions';
import MqttClientActions from '../../actions/MqttClientActions';
import MqttClientService from '../../services/MqttClientService';
import MqttClientConstants from '../../utils/MqttClientConstants';
import NavUtils from '../../utils/NavUtils';

const styles = {
    actionButton: {
        margin:10
    }
};
class AddEditMqttClient extends Component {
    constructor(props) {
        super(props);

        this.initMqttClientObj = this.initMqttClientObj.bind(this);
        this.onTargetValueChange = this.onTargetValueChange.bind(this);
        this.generateMqttClientId = this.generateMqttClientId.bind(this);
        this.onMqtt311CompliantChange = this.onMqtt311CompliantChange.bind(this);
        this.onCheckBoxValueChange = this.onCheckBoxValueChange.bind(this);
        this.saveMqttClientSettings = this.saveMqttClientSettings.bind(this);
        this.deleteMqttClientSettings = this.deleteMqttClientSettings.bind(this);

        this.initMqttClientObj(this.props.params);
    }

    initMqttClientObj(params) {
        if(params!=null && params.mcsId!=null && params.mcsId.trim().length>0) {
            this.state = MqttClientService.getMqttClientSettingsByMcsId(params.mcsId);
        } else {
            this.state = new MqttClientSettings();
        }
    }

    onTargetValueChange(event) {
        var newState = {};
        newState[event.target.name] = event.target.value;
        this.setState(newState);
    }

    generateMqttClientId() {
        this.setState({mqttClientId:UUID.v4()});
    }

    onMqtt311CompliantChange(event) {
        var newState = {mqtt311Compliant:true,protocolId:'MQTT',protocolVersion:4};
        if(event.target.checked === false) {
            newState = {mqtt311Compliant:false,protocolId:'MQIsdp',protocolVersion:3};
        }
        this.setState(newState);
    }

    onCheckBoxValueChange(event) {
        var newState = {};
        newState[event.target.name] = event.target.checked;
        this.setState(newState);
    }

    saveMqttClientSettings() {
        if(this.state!=null) {
            if(this.state.mqttClientName==null||this.state.mqttClientName.trim().length<1||this.state.mqttClientName.trim().length>500) {
                CommonActions.showMessageToUser({message:'Please enter valid MQTT client name'});
            } else if(this.state.mqttClientId==null||this.state.mqttClientId.trim().length<1||this.state.mqttClientId.trim().length>500) {
                CommonActions.showMessageToUser({message:'Please enter valid client id'});
            } else if(this.state.host==null||this.state.host.trim().length<1||this.state.host.trim().length>10000) {
                CommonActions.showMessageToUser({message:'Please enter valid host'});
            } else if(this.state.reconnectPeriod==null|| Number.isNaN(this.state.reconnectPeriod) || this.state.reconnectPeriod<=0) {
                CommonActions.showMessageToUser({message:'Please enter valid reconnect period'});
            } else if(this.state.connectTimeout==null|| Number.isNaN(this.state.connectTimeout) || this.state.connectTimeout<=0) {
                CommonActions.showMessageToUser({message:'Please enter valid connect timeout'});
            } else if(this.state.keepalive==null|| Number.isNaN(this.state.keepalive) || this.state.keepalive<0) {
                CommonActions.showMessageToUser({message:'Please enter valid keep alive'});
            } else if(this.state.willTopic!=null && this.state.willTopic.trim().length>0 &&
            (this.state.willTopic.indexOf('#') > -1 || this.state.willTopic.indexOf('+') > -1)) {
                CommonActions.showMessageToUser({message:'Please enter valid "will topic". Should not contain + or #'});
            } else {
                MqttClientActions.saveMqttClientSettings(this.state);
            }
        } else {
            CommonActions.showMessageToUser({message:'Please Enter Valid MQTT Client Settings'});
        }
    }

    deleteMqttClientSettings() {
        MqttClientActions.deleteMqttClientSettings(this.props.params.mcsId);
    }

    componentDidMount() {
        MqttClientService.addChangeListener(MqttClientConstants.EVENT_MQTT_CLIENT_DATA_CHANGED,NavUtils.goToMqttClientDashboard);
    }

    componentWillUnmount() {
        MqttClientService.removeChangeListener(MqttClientConstants.EVENT_MQTT_CLIENT_DATA_CHANGED,NavUtils.goToMqttClientDashboard);
    }

    render() {
        var deleteButton = '';
        var backButton = '';

        if(this.props.params.mcsId!=null) {
            deleteButton = <button style={styles.actionButton} onClick={this.deleteMqttClientSettings} type="button" className="btn btn-default">Delete</button>;
            backButton = <a href={"#/mqttclientdashboard/"+this.props.params.mcsId} className="navButton"><b><span className="glyphicon glyphicon-arrow-left" aria-hidden="true"> </span> BACK</b></a>;
        } else {
            backButton = <a href="#/mqttclientslist" className="navButton"><b><span className="glyphicon glyphicon-arrow-left" aria-hidden="true"> </span> BACK</b></a>;
        }

        return (
            <div>
                <nav className="navbar navbar-default navbar-fixed-top">
                    <div>
                        <div className="navbar-header">
                            <LeftMenuButton/>
                            {backButton}
                        </div>
                    </div>
                </nav>
                <div className="container-fluid" style={{margin:10,border:'1px solid #e7e7e7',borderRadius:5,padding:20}}>
                    <div className="row">
                        <div className="col-xs-12 col-sm-6 col-md-3">
                            <div className="form-group">
                                <label htmlFor="mqttClientName">MQTT Client Name</label>
                                <input type="text" className="form-control" name="mqttClientName"
                                placeholder="MQTT Client Name" onChange={this.onTargetValueChange} value={this.state.mqttClientName}/>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-3">
                            <div className="form-group">
                                <label htmlFor="mqttClientId">MQTT Client Id </label>
                                <div className="input-group">
                                    <input type="text" className="form-control" name="mqttClientId"
                                        placeholder="MQTT Client Id" onChange={this.onTargetValueChange}
                                        value={this.state.mqttClientId}/>
                                    <div data-toggle="tooltip" data-placement="bottom" title="Generate new MQTT client id"
                                    style={{cursor:'pointer'}} onClick={this.generateMqttClientId} className="input-group-addon"><span className="glyphicon glyphicon-refresh" aria-hidden="true"></span></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-3">
                            <label htmlFor="timestampClientId">Append timestamp to MQTT client id?</label>
                            <div className="checkbox">
                                <label>
                                    <input name="timestampClientId" checked={this.state.timestampClientId}
                                    onChange={this.onCheckBoxValueChange}
                                    type="checkbox"/> {this.state.timestampClientId==true? <span>Yes</span>:<span>No</span>}
                                </label>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-3">
                            <label htmlFor="mqtt311Compliant">Broker is MQTT v3.1.1 compliant?</label>
                            <div className="checkbox">
                                <label>
                                    <input name="mqtt311Compliant" checked={this.state.mqtt311Compliant}
                                    onChange={this.onMqtt311CompliantChange}
                                    type="checkbox"/> {this.state.mqtt311Compliant==true? <span>Yes</span>:<span>No</span>}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-6 col-md-3">
                            <label htmlFor="protocol">Protocol</label>
                            <select name="protocol" onChange={this.onTargetValueChange} value={this.state.protocol}
                                className="form-control">
                                <option value="ws">ws</option>
                                <option value="wss">wss</option>
                            </select>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-3">
                            <div className="form-group">
                                <label htmlFor="host">Host</label>
                                <input type="text" className="form-control" name="host"
                                placeholder="Host" onChange={this.onTargetValueChange} value={this.state.host}/>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-3">
                            <label htmlFor="clean">Clean Session?</label>
                            <div className="checkbox">
                                <label>
                                    <input name="clean" checked={this.state.clean}
                                    onChange={this.onCheckBoxValueChange}
                                    type="checkbox"/> {this.state.clean==true? <span>Yes</span>:<span>No</span>}
                                </label>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-3">
                            <label htmlFor="autoConnectOnAppLaunch">Auto connect on app launch?</label>
                            <div className="checkbox">
                                <label>
                                    <input name="autoConnectOnAppLaunch" checked={this.state.autoConnectOnAppLaunch}
                                    onChange={this.onCheckBoxValueChange}
                                    type="checkbox"/> {this.state.autoConnectOnAppLaunch==true? <span>Yes</span>:<span>No</span>}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-6 col-md-3">
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input autoComplete="off" type="text" className="form-control" name="username"
                                placeholder="Username" onChange={this.onTargetValueChange} value={this.state.username}/>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-3">
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input autoComplete="off" type='password' className="form-control" name="password"
                                placeholder="Password" onChange={this.onTargetValueChange} value={this.state.password}/>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-3">
                            <label htmlFor="reschedulePings">Reschedule Pings?</label>
                            <div className="checkbox">
                                <label>
                                    <input name="reschedulePings" checked={this.state.reschedulePings}
                                    onChange={this.onCheckBoxValueChange}
                                    type="checkbox"/> {this.state.reschedulePings==true? <span>Yes</span>:<span>No</span>}
                                </label>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-3">
                            <label htmlFor="queueQoSZero">Queue outgoing QoS zero messages?</label>
                            <div className="checkbox">
                                <label>
                                    <input name="queueQoSZero" checked={this.state.queueQoSZero}
                                    onChange={this.onCheckBoxValueChange}
                                    type="checkbox"/> {this.state.queueQoSZero==true? <span>Yes</span>:<span>No</span>}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-6 col-md-3">
                            <div className="form-group">
                                <label htmlFor="reconnectPeriod">Reconnect Period (milliseconds)</label>
                                <input type="number" className="form-control" name="reconnectPeriod"
                                placeholder="Reconnect Period" onChange={this.onTargetValueChange} value={this.state.reconnectPeriod}/>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-3">
                            <div className="form-group">
                                <label htmlFor="connectTimeout">Connect Timeout (milliseconds)</label>
                                <input type="number" className="form-control" name="connectTimeout"
                                placeholder="Connect Timeout" onChange={this.onTargetValueChange} value={this.state.connectTimeout}/>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-3">
                            <div className="form-group">
                                <label htmlFor="keepalive">KeepAlive (seconds)</label>
                                <input type="number" className="form-control" name="keepalive"
                                placeholder="KeepAlive" onChange={this.onTargetValueChange} value={this.state.keepalive}/>
                            </div>
                        </div>
                    </div>
                    <div style={{marginBottom:10}} className="row">
                        <div className="col-xs-12 col-sm-6 col-md-3">
                            <div className="form-group">
                                <label htmlFor="willTopic">Will - Topic</label>
                                <input type="text" className="form-control" name="willTopic"
                                placeholder="Will - Topic" onChange={this.onTargetValueChange} value={this.state.willTopic}/>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-3">
                            <label htmlFor="willQos">Will - QoS</label>
                            <select name="willQos" onChange={this.onTargetValueChange} value={this.state.willQos}
                                className="form-control">
                                <option value="0">0 - Almost Once</option>
                                <option value="1">1 - Atleast Once</option>
                                <option value="2">2 - Exactly Once</option>
                            </select>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-3">
                            <label htmlFor="willRetain">Will - Retain</label>
                            <div className="checkbox">
                                <label>
                                    <input name="willRetain" checked={this.state.willRetain}
                                        onChange={this.onCheckBoxValueChange}
                                        type="checkbox"/> {this.state.willRetain==true? <span>Yes</span>:<span>No</span>}
                                </label>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-3">
                            <label htmlFor="willPayload">Will - Payload</label>
                            <textarea name="willPayload" onChange={this.onTargetValueChange} value={this.state.willPayload} className="form-control" rows="2"></textarea>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-offset-3 col-xs-12 col-sm-6 col-md-3">
                            <button style={styles.actionButton} onClick={this.saveMqttClientSettings} type="button" className="btn btn-primary">Save</button>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-3">
                            {deleteButton}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddEditMqttClient;
