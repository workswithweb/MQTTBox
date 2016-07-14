import React from 'react';
import UUID from 'node-uuid';

import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import Table from 'material-ui/Table';
import TableBody from 'material-ui/Table/TableBody';
import TableRow from 'material-ui/Table/TableRow';
import TableRowColumn from 'material-ui/Table/TableRowColumn';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import Autorenew from 'material-ui/svg-icons/action/autorenew';
import Card from 'material-ui/Card/Card';
import CardActions from 'material-ui/Card/CardActions';
import CardHeader from 'material-ui/Card/CardHeader';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import ActionDehaze from 'material-ui/svg-icons/image/dehaze';

import BrokerSettings from '../models/BrokerSettings';
import AppConstants from '../utils/AppConstants';
import AppActions from '../actions/AppActions';
import BrokerSettingsService from '../services/BrokerSettingsService';

const style = {
    paper: {
        width: '96%',
        margin: 20,
        textAlign: 'center',
        display: 'inline-block'
    }
};

class AddEditBrokerForm extends React.Component {

    constructor(props) {
        super(props);

        this.initBrokerObj = this.initBrokerObj.bind(this);
        this.onShowHideMenuClick = this.onShowHideMenuClick.bind(this);
        this.onTargetValueChange = this.onTargetValueChange.bind(this);
        this.onCheckBoxValueChange = this.onCheckBoxValueChange.bind(this);
        this.generateClientId = this.generateClientId.bind(this);
        this.onMqtt311CompliantChange = this.onMqtt311CompliantChange.bind(this);
        this.onProtocolValueChange = this.onProtocolValueChange.bind(this);
        this.onWillQosValueChange = this.onWillQosValueChange.bind(this);

        this.saveBrokerSettings = this.saveBrokerSettings.bind(this);
        this.onBrokerSettingsSaved = this.onBrokerSettingsSaved.bind(this);
        this.deleteBrokerSettings = this.deleteBrokerSettings.bind(this);

        this.initBrokerObj(this.props.params);
    }

    initBrokerObj(params) {
        if(params!=null && params.bsId!=null && params.bsId.trim().length>0) {
            this.state = BrokerSettingsService.getBrokerSettingDataByBsId(params.bsId);
        } else {
            this.state = new BrokerSettings();
        }
    }

    onShowHideMenuClick() {
        AppActions.showHideMenu(true);
    }

    onTargetValueChange(event) {
        var newState = {};
        newState[event.target.name] = event.target.value;
        this.setState(newState);
    }

    onCheckBoxValueChange(event) {
        var newState = {};
        newState[event.target.name] = event.target.checked;
        this.setState(newState);
    }

    generateClientId() {
        this.setState({clientId:UUID.v4()});
    }

    onMqtt311CompliantChange(event) {
        var newState = {mqtt311Compliant:true,protocolId:'MQTT',protocolVersion:4};
        if(event.target.checked === false) {
            newState = {mqtt311Compliant:false,protocolId:'MQIsdp',protocolVersion:3};
        }
        this.setState(newState);
    }

    onProtocolValueChange(event, index, value) {
        this.setState({protocol:value});
    }

    onWillQosValueChange(event, index, value) {
        this.setState({willQos:value});
    }

    saveBrokerSettings() {
        if(this.state!=null) {
            if(this.state.brokerName==null||this.state.brokerName.trim().length<1||this.state.brokerName.trim().length>500) {
                AppActions.showUserMessage({message:'Please enter broker name'});
            } else if(this.state.clientId==null||this.state.clientId.trim().length<1||this.state.clientId.trim().length>500) {
                AppActions.showUserMessage({message:'Please enter client id'});
            } else if(this.state.host==null||this.state.host.trim().length<1||this.state.host.trim().length>10000) {
                AppActions.showUserMessage({message:'Please enter host'});
            } else if(this.state.reconnectPeriod==null|| Number.isNaN(this.state.reconnectPeriod) || this.state.reconnectPeriod<=0) {
                AppActions.showUserMessage({message:'Please enter valid reconnect period'});
            } else if(this.state.connectTimeout==null|| Number.isNaN(this.state.connectTimeout) || this.state.connectTimeout<=0) {
                AppActions.showUserMessage({message:'Please enter valid connect timeout'});
            } else if(this.state.keepalive==null|| Number.isNaN(this.state.keepalive) || this.state.keepalive<=0) {
                AppActions.showUserMessage({message:'Please enter valid keep alive'});
            } else if(this.state.willTopic!=null && this.state.willTopic.trim().length>0 &&
            (this.state.willTopic.indexOf('#') > -1 || this.state.willTopic.indexOf('+') > -1)) {
                AppActions.showUserMessage({message:'Please enter valid "will topic". Should not contain + or #'});
            } else {
                AppActions.saveBrokerSettings(this.state);
            }
        } else {
            AppActions.showUserMessage({message:'Please Enter Valid Broker Settings'});
        }
    }

