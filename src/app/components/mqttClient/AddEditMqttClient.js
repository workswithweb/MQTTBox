import React, {Component} from 'react';
import UUID from 'node-uuid';

import LeftMenuButton from '../common/LeftMenuButton';
import ExternalLink from '../common/ExternalLink';
import MqttClientSettings from '../../models/MqttClientSettings';
import CommonActions from '../../actions/CommonActions';
import MqttClientActions from '../../actions/MqttClientActions';
import MqttClientService from '../../services/MqttClientService';
import MqttClientConstants from '../../utils/MqttClientConstants';
import NavUtils from '../../utils/NavUtils';
import PlatformConstants from '../../platform/common/PlatformConstants';
import CommonConstants from '../../utils/CommonConstants';

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
        this.onFileValueChange = this.onFileValueChange.bind(this);
        this.generateMqttClientId = this.generateMqttClientId.bind(this);
        this.onMqtt311CompliantChange = this.onMqtt311CompliantChange.bind(this);
        this.onCheckBoxValueChange = this.onCheckBoxValueChange.bind(this);
        this.saveMqttClientSettings = this.saveMqttClientSettings.bind(this);
        this.deleteMqttClientSettings = this.deleteMqttClientSettings.bind(this);
        this.onProtocolValueChange = this.onProtocolValueChange.bind(this);

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

    onProtocolValueChange(event) {
        if(PlatformConstants.PLATFORM_TYPE == CommonConstants.PLATFORM_WEB_APP && (event.target.value=='mqtt' || event.target.value=='mqtts')) {
            CommonActions.showMessageToUser({message:'MQTT over TCP and TLS are supported by MQTTBox apps for Linux, MAC and Windows. Download MQTTBox app from http://workswithweb.com/mqttbox.html'});
        } else if(PlatformConstants.PLATFORM_TYPE == CommonConstants.PLATFORM_CHROME_APP && event.target.value=='mqtts') {
            CommonActions.showMessageToUser({message:'MQTT over TLS is supported by MQTTBox apps for Linux, MAC and Windows. Download MQTTBox app from http://workswithweb.com/mqttbox.html'});
        } else {
            var newState = {};
            newState[event.target.name] = event.target.value;
            this.setState(newState);
        }
    }

    onFileValueChange(event) {
        var files = event.target.files;
        if(files!=null && files.length>0) {
            var reader = new FileReader();
            reader.onload = (function(theFile,targetName) {
                return function(e) {
                    var newState = {};
                    newState[targetName+'Path'] = theFile.name;
                    newState[targetName] = e.target.result;
                    this.setState(newState);
                }.bind(this);
            }.bind(this))(files[0],event.target.name);
            reader.readAsText(files[0]);
        }
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
        var tlsOptions = '';
        var tlsCertOptions = '';

        if(this.props.params.mcsId!=null) {
            deleteButton = <button style={styles.actionButton} onClick={this.deleteMqttClientSettings} type="button" className="btn btn-default">Delete</button>;
            backButton = <a className="btn btn-default" href={"#/mqttclientdashboard/"+this.props.params.mcsId}><span className="glyphicon glyphicon-arrow-left" aria-hidden="true"> </span></a>;
        } else {
            backButton = <a className="btn btn-default" href="#/mqttclientslist"><span className="glyphicon glyphicon-arrow-left" aria-hidden="true"> </span></a>;
        }

        if(this.state.protocol == 'mqtts' || this.state.protocol == 'wss') {
            tlsOptions= <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <div className="form-group">
                                    <label htmlFor="sslTlsVersion">SSL / TLS Version</label>
                                    <select name="sslTlsVersion" onChange={this.onTargetValueChange} value={this.state.sslTlsVersion}
                                        className="form-control">
                                        <option value="auto">Auto</option>
                                        <option value="TLSv1_2_method">TLSv1.2</option>
                                        <option value="TLSv1_1_method">TLSv1.1</option>
                                        <option value="TLSv1_method">TLSv1</option>
                                        <option value="SSLv3_method">SSLv3</option>
                                        <option value="SSLv23_method">SSLv2.3</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <div className="form-group">
                                    <label htmlFor="certificateType">SSL / TLS Certificate Type</label>
                                    <select name="certificateType" onChange={this.onTargetValueChange} value={this.state.certificateType}
                                        className="form-control">
                                        <option value="cssc">CA signed server certificate</option>
                                        <option value="cc">CA certificate only</option>
                                        <option value="ssc">Self signed certificates</option>
                                    </select>
                                </div>
                            </div>
                        </div>;

            if(this.state.certificateType =='ssc') {
                tlsCertOptions =<div className="row">
                                    <div className="col-xs-12 col-sm-6 col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="caFile">CA file</label>
                                            <input type='file' className="form-control" name="caFile" onChange={this.onFileValueChange}/>
                                            <p className="help-block">{this.state.caFilePath}</p>
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-6 col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="clientCertificateFile">Client certificate file</label>
                                            <input type='file' className="form-control" name="clientCertificateFile" onChange={this.onFileValueChange}/>
                                            <p className="help-block">{this.state.clientCertificateFilePath}</p>
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-6 col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="clientKeyFile">Client key file</label>
                                            <input type='file' className="form-control" name="clientKeyFile" onChange={this.onFileValueChange}/>
                                            <p className="help-block">{this.state.clientKeyFilePath}</p>
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-6 col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="clientKeyPassphrase">Client key passphrase</label>
                                            <input type="password" className="form-control" name="clientKeyPassphrase"
                                                onChange={this.onTargetValueChange} value={this.state.clientKeyPassphrase}/>
                                        </div>
                                    </div>
                                </div>;
           } else if(this.state.certificateType =='cc') {
                tlsCertOptions =<div className="row">
                                    <div className="col-xs-12 col-sm-6 col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="caFile">CA file</label>
                                            <input type='file' className="form-control" name="caFile" onChange={this.onFileValueChange}/>
                                            <p className="help-block">{this.state.caFilePath}</p>
                                        </div>
                                    </div>
                                </div>;
            }
        }

        return (
            <div>
                <nav className="navbar navbar-default navbar-fixed-top">
                    <div>
                        <div className="navbar-header">
                            <LeftMenuButton/>
                            {backButton}
                            <span><b> MQTT CLIENT SETTINGS</b></span>
                        </div>
                        <div id="navbar" className="navbar-collapse collapse">
                            <ul style={{marginRight:10}} className="nav navbar-nav navbar-right">
                                <ExternalLink href="http://workswithweb.com/html/mqttbox/mqtt_client_settings.html" displayText="Client Settings Help"></ExternalLink>
                            </ul>
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
                            <select name="protocol" onChange={this.onProtocolValueChange} value={this.state.protocol}
                                className="form-control">
                                <option key="ws" value="ws">ws</option>
                                <option key="wss" value="wss">wss</option>
                                <option key="mqtt" value="mqtt">mqtt / tcp</option>
                                <option key="mqtts" value="mqtts">mqtts / tls</option>
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
                    {tlsOptions}
                    {tlsCertOptions}
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
