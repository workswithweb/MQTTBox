import React from 'react';

import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import Clear from 'material-ui/svg-icons/content/clear';
import * as Colors from 'material-ui/styles/colors.js';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import AppActions from '../actions/AppActions';
import BrokerConnectionService from '../services/BrokerConnectionService';
import AppConstants from '../utils/AppConstants';

const style = {
    subscriberPaper:{
        height: '100%',
        width: '100%',
        display: 'inline-block',
        border: '1px solid #1976d2',
        padding:10,
        overflow: 'auto'
    },
    removeStyle:{
        position: 'absolute',
        right: '2px',
        top: 0,
        cursor: 'pointer'
    },
    packetMessage:{
        wordWrap: 'break-word'
    },
    unSubscribe:{
        width: '100%'
    },
    subscribedButton:{
        textTransform: 'none'
    }
};

class Subscriber extends React.Component {

    constructor(props) {
        super(props);
        this.onRemoveSubscriberButtonClick = this.onRemoveSubscriberButtonClick.bind(this);
        this.onSubscribedDataReceived = this.onSubscribedDataReceived.bind(this);
        this.unSubscribeTopic = this.unSubscribeTopic.bind(this);

        this.onTopicChange = this.onTopicChange.bind(this);
        this.onQosChange = this.onQosChange.bind(this);
        this.subscribeToTopic = this.subscribeToTopic.bind(this);
        this.saveSubscriberSettings = this.saveSubscriberSettings.bind(this);

        this.state = {
            qos:this.props.subscriberSettings.qos,
            topic:this.props.subscriberSettings.topic,
            updated:+(new Date())
        }
    }

    onRemoveSubscriberButtonClick() {
        AppActions.onRemoveSubscriberButtonClick({bsId:this.props.bsId,subId:this.props.subscriberSettings.subId});
    }

    onSubscribedDataReceived(data) {
        if(data!=null && this.props.bsId == data.bsId && this.props.subscriberSettings.subId == data.subId) {
            this.setState({updated:+(new Date())});
        }
    }

    unSubscribeTopic() {
        AppActions.unSubscribeTopic({bsId:this.props.bsId,subId:this.props.subscriberSettings.subId,topic:this.state.topic});
    }

    onTopicChange(event) {
        this.setState({topic:event.target.value});
    }

    onQosChange(event, index, value) {
        this.setState({qos:value});
        //on blur not working for SelectField so saving here as workaround
        var subSettings = {subId: this.props.subscriberSettings.subId,
                           topic: this.state.topic,
                           qos: value};
        AppActions.onAddSubscriberButtonClick({bsId:this.props.bsId,subscriber:subSettings});
    }

    subscribeToTopic() {
        //check for online
        if(BrokerConnectionService.getBrokerState(this.props.bsId)==AppConstants.ONLINE) {
            if(this.state.topic!=null && this.state.topic.trim().length>0) {
                AppActions.subscribeToTopic({bsId:this.props.bsId,subId:this.props.subscriberSettings.subId,
                            topic:this.state.topic,
                            options:{qos:this.state.qos}});
            } else {
                AppActions.showUserMessage({message:'Please enter valid topic to subscribe'});
            }
        } else {
            AppActions.showUserMessage({message:'Client is not connected to broker. Please check your broker settings'});
        }
    }

    saveSubscriberSettings() {
        var subSettings = {subId: this.props.subscriberSettings.subId,
                           topic: this.state.topic,
                           qos: this.state.qos};
        AppActions.onAddSubscriberButtonClick({bsId:this.props.bsId,subscriber:subSettings});
    }

    componentDidMount() {
        BrokerConnectionService.addChangeListener(AppConstants.EVENT_SUBSCRIBER_DATA,this.onSubscribedDataReceived);
    }

    componentWillUnmount() {
        BrokerConnectionService.removeChangeListener(AppConstants.EVENT_SUBSCRIBER_DATA,this.onSubscribedDataReceived);
    }

    render() {
        var subData =BrokerConnectionService.getSubscriberData(this.props.bsId,this.props.subscriberSettings.subId);
        var component ='';
        if(subData.isSubscribed!=true || !this.state.topic || this.state.topic.trim().length<=0) {
        component = <div>
                        <TextField onBlur={this.saveSubscriberSettings} onChange={this.onTopicChange} fullWidth={true} value={this.state.topic} hintText="Topic to publish" floatingLabelText="Topic to subscribe"/>
                        <SelectField onChange={this.onQosChange} value={this.state.qos} fullWidth={true} floatingLabelText='QOS'>
                            <MenuItem value={0} primaryText='0 - Almost Once'/>
                            <MenuItem value={1} primaryText='1 - Atleast Once'/>
                            <MenuItem value={2} primaryText='2 - Exactly Once'/>
                        </SelectField>
                        <RaisedButton onTouchTap={this.subscribeToTopic} label='Subscribe' primary={true}/>
                    </div>;
        } else {
            var messageList = [];
            if(subData.receivedMessages!=null && subData.receivedMessages.length>0) {
                var len = subData.receivedMessages.length;

                for (var i=len-1; i>=0;i--) {
                  messageList.push(
                    <Card key={this.props.subscriberSettings.subId+i}>
                        <CardHeader actAsExpander={true} showExpandableButton={true} title={subData.receivedMessages[i].message}/>
                        <CardText expandable={true}>
                          {
                            <div>
                                <div><b>qos</b> : {subData.receivedMessages[i].packet.qos}</div>
                                <div><b>retain</b> : {subData.receivedMessages[i].packet.retain.toString()}</div>
                                <div><b>cmd</b> : {subData.receivedMessages[i].packet.cmd}</div>
                                <div><b>dup</b> : {subData.receivedMessages[i].packet.dup.toString()}</div>
                                <div><b>topic</b> : {subData.receivedMessages[i].packet.topic}</div>
                                <div><b>messageId</b> : {subData.receivedMessages[i].packet.messageId}</div>
                                <div><b>length</b> : {subData.receivedMessages[i].packet.length}</div>
                                <div style={style.packetMessage}><b>raw payload</b> : {subData.receivedMessages[i].packet.payload}</div>
                            </div>
                          }
                        </CardText>
                    </Card>);
                }
            }

            component = <div>
                            <div>
                                <RaisedButton style={style.unSubscribe} onTouchTap={this.unSubscribeTopic} fullWidth={true}
                                  labelStyle={style.subscribedButton}  label={this.state.topic} primary={true}/>
                            </div>
                            <div>
                                {messageList}
                            </div>
                        </div>
        }

        return (
            <Paper style={style.subscriberPaper} zDepth={4}>
                {component}
                { subData.isSubscribed !=true ?
                    <div>
                       <span className="remove" style={style.removeStyle}>
                           <IconButton onTouchTap={this.onRemoveSubscriberButtonClick} tooltipPosition="top-center" tooltip="Remove">
                               <Clear color={Colors.blue700}/>
                           </IconButton>
                       </span>
                    </div> : null
                }
            </Paper>
        );
    }
}

export default Subscriber;