    onBrokerSettingsSaved(bsId) {
        var bsObj = BrokerSettingsService.getBrokerSettingDataByBsId(bsId);
        if(bsObj!=null && bsObj.bsId!=null) {
            window.location.hash = AppConstants.PAGE_URL_CLIENT_CONNECTION_DETAILS+bsId;
        } else {
            var list = BrokerSettingsService.getAllBrokerSettingData();
            if(list!=null && list.length>0) {
                window.location.hash = AppConstants.PAGE_URL_CLIENT_CONNECTION_DETAILS+list[0].bsId;
            } else {
                window.location.hash = AppConstants.PAGE_URL_ADD_EDIT_CLIENT_BROKER_SETTINGS;
            }
        }
    }

    deleteBrokerSettings() {
        AppActions.deleteBrokerSettings(this.props.params.bsId);
        AppActions.showUserMessage({message:'Client '+this.state.brokerName+' Deleted.'});
        this.setState(new BrokerSettings());
    }

    componentDidMount() {
        BrokerSettingsService.addChangeListener(AppConstants.EVENT_BROKER_SETTINGS_CHANGED,this.onBrokerSettingsSaved);
    }

    componentWillUnmount() {
        BrokerSettingsService.removeChangeListener(AppConstants.EVENT_BROKER_SETTINGS_CHANGED,this.onBrokerSettingsSaved);
    }

    componentWillReceiveProps(nextProps) {
        this.initBrokerObj(nextProps.params);
    }

