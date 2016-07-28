import React from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Table from 'material-ui/Table';
import TableBody from 'material-ui/Table/TableBody';
import TableRow from 'material-ui/Table/TableRow';
import TableRowColumn from 'material-ui/Table/TableRowColumn';
import IconButton from 'material-ui/IconButton';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import ActionDehaze from 'material-ui/svg-icons/image/dehaze';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import * as Colors from 'material-ui/styles/colors.js';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import AddPayloadIcon from 'material-ui/svg-icons/content/add-circle-outline';

import AppActions from '../../actions/AppActions';
import MqttLoadSettings from '../../models/MqttLoadSettings';
import AppConstants from '../../utils/AppConstants';
import MqttLoadSettingsService from '../../services/MqttLoadSettingsService';

const style = {
    paper: {
        width: '96%',
        margin: 20,
        textAlign: 'center',
        display: 'inline-block'
    },
    headerStyle:{
        fontWeight: 'bold'
    }
};

class AddEditMqttLoadForm extends React.Component {

    constructor(props) {
        super(props);
        this.onShowHideMenuClick = this.onShowHideMenuClick.bind(this);
        this.initMqttLoadObj = this.initMqttLoadObj.bind(this);
        this.onTargetValueChange = this.onTargetValueChange.bind(this);
        this.onSelectFieldValueChange = this.onSelectFieldValueChange.bind(this);
        this.saveMqttLoadSettings = this.saveMqttLoadSettings.bind(this);
        this.deleteMqttLoadSettings = this.deleteMqttLoadSettings.bind(this);
        this.onMqttLoadSettingsSaved = this.onMqttLoadSettingsSaved.bind(this);
        this.addPayload = this.addPayload.bind(this);
        this.onPayloadChange = this.onPayloadChange.bind(this);
        this.removePayload = this.removePayload.bind(this);
        this.initMqttLoadObj(this.props.params);
    }

    onShowHideMenuClick() {
        AppActions.showHideMenu(true);
    }

    initMqttLoadObj(params) {
        if(params!=null && params.bsId!=null && params.bsId.trim().length>0) {
            var loadObj = MqttLoadSettingsService.getMqttLoadSettingsDataByBsId(params.bsId);
            this.state = {mqttLoadSettings:loadObj};
        } else {
            var mqttLoadSettings = new MqttLoadSettings();
            this.state = {mqttLoadSettings:mqttLoadSettings};
        }
    }

    onTargetValueChange(event) {
        var newState = this.state.mqttLoadSettings;
        newState[event.target.name] = event.target.value;
        this.setState({mqttLoadSettings:newState});
    }

    onSelectFieldValueChange(name,event, index, value) {
        var newState = this.state.mqttLoadSettings;
        newState[name] = value;
        this.setState({mqttLoadSettings:newState});
    }

    deleteMqttLoadSettings() {
        AppActions.deleteMqttLoadSettings(this.state.mqttLoadSettings.bsId);
        AppActions.showUserMessage({message:'MQTT Load deleted successfully'});
    }

    saveMqttLoadSettings() {
        if(this.state.mqttLoadSettings!=null) {
            if(this.state.mqttLoadSettings.brokerName==null || this.state.mqttLoadSettings.brokerName.trim().length<1) {
                AppActions.showUserMessage({message:'Please enter valid name'});
            } else if(this.state.mqttLoadSettings.host==null || this.state.mqttLoadSettings.host.trim().length<1) {
                AppActions.showUserMessage({message:'Please enter valid host'});
            } else if(this.state.mqttLoadSettings.msgCount==null|| Number.isNaN(this.state.mqttLoadSettings.msgCount) || this.state.mqttLoadSettings.msgCount<=0) {
                AppActions.showUserMessage({message:'Please enter valid message count'});
            } else if(this.state.mqttLoadSettings.timeOut==null|| Number.isNaN(this.state.mqttLoadSettings.timeOut) || this.state.mqttLoadSettings.timeOut<=0) {
                AppActions.showUserMessage({message:'Please enter valid time out in seconds'});
            } else if(this.state.mqttLoadSettings.instanceCount==null|| Number.isNaN(this.state.mqttLoadSettings.instanceCount) || this.state.mqttLoadSettings.instanceCount<=0) {
                AppActions.showUserMessage({message:'Please enter valid number of instances'});
            } else if(this.state.mqttLoadSettings.instanceCount>6) {
                AppActions.showUserMessage({message:'You cannot add more than 6 instances'});
            } else if(this.state.mqttLoadSettings.topic==null || this.state.mqttLoadSettings.topic.trim().length<=0) {
                AppActions.showUserMessage({message:'Please enter valid topic name'});
            } else if(this.state.mqttLoadSettings.loadType =='publishing') {
                if(this.state.mqttLoadSettings.topic.indexOf('#') > -1 || this.state.mqttLoadSettings.topic.indexOf('+') > -1) {
                    AppActions.showUserMessage({message:'You cannot publish message to topic having + or #'});
                } else if(this.state.mqttLoadSettings.runTime==null|| Number.isNaN(this.state.mqttLoadSettings.runTime) || this.state.mqttLoadSettings.runTime<=0) {
                    AppActions.showUserMessage({message:'Please enter valid run time in seconds'});
                } else if(parseInt(this.state.mqttLoadSettings.timeOut)<=parseInt(this.state.mqttLoadSettings.runTime)) {
                    AppActions.showUserMessage({message:'Timeout should be greater than run time.'});
                } else {
                    AppActions.saveMqttLoadSettings(this.state.mqttLoadSettings);
                }
            } else {
                AppActions.saveMqttLoadSettings(this.state.mqttLoadSettings);
            }
        } else {
            AppActions.showUserMessage({message:'Please Enter Valid Load Settings'});
        }
    }

