import React from 'react';
import Paper from 'material-ui/Paper';
import SubscriberForm from './SubscriberForm';
import IconButton from 'material-ui/IconButton';
import Clear from 'material-ui/svg-icons/content/clear';
import * as Colors from 'material-ui/styles/colors.js';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

import BrokerSettingsAction from '../actions/BrokerSettingsAction';
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
    subscribedHeader:{
        width:'90%'
    },
    packetMessage:{
        wordWrap: 'break-word'
    }
};

class Subscriber extends React.Component {

    constructor(props) {
        super(props);
        this.onRemoveSubscriberButtonClick = this.onRemoveSubscriberButtonClick.bind(this);
        this.onSubscribedForMessages = this.onSubscribedForMessages.bind(this);
        this.onUnsubscribedForMessages = this.onUnsubscribedForMessages.bind(this);
        this.onSubscribedMessageReceived = this.onSubscribedMessageReceived.bind(this);

        this.state = {isSubscribed:false,recievedMessages:[]}
    }

    onRemoveSubscriberButtonClick() {
        BrokerSettingsAction.onRemoveSubscriberButtonClick(this.props.bsId,this.props.subscriberSettings.subId);
    }

    onSubscribedForMessages(isSubscribed) {
        this.setState({isSubscribed:isSubscribed});
        if(isSubscribed===true) {
            BrokerConnectionFactory.getConnection(this.props.bsId).addChangeListener(AppConstants.BROKER_MESSAGE+this.props.bsId+'_'+
                                this.props.subscriberSettings.topic,this.onSubscribedMessageReceived);
            this.setState({recievedMessages:[]});
        } else {
            BrokerConnectionFactory.getConnection(this.props.bsId).removeChangeListener(AppConstants.BROKER_MESSAGE+this.props.bsId+'_'+
                this.props.subscriberSettings.topic,this.onSubscribedMessageReceived);
        }

    }

    onUnsubscribedForMessages() {
        BrokerSettingsAction.unSubscribeTopic(this.props.bsId,this.props.subscriberSettings.topic,this.props.subscriberSettings.subId);
    }

    onSubscribedMessageReceived(message,packet) {
        var recievedMessages = this.state.recievedMessages;
        recievedMessages.push({message:message.toString(),packet:packet});
        this.setState({recievedMessages:recievedMessages});
    }

    render() {
        console.log('render Subscriber');
        var component ='';
        if(this.state.isSubscribed!=true || !this.props.subscriberSettings.topic || this.props.subscriberSettings.topic.trim().length<=0) {
            component = <SubscriberForm subscriberSettings = {this.props.subscriberSettings} bsId={this.props.bsId}></SubscriberForm>;
        } else {
            var messageList = [];
            if(this.state.recievedMessages!=null && this.state.recievedMessages.length>0) {
                var len = this.state.recievedMessages.length;

                for (var i=len-1; i>=0;i--) {
                  messageList.push(
                    <Card key={i}>
                        <CardHeader actAsExpander={true} showExpandableButton={true} title={this.state.recievedMessages[i].message}/>
                        <CardText expandable={true}>
                          {
                            <div>
                                <div><b>qos</b> : {this.state.recievedMessages[i].packet.qos}</div>
                                <div><b>retain</b> : {this.state.recievedMessages[i].packet.retain}</div>
                                <div><b>cmd</b> : {this.state.recievedMessages[i].packet.cmd}</div>
                                <div><b>dup</b> : {this.state.recievedMessages[i].packet.dup}</div>
                                <div><b>topic</b> : {this.state.recievedMessages[i].packet.topic}</div>
                                <div><b>messageId</b> : {this.state.recievedMessages[i].packet.messageId}</div>
                                <div><b>length</b> : {this.state.recievedMessages[i].packet.length}</div>
                                <div style={style.packetMessage}><b>payload</b>:{this.state.recievedMessages[i].packet.payload}</div>
                            </div>
                          }
                        </CardText>
                    </Card>);
                }
            }

            component = <div>
                            <div><RaisedButton onTouchTap={this.onUnsubscribedForMessages} fullWidth={true}
                            label={this.props.subscriberSettings.topic} primary={true}/></div>
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
