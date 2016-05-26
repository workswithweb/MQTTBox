import React from 'react';
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
import UUID from 'node-uuid';

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
        this.onBrokerNameChange = this.onBrokerNameChange.bind(this);
        this.onClientIdChange = this.onClientIdChange.bind(this);
        this.generateClientId = this.generateClientId.bind(this);
        this.onMqtt311CompliantChange = this.onMqtt311CompliantChange.bind(this);
        this.onProtocolChange = this.onProtocolChange.bind(this);
        this.onHostChange = this.onHostChange.bind(this);
        this.onCleanSessionChange = this.onCleanSessionChange.bind(this);
        this.onUserNameChange = this.onUserNameChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.onQueueQoSZeroChange = this.onQueueQoSZeroChange.bind(this);
        this.onReconnectPeriodChange = this.onReconnectPeriodChange.bind(this);
        this.onConnectTimeoutChange = this.onConnectTimeoutChange.bind(this);
        this.onKeepAliveChange = this.onKeepAliveChange.bind(this);
        this.onWillTopicChange = this.onWillTopicChange.bind(this);
        this.onWillQosChange = this.onWillQosChange.bind(this);
        this.onWillRetainChange = this.onWillRetainChange.bind(this);
        this.onWillPayloadChange = this.onWillPayloadChange.bind(this);
        this.saveBrokerSettings = this.saveBrokerSettings.bind(this);
        this.deleteBrokerSettings = this.deleteBrokerSettings.bind(this);
        this.loadBrokerSettings = this.loadBrokerSettings.bind(this);
        this.state = {
            brokerName:'',
            clientId:''

        };
    }

    onBrokerNameChange(event) {
        this.setState({brokerName:event.target.value});
    }

    onClientIdChange(event) {
        var newState = update(this.state,{mqttObj: {clientId: {$set:event.target.value}}});
        this.setState(newState);
    }

    generateClientId() {
        var newState = update(this.state,{mqttObj: {clientId: { $set: UUID.v4() }}});
        this.setState(newState);
    }

    onMqtt311CompliantChange(event) {
        var newState = update(this.state,{mqttObj: {mqtt311Compliant: {$set:true},protocolId: {$set:'MQTT'},protocolVersion: {$set:4}}});
        if(event.target.checked === false) {
            newState = update(this.state,{mqttObj: {mqtt311Compliant: {$set:false},protocolId: {$set:'MQIsdp'}, protocolVersion: {$set:3}}});
        }
        this.setState(newState);
    }

    onProtocolChange(event, index, value) {
        var newState = update(this.state,{mqttObj:{protocol:{$set:value}}});
        this.setState(newState);
    }

    onHostChange(event) {
        var newState = update(this.state,{mqttObj: {host: {$set:event.target.value}}});
        this.setState(newState);
    }

    onCleanSessionChange(event) {
        var newState = update(this.state,{mqttObj: {clean: {$set:event.target.checked}}});
        this.setState(newState);
    }

    onQueueQoSZeroChange(event) {
        var newState = update(this.state,{mqttObj: {queueQoSZero: {$set:event.target.checked}}});
        this.setState(newState);
    }

    onUserNameChange(event) {
        var newState = update(this.state,{mqttObj: {username: {$set:event.target.value}}});
        this.setState(newState);
    }

    onPasswordChange(event) {
        var newState = update(this.state,{mqttObj: {password: {$set:event.target.value}}});
        this.setState(newState);
    }

    onKeepAliveChange(event) {
        var newState = update(this.state,{mqttObj: {keepalive: {$set:event.target.value}}});
        this.setState(newState);
    }

    onReconnectPeriodChange(event) {
        var newState = update(this.state,{mqttObj: {reconnectPeriod: {$set:event.target.value}}});
        this.setState(newState);
    }

    onConnectTimeoutChange(event) {
        var newState = update(this.state,{mqttObj: {connectTimeout: {$set:event.target.value}}});
        this.setState(newState);
    }

    onWillTopicChange(event) {
        var newState = update(this.state,{mqttObj:{will:{topic:{$set:event.target.value}}}});
        this.setState(newState);
    }

    onWillPayloadChange(event) {
        var newState = update(this.state,{mqttObj:{will:{payload:{$set:event.target.value}}}});
        this.setState(newState);
    }

    onWillQosChange(event, index, value) {
        var newState = update(this.state,{mqttObj:{will:{qos:{$set:value}}}});
        this.setState(newState);
    }

    onWillRetainChange(event) {
        var newState = update(this.state,{mqttObj:{will:{retain:{$set:event.target.checked}}}});
        this.setState(newState);
    }

    loadBrokerSettings(bsId) {

    }

    saveBrokerSettings() {
        if(this.state.mqttObj!=null) {
            if(this.state.mqttObj.brokerName==null||this.state.mqttObj.brokerName.trim().length<1||this.state.mqttObj.brokerName.trim().length>500) {
                alert('Please enter valid Broker Name');
            } else if(this.state.mqttObj.clientId==null||this.state.mqttObj.clientId.trim().length<1||this.state.mqttObj.clientId.trim().length>500) {
                alert('Please enter valid Client Id');
            } else if(this.state.mqttObj.host==null||this.state.mqttObj.host.trim().length<1||this.state.mqttObj.host.trim().length>10000) {
                alert('Please enter valid Host');
            } else if(this.state.mqttObj.reconnectPeriod==null|| Number.isNaN(this.state.mqttObj.reconnectPeriod)) {
                alert('Please enter valid Reconnect Period');
            } else if(this.state.mqttObj.connectTimeout==null|| Number.isNaN(this.state.mqttObj.connectTimeout)) {
                alert('Please enter valid Connect Timeout');
            } else if(this.state.mqttObj.keepalive==null|| Number.isNaN(this.state.mqttObj.keepalive)) {
                alert('Please enter valid Keep Alive value');
            } else {
                //BrokerSettingsAction.saveBrokerSettings(this.state.mqttObj);
            }
        } else {
            alert('Please enter valid broker settings.');
        }
    }

    deleteBrokerSettings() {
        //BrokerSettingsAction.deleteBrokerSettingsById(this.state.mqttObj.bsId);
    }

    render() {
        return (
            <div>
                <Paper style={style.paper} zDepth={2}>
                    <Table selectable={false}>
                        <TableBody displayRowCheckbox={false}>
                            <TableRow displayBorder={false}>
                                <TableRowColumn>
                                    <TextField onChange={this.onBrokerNameChange} value={this.state.brokerName} fullWidth={true} hintText='MQTT Broker Name' floatingLabelText='MQTT Broker Name'/>
                                </TableRowColumn>
                                <TableRowColumn>
                                    <TextField onChange={this.onClientIdChange} value={this.state.mqttObj.clientId}  hintText='Client Id' floatingLabelText='Client Id'/>
                                    <IconButton onTouchTap={this.generateClientId} tooltipPosition="top-center" tooltip='Generate new Client Id'>
                                      <Autorenew/>
                                    </IconButton>
                                </TableRowColumn>
                                <TableRowColumn>
                                    <Checkbox defaultChecked={this.state.mqttObj.mqtt311Compliant} onCheck={this.onMqtt311CompliantChange} label='Broker is MQTT v3.1.1 compliant'/>
                                </TableRowColumn>
                            </TableRow>
                            <TableRow displayBorder={false}>
                                <TableRowColumn>
                                    <SelectField onChange={this.onProtocolChange} fullWidth={true} value={this.state.mqttObj.protocol} floatingLabelText='Protocol'>
                                        <MenuItem value={'tcp'} primaryText='tcp'/>
                                        <MenuItem value={'ws'} primaryText='ws'/>
                                        <MenuItem value={'wss'} primaryText='wss'/>
                                        <MenuItem value={'mqtt'} primaryText='mqtt'/>
                                        <MenuItem value={'mqtts'} primaryText='mqtts'/>
                                    </SelectField>
                                </TableRowColumn>
                                <TableRowColumn>
                                    <TextField onChange={this.onHostChange} value={this.state.mqttObj.host} fullWidth={true} hintText='Host' floatingLabelText='Host'/>
                                </TableRowColumn>
                                <TableRowColumn>
                                    <Checkbox defaultChecked={this.state.mqttObj.clean} onCheck={this.onCleanSessionChange} label='Clean Session'/>
                                </TableRowColumn>
                            </TableRow>
                            <TableRow displayBorder={false}>
                                <TableRowColumn>
                                    <TextField onChange={this.onUserNameChange} value={this.state.mqttObj.username} fullWidth={true} hintText='Username' floatingLabelText='Username'/>
                                </TableRowColumn>
                                <TableRowColumn>
                                    <TextField type='password' onChange={this.onPasswordChange} value={this.state.mqttObj.password} fullWidth={true} hintText='Password' floatingLabelText='Password'/>
                                </TableRowColumn>
                                <TableRowColumn>
                                    <Checkbox defaultChecked={this.state.mqttObj.queueQoSZero} onCheck={this.onQueueQoSZeroChange} label='Queue outgoing QoS zero messages'/>
                                </TableRowColumn>
                            </TableRow>
                            <TableRow displayBorder={false}>
                                <TableRowColumn>
                                    <TextField type='number' onChange={this.onReconnectPeriodChange} value={this.state.mqttObj.reconnectPeriod} hintText='Reconnect Period' floatingLabelText='Reconnect Period'/><span>milliseconds</span>
                                </TableRowColumn>
                                <TableRowColumn>
                                    <TextField type='number' onChange={this.onConnectTimeoutChange} value={this.state.mqttObj.connectTimeout} hintText='Connect Timeout' floatingLabelText='Connect Timeout'/><span>milliseconds</span>
                                </TableRowColumn>
                                <TableRowColumn>
                                    <TextField type='number' onChange={this.onKeepAliveChange} value={this.state.mqttObj.keepalive} hintText='KeepAlive' floatingLabelText='KeepAlive'/><span>seconds</span>
                                </TableRowColumn>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <Card>
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
                                          <TextField onChange={this.onWillTopicChange} fullWidth={true} value={this.state.mqttObj.will.topic} hintText='Topic' floatingLabelText='Topic'/>
                                      </TableRowColumn>
                                      <TableRowColumn>
                                          <SelectField onChange={this.onWillQosChange} fullWidth={true} value={this.state.mqttObj.will.qos} floatingLabelText='QOS'>
                                              <MenuItem value={0} primaryText='0 - Almost Once'/>
                                              <MenuItem value={1} primaryText='1 - Atleast Once'/>
                                              <MenuItem value={2} primaryText='2 - Exactly Once'/>
                                          </SelectField>
                                      </TableRowColumn>
                                      <TableRowColumn>
                                            <Checkbox defaultChecked={this.state.mqttObj.will.retain} onCheck={this.onWillRetainChange} label='Retain'/>
                                      </TableRowColumn>
                                  </TableRow>
                                  <TableRow displayBorder={false}>
                                      <TableRowColumn>
                                          <TextField onChange={this.onWillPayloadChange} value={this.state.mqttObj.will.payload} multiLine={true} rows={2} fullWidth={true} hintText='Payload' floatingLabelText='Payload'/>
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
                                <TableRowColumn>
                                    <RaisedButton onTouchTap={this.deleteBrokerSettings} secondary={true} label='Remove'/>
                                </TableRowColumn>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        );
  }
}

export default AddEditBrokerForm;