    onMqttLoadSettingsSaved(bsId) {
        if(bsId!=null && bsId.length>0) {
            var loadObj = MqttLoadSettingsService.getMqttLoadSettingsDataByBsId(bsId);
            if(loadObj!=null && loadObj.bsId!=null) {
                window.location.hash = AppConstants.PAGE_URL_MQTT_LOAD_TEST+bsId;
            } else {
                var list = MqttLoadSettingsService.getAllMqttLoadSettingsData();
                if(list!=null && list.length>0) {
                    window.location.hash = AppConstants.PAGE_URL_MQTT_LOAD_TEST+list[0].bsId;
                } else {
                    window.location.hash = AppConstants.PAGE_URL_ADD_EDIT_MQTT_LOAD;
                }
            }
        }
    }

    addPayload() {
        var newState = this.state.mqttLoadSettings;
        if(newState.payload!=null && newState.payload.length>=10) {
            AppActions.showUserMessage({message:'You can add only 10 payloads'});
        } else {
            newState.payload.push('');
            this.setState({mqttLoadSettings:newState});
        }
    }

    onPayloadChange(index,event) {
        var newState = this.state.mqttLoadSettings;
        newState.payload[index] = event.target.value;
        this.setState({mqttLoadSettings:newState});
    }

    removePayload(index) {
        var newState = this.state.mqttLoadSettings;
        if(newState.payload.length<=1) {
            AppActions.showUserMessage({message:'You cannot delete last payload'});
        } else {
            newState.payload.splice(index,1);
            this.setState({mqttLoadSettings:newState});
        }
    }

    componentWillReceiveProps(nextProps) {
        this.initMqttLoadObj(nextProps.params);
    }

    componentDidMount() {
        MqttLoadSettingsService.addChangeListener(AppConstants.EVENT_MQTT_LOAD_SETTINGS_CHANGED,this.onMqttLoadSettingsSaved);
    }

    componentWillUnmount() {
        MqttLoadSettingsService.removeChangeListener(AppConstants.EVENT_MQTT_LOAD_SETTINGS_CHANGED,this.onMqttLoadSettingsSaved);
    }

