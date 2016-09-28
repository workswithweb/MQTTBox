import React, {Component} from 'react';

import LeftMenuButton from '../common/LeftMenuButton';
import MqttLoadSettings from '../../models/MqttLoadSettings';
import CommonActions from '../../actions/CommonActions';
import NavUtils from '../../utils/NavUtils';
import MqttLoadActions from '../../actions/MqttLoadActions';
import MqttLoadService from '../../services/MqttLoadService';
import MqttLoadConstants from '../../utils/MqttLoadConstants';
import PlatformConstants from '../../platform/common/PlatformConstants';
import CommonConstants from '../../utils/CommonConstants';

const styles = {
    payload: {
        marginBottom:5
    },
    payloadDelete: {
        marginLeft:5
    },
    actionButton: {
        margin:10
    }
};

class AddEditMqttLoad extends Component {
    constructor(props) {
        super(props);

        this.initMqttLoadObj = this.initMqttLoadObj.bind(this);
        this.onTargetValueChange = this.onTargetValueChange.bind(this);
        this.addPayload = this.addPayload.bind(this);
        this.removePayload = this.removePayload.bind(this);
        this.onPayloadChange = this.onPayloadChange.bind(this);
        this.saveMqttLoadSettings = this.saveMqttLoadSettings.bind(this);
        this.onMqttLoadSettingsSaved = this.onMqttLoadSettingsSaved.bind(this);
        this.deleteMqttLoadSettings = this.deleteMqttLoadSettings.bind(this);

        this.initMqttLoadObj(this.props.params);
    }

    initMqttLoadObj(params) {
        if(params!=null && params.mcsId!=null && params.mcsId.trim().length>0) {
            this.state = MqttLoadService.getMqttLoadSettingsByMcsId(params.mcsId);
        } else {
            this.state = new MqttLoadSettings();
        }
    }

    onTargetValueChange(event) {
        var newState = {};
        newState[event.target.name] = event.target.value;
        this.setState(newState);
    }

    addPayload() {
        var pLoad = this.state.payload;
        if(pLoad!=null && pLoad.length>=50) {
            CommonActions.showMessageToUser({message:'You can add only 50 payloads'});
        } else {
            pLoad.push('');
            this.setState({payload:pLoad});
        }
    }

    removePayload(index) {
        var pLoad = this.state.payload;
        if(pLoad.length<=1) {
            CommonActions.showMessageToUser({message:'You cannot delete last payload'});
        } else {
            pLoad.splice(index,1);
            this.setState({payload:pLoad});
        }
    }

    onPayloadChange(index,event) {
        var pLoad = this.state.payload;
        pLoad[index] = event.target.value;
        this.setState({payload:pLoad});
    }

    saveMqttLoadSettings() {
        if(this.state!=null) {
            if(this.state.mqttClientName==null || this.state.mqttClientName.trim().length<1) {
                CommonActions.showMessageToUser({message:'Please enter valid name'});
            } else if(this.state.host==null || this.state.host.trim().length<1) {
                CommonActions.showMessageToUser({message:'Please enter valid host'});
            } else if(this.state.msgCount==null|| Number.isNaN(this.state.msgCount) || this.state.msgCount<=0) {
                CommonActions.showMessageToUser({message:'Please enter valid message count'});
            } else if(this.state.timeOut==null|| Number.isNaN(this.state.timeOut) || this.state.timeOut<=0) {
                CommonActions.showMessageToUser({message:'Please enter valid time out in seconds'});
            } else if(this.state.instanceCount==null|| Number.isNaN(this.state.instanceCount) || this.state.instanceCount<=0) {
                CommonActions.showMessageToUser({message:'Please enter valid number of instances'});
            } else if(this.state.instanceCount>10) {
                CommonActions.showMessageToUser({message:'You cannot add more than 10 instances'});
            } else if(this.state.topic==null || this.state.topic.trim().length<=0) {
                CommonActions.showMessageToUser({message:'Please enter valid topic name'});
            } else if(this.state.loadTestType =='publishing') {
                if(this.state.topic.indexOf('#') > -1 || this.state.topic.indexOf('+') > -1) {
                    CommonActions.showMessageToUser({message:'You cannot publish message to topic having + or #'});
                } else if(this.state.runTime==null|| Number.isNaN(this.state.runTime) || this.state.runTime<=0) {
                    CommonActions.showMessageToUser({message:'Please enter valid run time in seconds'});
                } else if(parseInt(this.state.timeOut)<=parseInt(this.state.runTime)) {
                    CommonActions.showMessageToUser({message:'Timeout should be greater than run time.'});
                } else {
                    MqttLoadActions.saveMqttLoadSettings(this.state);
                }
            } else {
                MqttLoadActions.saveMqttLoadSettings(this.state);
            }
        } else {
            CommonActions.showMessageToUser({message:'Please Enter Valid Load Settings'});
        }
    }