    render() {
        var protocolSupported = [<MenuItem key={'ws'} value={'ws'} primaryText='ws'/>];
        if(AppConstants.isChromeApp()) {
            protocolSupported.push(<MenuItem key={'tcp'} value={'tcp'} primaryText='tcp'/>);
            protocolSupported.push(<MenuItem key={'mqtt'} value={'mqtt'} primaryText='mqtt'/>);
        }

        var showWillSettings = false;
        if((this.state.willTopic!=null && this.state.willTopic.trim().length>0) ||
            (this.state.willRetain!=null && this.state.willRetain==true) ||
            (this.state.willPayload!=null && this.state.willPayload.trim().length>0) ||
            (this.state.willQos!=null && this.state.willQos>0)) {
            showWillSettings = true;
        }

        var removeButton = '';
        if(this.props.params.bsId!=null) {
            removeButton = <TableRowColumn>
                               <RaisedButton onTouchTap={this.deleteBrokerSettings} secondary={true} label='Remove'/>
                           </TableRowColumn>;
        }

        return (
            <div>
                <Toolbar>
                    <ToolbarGroup>
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
                                    <TextField name="brokerName" onChange={this.onTargetValueChange} value={this.state.brokerName} hintText='Name' floatingLabelText='Name'/>
                                </TableRowColumn>
                                <TableRowColumn>
                                    <TextField name="clientId" onChange={this.onTargetValueChange} value={this.state.clientId}  hintText='Client Id' floatingLabelText='Client Id'/>
                                    <IconButton onTouchTap={this.generateClientId} tooltipPosition="top-center" tooltip='Generate new Client Id'>
                                      <Autorenew/>
                                    </IconButton>
                                </TableRowColumn>
                                <TableRowColumn>
                                    <Checkbox name="onMqtt311CompliantChange" defaultChecked={this.state.mqtt311Compliant} onCheck={this.onMqtt311CompliantChange} label='Broker is MQTT v3.1.1 compliant'/>
                                </TableRowColumn>
                            </TableRow>
                            <TableRow displayBorder={false}>
                                <TableRowColumn>
                                    <SelectField name="protocol" onChange={this.onProtocolValueChange} value={this.state.protocol} floatingLabelText='Protocol'>
                                        {protocolSupported}
                                    </SelectField>
                                </TableRowColumn>
                                <TableRowColumn>
                                    <TextField name="host" onChange={this.onTargetValueChange} value={this.state.host} hintText='Host' floatingLabelText='Host'/>
                                </TableRowColumn>
                                <TableRowColumn>
                                    <Checkbox name="clean" defaultChecked={this.state.clean} onCheck={this.onCheckBoxValueChange} label='Clean Session'/>
                                </TableRowColumn>
                            </TableRow>
                            <TableRow displayBorder={false}>
                                <TableRowColumn>
                                    <TextField name="username" onChange={this.onTargetValueChange} value={this.state.username} hintText='Username' floatingLabelText='Username'/>
                                </TableRowColumn>
                                <TableRowColumn>
                                    <TextField name="password" type='password' onChange={this.onTargetValueChange} value={this.state.password} hintText='Password' floatingLabelText='Password'/>
                                </TableRowColumn>
                                <TableRowColumn>
                                    <Checkbox name="queueQoSZero" defaultChecked={this.state.queueQoSZero} onCheck={this.onCheckBoxValueChange} label='Queue outgoing QoS zero messages'/>
                                </TableRowColumn>
                            </TableRow>
                            <TableRow displayBorder={false}>
                                <TableRowColumn>
                                    <TextField name="reconnectPeriod" type='number' onChange={this.onTargetValueChange} value={this.state.reconnectPeriod} hintText='Reconnect Period' floatingLabelText='Reconnect Period'/><span>milliseconds</span>
                                </TableRowColumn>
                                <TableRowColumn>
                                    <TextField name="connectTimeout" type='number' onChange={this.onTargetValueChange} value={this.state.connectTimeout} hintText='Connect Timeout' floatingLabelText='Connect Timeout'/><span>milliseconds</span>
                                </TableRowColumn>
                                <TableRowColumn>
                                    <TextField name="keepalive" type='number' onChange={this.onTargetValueChange} value={this.state.keepalive} hintText='KeepAlive' floatingLabelText='KeepAlive'/><span>seconds</span>
                                </TableRowColumn>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <Card initiallyExpanded ={showWillSettings}>
                        <CardHeader
                          title="Will Settings"
                          actAsExpander={true}
                          showExpandableButton={true}
                        />
                        <CardActions expandable={true}>
                          <Table selectable={false}>
                              <TableBody displayRowCheckbox={false}>
                                  <TableRow displayBorder={false}>
                                      <TableRowColumn>
                                          <TextField name="willTopic" onChange={this.onTargetValueChange}  value={this.state.willTopic} hintText='Topic' floatingLabelText='Topic'/>
                                      </TableRowColumn>
                                      <TableRowColumn>
                                          <SelectField name="willQos" onChange={this.onWillQosValueChange}  value={this.state.willQos} floatingLabelText='QOS'>
                                              <MenuItem value={0} primaryText='0 - Almost Once'/>
                                              <MenuItem value={1} primaryText='1 - Atleast Once'/>
                                              <MenuItem value={2} primaryText='2 - Exactly Once'/>
                                          </SelectField>
                                      </TableRowColumn>
                                      <TableRowColumn>
                                            <Checkbox name="willRetain" defaultChecked={this.state.willRetain} onCheck={this.onCheckBoxValueChange} label='Retain'/>
                                      </TableRowColumn>
                                  </TableRow>
                                  <TableRow displayBorder={false}>
                                      <TableRowColumn>
                                          <TextField name="willPayload" onChange={this.onTargetValueChange} value={this.state.willPayload} multiLine={true} rows={2}  hintText='Payload' floatingLabelText='Payload'/>
                                      </TableRowColumn>
                                  </TableRow>
                              </TableBody>
                          </Table>
                        </CardActions>
                    </Card>
                    <Table selectable={false}>
                        <TableBody displayRowCheckbox={false}>
                            <TableRow displayBorder={false}>
                                <TableRowColumn>
                                    <div></div>
                                </TableRowColumn>
                                <TableRowColumn>
                                    <RaisedButton onTouchTap={this.saveBrokerSettings} label='Save' primary={true}/>
                                </TableRowColumn>
                                {removeButton}
                            </TableRow>
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        );
  }
}

export default AddEditBrokerForm;