    render() {
        var removeButton = '';
        if(this.props.params.bsId!=null) {
            removeButton = <RaisedButton onTouchTap={this.deleteMqttLoadSettings} secondary={true} label='Remove'/>
        }

        var msgCount = '', payload = [],addMultiPayload = '',runTime = '';

        if(this.state.mqttLoadSettings.loadType == 'publishing') {
            msgCount =  <TableRowColumn>
                            <TextField name="msgCount" type='number' onChange={this.onTargetValueChange} value={this.state.mqttLoadSettings.msgCount} hintText='How many messages to publish' floatingLabelText='# of messages to publish'/>
                        </TableRowColumn>

            addMultiPayload = <TableRowColumn>
                                  <IconButton onTouchTap={this.addPayload}>
                                      <AddPayloadIcon/>
                                  </IconButton>
                                   Add payload (each payload is sent sequentially)
                              </TableRowColumn>
            runTime = <TableRowColumn>
                          <TextField name="runTime" type='number' onChange={this.onTargetValueChange} value={this.state.mqttLoadSettings.runTime} hintText='Run time (seconds)' floatingLabelText='Run time (seconds)'/>
                      </TableRowColumn>


            for(var i=0;i<this.state.mqttLoadSettings.payload.length;i++) {
                payload.push(<TableRow key={i+payload} displayBorder={false}>
                                <TableRowColumn colSpan="3">
                                    <TextField value={this.state.mqttLoadSettings.payload[i]} onChange={this.onPayloadChange.bind(this,i)} multiLine={true}  fullWidth={true} hintText='Payload' floatingLabelText='Payload'/>
                                </TableRowColumn>
                                <TableRowColumn>
                                    <IconButton onTouchTap={this.removePayload.bind(this,i)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </TableRowColumn>
                            </TableRow>);
            }
        } else {
            msgCount =  <TableRowColumn>
                            <TextField name="msgCount" type='number' onChange={this.onTargetValueChange} value={this.state.mqttLoadSettings.msgCount} hintText='How many messages to expect' floatingLabelText='# of messages to subscribe'/>
                        </TableRowColumn>
        }

        return (
            <div>
                <Toolbar>
                    <ToolbarGroup firstChild={true}>
                        <IconButton onTouchTap={this.onShowHideMenuClick}>
                            <ActionDehaze/>
                        </IconButton>
                    </ToolbarGroup>
                </Toolbar>

                <Paper style={style.paper} zDepth={2}>
                    <Table selectable={false}>
                        <TableBody displayRowCheckbox={false}>
                            <TableRow displayBorder={false}>
                                <TableRowColumn>
                                    <TextField name="brokerName" onChange={this.onTargetValueChange} value={this.state.mqttLoadSettings.brokerName} hintText='Name' floatingLabelText='Name'/>
                                </TableRowColumn>
                                <TableRowColumn>
                                    <SelectField name="protocol" onChange={this.onSelectFieldValueChange.bind(this,"protocol")} value={this.state.mqttLoadSettings.protocol} floatingLabelText='Protocol'>
                                        <MenuItem key={'ws'} value={'ws'} primaryText='ws'/>
                                    </SelectField>
                                </TableRowColumn>
                                <TableRowColumn>
                                    <TextField name="host" onChange={this.onTargetValueChange} value={this.state.mqttLoadSettings.host} hintText='Host' floatingLabelText='Host'/>
                                </TableRowColumn>
                                <TableRowColumn>
                                    <SelectField name="loadType" onChange={this.onSelectFieldValueChange.bind(this,"loadType")}  value={this.state.mqttLoadSettings.loadType} floatingLabelText='Load Type'>
                                        <MenuItem value="publishing" primaryText='Publish'/>
                                        <MenuItem value="subscribing" primaryText='Subscribe'/>
                                    </SelectField>
                                </TableRowColumn>
                            </TableRow>
                            <TableRow displayBorder={false}>
                                {msgCount}
                                {runTime}
                                <TableRowColumn>
                                    <TextField name="timeOut" type='number' onChange={this.onTargetValueChange} value={this.state.mqttLoadSettings.timeOut} hintText='Time Out (seconds)' floatingLabelText='Time Out (seconds)'/>
                                </TableRowColumn>
                                <TableRowColumn>
                                    <TextField name="instanceCount" type='number' onChange={this.onTargetValueChange} value={this.state.mqttLoadSettings.instanceCount} hintText='# of instances to run' floatingLabelText='# of instances'/>
                                </TableRowColumn>
                            </TableRow>
                            <TableRow displayBorder={false}>
                                <TableRowColumn>
                                    <TextField name="topic" onChange={this.onTargetValueChange} value={this.state.mqttLoadSettings.topic} hintText='Topic Name' floatingLabelText='Topic'/>
                                </TableRowColumn>
                                <TableRowColumn>
                                    <SelectField onChange={this.onSelectFieldValueChange.bind(this,"qos")}  value={this.state.mqttLoadSettings.qos} floatingLabelText='QoS'>
                                        <MenuItem value={0} primaryText='0 - Almost Once'/>
                                        <MenuItem value={1} primaryText='1 - Atleast Once'/>
                                        <MenuItem value={2} primaryText='2 - Exactly Once'/>
                                    </SelectField>
                                </TableRowColumn>
                                {addMultiPayload}
                            </TableRow>
                            {payload}
                            <TableRow displayBorder={false}>
                                <TableRowColumn></TableRowColumn>
                                <TableRowColumn>
                                    <RaisedButton onTouchTap={this.saveMqttLoadSettings} label='Save' primary={true}/>
                                </TableRowColumn>
                                <TableRowColumn>
                                    {removeButton}
                                </TableRowColumn>
                                <TableRowColumn></TableRowColumn>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        );
    }
}

export default AddEditMqttLoadForm;