import React from 'react';

import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import Clear from 'material-ui/svg-icons/content/clear';
import * as Colors from 'material-ui/styles/colors.js';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardHeader, CardText} from 'material-ui/Card';

import BrokerSettingsAction from '../actions/BrokerSettingsAction';
import AppConstants from '../utils/AppConstants';
import SubscriberForm from './SubscriberForm';
import BrokerConnectionStore from '../stores/BrokerConnectionStore';

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
        this.state = {isSubscribed:false,receivedMessages:[]}
    }

    onRemoveSubscriberButtonClick() {
        BrokerSettingsAction.onRemoveSubscriberButtonClick(this.props.bsId,this.props.subscriberSettings.subId);
    }

    onSubscribedDataReceived(data) {
        if(data!=null && this.props.bsId == data.bsId && this.props.subscriberSettings.subId == data.subId) {
            this.setState({isSubscribed:data.isSubscribed, receivedMessages:data.receivedMessages});
        }
    }

    unSubscribeTopic() {
        BrokerSettingsAction.unSubscribeTopic(this.props.bsId,this.props.subscriberSettings.topic,this.props.subscriberSettings.subId);
    }

    componentDidMount() {
        BrokerConnectionStore.addChangeListener(AppConstants.EVENT_SUBSCRIBER_DATA,this.onSubscribedDataReceived);
    }

    componentWillUnmount() {
        BrokerConnectionStore.removeChangeListener(AppConstants.EVENT_SUBSCRIBER_DATA,this.onSubscribedDataReceived);
    }

    render() {
        var component ='';
        if(this.state.isSubscribed!=true || !this.props.subscriberSettings.topic || this.props.subscriberSettings.topic.trim().length<=0) {
            component = <SubscriberForm subscriberSettings = {this.props.subscriberSettings} bsId={this.props.bsId}></SubscriberForm>;
        } else {
            var messageList = [];
            if(this.state.receivedMessages!=null && this.state.receivedMessages.length>0) {
                var len = this.state.receivedMessages.length;

                for (var i=len-1; i>=0;i--) {
                  messageList.push(
                    <Card key={i}>
                        <CardHeader actAsExpander={true} showExpandableButton={true} title={this.state.receivedMessages[i].message}/>
                        <CardText expandable={true}>
                          {
                            <div>
                                <div><b>qos</b> : {this.state.receivedMessages[i].packet.qos}</div>
                                <div><b>retain</b> : {this.state.receivedMessages[i].packet.retain.toString()}</div>
                                <div><b>cmd</b> : {this.state.receivedMessages[i].packet.cmd}</div>
                                <div><b>dup</b> : {this.state.receivedMessages[i].packet.dup.toString()}</div>
                                <div><b>topic</b> : {this.state.receivedMessages[i].packet.topic}</div>
                                <div><b>messageId</b> : {this.state.receivedMessages[i].packet.messageId}</div>
                                <div><b>length</b> : {this.state.receivedMessages[i].packet.length}</div>
                                <div style={style.packetMessage}><b>payload</b>:{this.state.receivedMessages[i].packet.payload}</div>
                            </div>
                          }
                        </CardText>
                    </Card>);
                }
            }

            component = <div>
                            <div>
                                <RaisedButton style={style.unSubscribe} onTouchTap={this.unSubscribeTopic} fullWidth={true}
                                  labelStyle={style.subscribedButton}  label={this.props.subscriberSettings.topic} primary={true}/>
                            </div>
                            <div>
                                {messageList}
                            </div>
                        </div>
        }

        return (
            <Paper style={style.subscriberPaper} zDepth={4}>
                {component}
                { this.state.isSubscribed !=true ?
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