    onMqttLoadSettingsSaved(mcsId) {
        NavUtils.goToMqttLoadDashboard(mcsId);
    }

    deleteMqttLoadSettings() {
        MqttLoadActions.deleteMqttLoadSettings(this.state.mcsId);
    }

    componentDidMount() {
        MqttLoadService.addChangeListener(MqttLoadConstants.EVENT_MQTT_LOAD_SETTINGS_CHANGED,this.onMqttLoadSettingsSaved);
    }

    componentWillUnmount() {
        MqttLoadService.removeChangeListener(MqttLoadConstants.EVENT_MQTT_LOAD_SETTINGS_CHANGED,this.onMqttLoadSettingsSaved);
    }

    render() {
        var msgCount = '',runTime = '',addMultiPayload = '',payloadCmp = '',payload = [],deleteButton = '',backButton = '';

        if(this.props.params.mcsId!=null) {
            deleteButton = <button style={styles.actionButton} onClick={this.deleteMqttLoadSettings} type="button" className="btn btn-default">Delete</button>;
            backButton = <a href={"#/mqttloaddashboard/"+this.props.params.mcsId} className="navButton"><b><span className="glyphicon glyphicon-arrow-left" aria-hidden="true"></span> BACK</b></a>
        } else {
            backButton = <a href={"#/mqttloadlist"} className="navButton"><b><span className="glyphicon glyphicon-arrow-left" aria-hidden="true"></span> BACK</b></a>
        }

        if(this.state.loadTestType == 'publishing') {

            msgCount = <div className="col-xs-12 col-sm-6 col-md-3">
                            <div className="form-group">
                                <label htmlFor="msgCount"># of messages to publish</label>
                                <input type="number" className="form-control" name="msgCount"
                                placeholder="# of messages to publish" onChange={this.onTargetValueChange} value={this.state.msgCount}/>
                            </div>
                        </div>

            runTime =   <div className="col-xs-12 col-sm-6 col-md-3">
                            <div className="form-group">
                                <label htmlFor="runTime">Run time (seconds)</label>
                                <input type="number" className="form-control" name="runTime"
                                    placeholder="Run time (seconds)" onChange={this.onTargetValueChange} value={this.state.runTime}/>
                            </div>
                        </div>

        addMultiPayload =<div className="col-xs-12 col-sm-6 col-md-3">
                             <div className="form-group">
                                 <label>Add payload</label>
                                 <div>
                                     <button onClick={this.addPayload} type="button" className="btn btn-default">
                                         <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
                                     </button>
                                      &nbsp;Each payload is sent sequentially
                                 </div>
                             </div>
                         </div>

            for(var i=0;i<this.state.payload.length;i++) {
                payload.push(<div key={'payload_'+i} className="form-inline">
                             <textarea rows="2" cols="100" style={styles.payload} type="text" className="form-control"
                                 onChange={this.onPayloadChange.bind(this,i)} value={this.state.payload[i]}/>
                             <button onClick={this.removePayload.bind(this,i)} style={styles.payloadDelete} type="button" className="btn btn-default">
                                 <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
                             </button>
                         </div>);
            }

            var payloadCmp = <div className="row">
                                 <div className="col-md-12">
                                     <div className="form-group">
                                         <label>Payload</label>
                                         {payload}
                                     </div>
                                 </div>
                             </div>
        } else {
            msgCount = <div className="col-xs-12 col-sm-6 col-md-3">
                            <div className="form-group">
                                <label htmlFor="msgCount"># of messages to subscribe</label>
                                <input type="number" className="form-control" name="msgCount"
                                placeholder="# of messages to subscribe" onChange={this.onTargetValueChange} value={this.state.msgCount}/>
                            </div>
                        </div>
        }

        var supportedProtocols = [];
        supportedProtocols.push(<option key="ws" value="ws">ws</option>);
        supportedProtocols.push(<option key="wss" value="wss">wss</option>);
        if(PlatformConstants.PLATFORM_TYPE == CommonConstants.PLATFORM_CHROME_APP) {
            supportedProtocols.push(<option key="tcp" value="tcp">tcp</option>);
            supportedProtocols.push(<option key="mqtt" value="mqtt">mqtt</option>);
        } else if(PlatformConstants.PLATFORM_TYPE == CommonConstants.PLATFORM_ELECTRON_APP) {
            supportedProtocols.push(<option key="tcp" value="tcp">tcp</option>);
            supportedProtocols.push(<option key="tls" value="tls">tls</option>);
            supportedProtocols.push(<option key="mqtt" value="mqtt">mqtt</option>);
            supportedProtocols.push(<option key="mqtts" value="mqtts">mqtt</option>);
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
                                <label htmlFor="mqttClientName">Load Test Name</label>
                                <input type="text" className="form-control" name="mqttClientName"
                                placeholder="Load Test Name" onChange={this.onTargetValueChange} value={this.state.mqttClientName}/>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-3">
                            <label htmlFor="protocol">Protocol</label>
                            <select name="protocol" onChange={this.onTargetValueChange} value={this.state.protocol}
                                className="form-control">
                                {supportedProtocols}
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
                            <label htmlFor="loadTestType">Load Test Type</label>
                            <select name="loadTestType" onChange={this.onTargetValueChange} value={this.state.loadTestType}
                                className="form-control">
                                <option value="publishing">Publish Load Test</option>
                                <option value="subscribing">Subscribe Load Test</option>
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        {msgCount}
                        {runTime}
                        <div className="col-xs-12 col-sm-6 col-md-3">
                            <div className="form-group">
                                <label htmlFor="timeOut">Time Out (seconds)</label>
                                <input type="number" className="form-control" name="timeOut"
                                placeholder="Time Out (seconds)" onChange={this.onTargetValueChange} value={this.state.timeOut}/>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-3">
                            <div className="form-group">
                                <label htmlFor="instanceCount"># of instances to run</label>
                                <input type="number" className="form-control" name="instanceCount"
                                placeholder="# of instances to run" onChange={this.onTargetValueChange} value={this.state.instanceCount}/>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-6 col-md-3">
                            <div className="form-group">
                                <label htmlFor="topic">Topic</label>
                                <input type="text" className="form-control" name="topic"
                                placeholder="Topic" onChange={this.onTargetValueChange} value={this.state.topic}/>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-3">
                            <label htmlFor="qos">QoS</label>
                            <select name="qos" onChange={this.onTargetValueChange} value={this.state.qos}
                                className="form-control">
                                <option value="0">0 - Almost Once</option>
                                <option value="1">1 - Atleast Once</option>
                                <option value="2">2 - Exactly Once</option>
                            </select>
                        </div>
                        {addMultiPayload}
                    </div>
                    {payloadCmp}
                    <div className="row">
                        <div className="col-md-offset-3 col-xs-12 col-sm-6 col-md-3">
                            <button style={styles.actionButton} onClick={this.saveMqttLoadSettings} type="button" className="btn btn-danger">Save</button>
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

export default AddEditMqttLoad;
