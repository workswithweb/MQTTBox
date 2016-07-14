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

import MqttLoadResultView from './MqttLoadResultView';
import AppActions from '../../actions/AppActions';
import MqttLoadSettings from '../../models/MqttLoadSettings';
import PublisherSettings from '../../models/PublisherSettings';
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

class MqttLoadView extends React.Component {

    constructor(props) {
        super(props);
        this.onShowHideMenuClick = this.onShowHideMenuClick.bind(this);
        this.handleExpandChange = this.handleExpandChange.bind(this);
        this.initMqttLoadObj = this.initMqttLoadObj.bind(this);
        this.onTargetValueChange = this.onTargetValueChange.bind(this);
        this.onTargetValueChangeForPrimeUser = this.onTargetValueChangeForPrimeUser.bind(this);
        this.onTargetValueChangeForInnerObj = this.onTargetValueChangeForInnerObj.bind(this);
        this.onSelectFieldValueChange = this.onSelectFieldValueChange.bind(this);
        this.onSelectFieldValueChangeForInnerObj = this.onSelectFieldValueChangeForInnerObj.bind(this);
        this.saveMqttLoadSettings = this.saveMqttLoadSettings.bind(this);
        this.deleteMqttLoadSettings = this.deleteMqttLoadSettings.bind(this);
        this.startMqttLoad = this.startMqttLoad.bind(this);
        this.onLoadTestResultsChange = this.onLoadTestResultsChange.bind(this);
        this.initMqttLoadObj(this.props.params);
    }

    onShowHideMenuClick() {
        AppActions.showHideMenu(true);
    }

    handleExpandChange(expanded) {
        this.setState({expanded: expanded});
    }

    initMqttLoadObj(params) {
        if(params.bsId!=null && params.bsId.trim().length>0) {
            var expanded = true;
            var mqttLoadSettings = MqttLoadSettingsService.getMqttLoadSettingsDataByBsId(params.bsId);
            if(mqttLoadSettings!=null && mqttLoadSettings.instanceIds!=null && mqttLoadSettings.instanceIds.length>0) {
                expanded = false;
            }
            this.state = {expanded:expanded,mqttLoadSettings:mqttLoadSettings};
        } else {
            var mqttLoadSettings = new MqttLoadSettings();
            mqttLoadSettings.publishSettings = [new PublisherSettings()];
            mqttLoadSettings.publishSettings[0].qos =1;
            mqttLoadSettings.host = 'localhost:8080'
            this.state = {mqttLoadSettings:mqttLoadSettings,expanded: true};
        }
    }

    onTargetValueChange(event) {
        var newState = this.state.mqttLoadSettings;
        newState[event.target.name] = event.target.value;
        this.setState({mqttLoadSettings:newState});
    }

    onTargetValueChangeForPrimeUser(event) {
        if(false) { // check if prime user
            var newState = this.state.mqttLoadSettings;
            newState[event.target.name] = event.target.value;
            this.setState({mqttLoadSettings:newState});
        } else {
            AppActions.showUserMessage({message:AppConstants.PRIME_USER_CHANGE});
        }
    }

    onTargetValueChangeForInnerObj(objType,name,event) {
        var newState = this.state.mqttLoadSettings;
        newState[objType][0][name] = event.target.value;
        this.setState({mqttLoadSettings:newState});
    }

    onSelectFieldValueChange(name,event, index, value) {
        var newState = this.state.mqttLoadSettings;
        newState[name] = value;
        this.setState({mqttLoadSettings:newState});
        this.saveMqttLoadSettings();
    }

    onSelectFieldValueChangeForInnerObj(objType,name,event, index, value) {
        var newState = this.state.mqttLoadSettings;
        newState[objType][0][name] = value;
        this.setState({mqttLoadSettings:newState});
        this.saveMqttLoadSettings();
    }

    saveMqttLoadSettings() {
        if(this.state.mqttLoadSettings!=null &&
            this.state.mqttLoadSettings.brokerName!=null &&
            this.state.mqttLoadSettings.brokerName.trim().length>0) {
                AppActions.saveMqttLoadSettings(this.state.mqttLoadSettings);
        }
    }

    deleteMqttLoadSettings() {
        AppActions.deleteMqttLoadSettings(this.state.mqttLoadSettings.bsId);
        AppActions.showUserMessage({message:'MQTT Load deleted successfully'});
    }

    onLoadTestResultsChange(data) {
        console.log('onLoadTestResultsChange = ',data);
    }

    startMqttLoad() {
        if(this.state.mqttLoadSettings!=null) {
            if(this.state.mqttLoadSettings.brokerName==null || this.state.mqttLoadSettings.brokerName.trim().length<1) {
                AppActions.showUserMessage({message:'Please enter valid name'});
            } else if(this.state.mqttLoadSettings.host==null || this.state.mqttLoadSettings.host.trim().length<1) {
                AppActions.showUserMessage({message:'Please enter valid host'});
            } else if(this.state.mqttLoadSettings.msgPerSecond==null|| Number.isNaN(this.state.mqttLoadSettings.msgPerSecond) || this.state.mqttLoadSettings.msgPerSecond<0) {
                AppActions.showUserMessage({message:'Please enter valid number of messages to send per second'});
            } else if(this.state.mqttLoadSettings.runTime==null|| Number.isNaN(this.state.mqttLoadSettings.runTime) || this.state.mqttLoadSettings.runTime<0) {
                AppActions.showUserMessage({message:'Please enter valid run time in seconds'});
            } else if(this.state.mqttLoadSettings.timeOut==null|| Number.isNaN(this.state.mqttLoadSettings.timeOut) || this.state.mqttLoadSettings.timeOut<0) {
                AppActions.showUserMessage({message:'Please enter valid time out in seconds'});
            } else if(this.state.mqttLoadSettings.instanceCount==null|| Number.isNaN(this.state.mqttLoadSettings.instanceCount) || this.state.mqttLoadSettings.instanceCount<0) {
                AppActions.showUserMessage({message:'Please enter valid number of instances'});
            } else if(this.state.mqttLoadSettings.publishSettings==null|| this.state.mqttLoadSettings.publishSettings[0] ==null ||
                this.state.mqttLoadSettings.publishSettings[0].topic==null || this.state.mqttLoadSettings.publishSettings[0].topic.trim().length<=0) {
                AppActions.showUserMessage({message:'Please enter valid topic name'});
            } else if(this.state.mqttLoadSettings.publishSettings[0].topic.indexOf('#') > -1 || this.state.mqttLoadSettings.publishSettings[0].topic.indexOf('+') > -1) {
                AppActions.showUserMessage({message:'You cannot publish message to topic having + or #'});
            } else {
                AppActions.startLoadTesting(this.state.mqttLoadSettings);
                this.handleExpandChange(false);
            }
        } else {
            AppActions.showUserMessage({message:'Please Enter Valid Load Settings'});
        }
    }

    componentWillReceiveProps(nextProps) {
        this.initMqttLoadObj(nextProps.params);
    }

    componentDidMount() {
        MqttLoadSettingsService.addChangeListener(AppConstants.EVENT_MQTT_LOAD_TEST_RESULT_CHANGED,this.onLoadTestResultsChange);
    }

    componentWillUnmount() {
        MqttLoadSettingsService.removeChangeListener(AppConstants.EVENT_MQTT_LOAD_TEST_RESULT_CHANGED,this.onLoadTestResultsChange);
    }

    render() {
        var removeButton = '';
        if(this.state.mqttLoadSettings!=null && this.state.mqttLoadSettings.brokerName!=null && this.state.mqttLoadSettings.brokerName.length>0) {
            removeButton = <RaisedButton onTouchTap={this.deleteMqttLoadSettings} secondary={true} label='Remove'/>
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
                    <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
                        <CardHeader style={style.headerStyle}
                          title= {this.state.mqttLoadSettings.brokerName + '  '+ this.state.mqttLoadSettings.host}
                          actAsExpander={true}
                          showExpandableButton={true}
                        />
                        <CardText expandable={true}>
                            <Table selectable={false}>
                                <TableBody displayRowCheckbox={false}>
                                    <TableRow displayBorder={false}>
                                        <TableRowColumn>
                                            <TextField onBlur={this.saveMqttLoadSettings} name="brokerName" onChange={this.onTargetValueChange} value={this.state.mqttLoadSettings.brokerName} hintText='Name' floatingLabelText='Name'/>
                                        </TableRowColumn>
                                        <TableRowColumn>
                                            <SelectField name="protocol" onChange={this.onSelectFieldValueChange.bind(this,"protocol")} value={this.state.mqttLoadSettings.protocol} floatingLabelText='Protocol'>
                                                <MenuItem key={'ws'} value={'ws'} primaryText='ws'/>
                                            </SelectField>
                                        </TableRowColumn>
                                        <TableRowColumn>
                                            <TextField onBlur={this.saveMqttLoadSettings} name="host" onChange={this.onTargetValueChange} value={this.state.mqttLoadSettings.host} hintText='Host' floatingLabelText='Host'/>
                                        </TableRowColumn>
                                        <TableRowColumn>
                                            <SelectField name="loadType" onChange={this.onSelectFieldValueChange.bind(this,"loadType")}  value={this.state.mqttLoadSettings.loadType} floatingLabelText='Load Type'>
                                                <MenuItem value="publish" primaryText='Publish'/>
                                                <MenuItem value="subscribe" primaryText='Subscribe'/>
                                            </SelectField>
                                        </TableRowColumn>
                                    </TableRow>
                                    <TableRow displayBorder={false}>
                                        <TableRowColumn>
                                            <TextField onBlur={this.saveMqttLoadSettings} name="msgPerSecond" type='number' onChange={this.onTargetValueChangeForPrimeUser} value={this.state.mqttLoadSettings.msgPerSecond} hintText='Messages Published/Second/Instance' floatingLabelText='Messages/Second/Instance'/>
                                        </TableRowColumn>
                                        <TableRowColumn>
                                            <TextField onBlur={this.saveMqttLoadSettings} name="runTime" type='number' onChange={this.onTargetValueChangeForPrimeUser} value={this.state.mqttLoadSettings.runTime} hintText='Run Time In Seconds/Instance' floatingLabelText='Run Time/Instance (in Seconds)'/>
                                        </TableRowColumn>
                                        <TableRowColumn>
                                            <TextField onBlur={this.saveMqttLoadSettings} name="timeOut" type='number' onChange={this.onTargetValueChangeForPrimeUser} value={this.state.mqttLoadSettings.timeOut} hintText='Time Out In Seconds/Instance' floatingLabelText='Time Out/Instance (in Seconds)'/>
                                        </TableRowColumn>
                                        <TableRowColumn>
                                            <TextField onBlur={this.saveMqttLoadSettings} name="instanceCount" type='number' onChange={this.onTargetValueChangeForPrimeUser} value={this.state.mqttLoadSettings.instanceCount} hintText='# of instances to run' floatingLabelText='# of instances'/>
                                        </TableRowColumn>
                                    </TableRow>
                                    <TableRow displayBorder={false}>
                                        <TableRowColumn>
                                            <TextField onBlur={this.saveMqttLoadSettings} onChange={this.onTargetValueChangeForInnerObj.bind(this,'publishSettings','topic')} value={this.state.mqttLoadSettings.publishSettings[0].topic} hintText='Topic Name' floatingLabelText='Topic'/>
                                        </TableRowColumn>
                                        <TableRowColumn>
                                            <SelectField onChange={this.onSelectFieldValueChangeForInnerObj.bind(this,'publishSettings','qos')}  value={this.state.mqttLoadSettings.publishSettings[0].qos} floatingLabelText='QoS'>
                                                <MenuItem value={0} primaryText='0 - Almost Once'/>
                                                <MenuItem value={1} primaryText='1 - Atleast Once'/>
                                                <MenuItem value={2} primaryText='2 - Exactly Once'/>
                                            </SelectField>
                                        </TableRowColumn>
                                        <TableRowColumn colSpan="2">
                                            <TextField onBlur={this.saveMqttLoadSettings} value={this.state.mqttLoadSettings.publishSettings[0].payload} onChange={this.onTargetValueChangeForInnerObj.bind(this,'publishSettings','payload')} multiLine={true} rows={2} fullWidth={true} hintText='Payload' floatingLabelText='Payload'/>
                                        </TableRowColumn>
                                    </TableRow>
                                    <TableRow displayBorder={false}>
                                        <TableRowColumn></TableRowColumn>
                                        <TableRowColumn>
                                            <RaisedButton onTouchTap={this.startMqttLoad} label='Start Load' primary={true}/>
                                        </TableRowColumn>
                                        <TableRowColumn></TableRowColumn>
                                        <TableRowColumn>
                                            {removeButton}
                                        </TableRowColumn>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardText>
                    </Card>
                </Paper>
                <MqttLoadResultView bsId={this.state.mqttLoadSettings.bsId}></MqttLoadResultView>
            </div>
        );
    }
}

export default MqttLoadView;