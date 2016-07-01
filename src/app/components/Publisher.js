import React from 'react';
import _ from 'lodash';
import CopyToClipboard from 'react-copy-to-clipboard';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import * as Colors from 'material-ui/styles/colors.js';
import IconButton from 'material-ui/IconButton';
import Clear from 'material-ui/svg-icons/content/clear';
import ContentCopy from 'material-ui/svg-icons/content/content-copy';
import Reply from 'material-ui/svg-icons/content/reply-all';
import {Card, CardHeader, CardText} from 'material-ui/Card';

import AppActions from '../actions/AppActions';
import BrokerConnectionService from '../services/BrokerConnectionService';
import AppConstants from '../utils/AppConstants';

const style = {
    publisherPaper: {
        height: '100%',
        width: '100%',
        display: 'inline-block',
        border: '1px solid #f57f17',
        padding:10,
        overflow: 'auto'
    },
    removeStyle:{
        position: 'absolute',
        right: '2px',
        top: 0,
        cursor: 'pointer'
    },
    smallIcon: {
        width: 15,
        height: 15,
    },
    small: {
        width: 15,
        height:15,
        padding: 5,
        marginRight: 10,
    }
};

class Publisher extends React.Component {

    constructor(props) {
        super(props);
        this.onTopicChange = this.onTopicChange.bind(this);
        this.onQosChange = this.onQosChange.bind(this);
        this.onRetainChange = this.onRetainChange.bind(this);
        this.onPayloadChange = this.onPayloadChange.bind(this);
        this.onRemovePublisherButtonClick = this.onRemovePublisherButtonClick.bind(this);
        this.savePublisherSettings = this.savePublisherSettings.bind(this);

        this.publishMessage = this.publishMessage.bind(this);
        this.rePublishMessage = this.rePublishMessage.bind(this);
        this.publishMessageToBroker = this.publishMessageToBroker.bind(this);

        this.state = {
            qos:this.props.publisherSettings.qos,
            topic:this.props.publisherSettings.topic,
            retain:this.props.publisherSettings.retain,
            payload:this.props.publisherSettings.payload,
            publishedMessages: _.clone(BrokerConnectionService.getPublishedMessages(this.props.bsId,this.props.publisherSettings.pubId))
        }
    }

    onTopicChange(event) {
        this.setState({topic:event.target.value});
    }

    onQosChange(event, index, value) {
        this.setState({qos:value});
        //on blur not working for SelectField so saving here as workaround
        var pubSettings = {pubId: this.props.publisherSettings.pubId,
                           topic: this.state.topic,
                           qos: value,
                           retain: this.state.retain,
                           payload: this.state.payload};
        AppActions.onAddPublisherButtonClick({bsId:this.props.bsId,publisher:pubSettings});
    }

    onRetainChange(event) {
        this.setState({retain:event.target.checked});
    }

    onPayloadChange(event) {
        this.setState({payload:event.target.value});
    }

    onRemovePublisherButtonClick() {
        AppActions.onRemovePublisherButtonClick({bsId:this.props.bsId,pubId:this.props.publisherSettings.pubId});
    }

    savePublisherSettings() {
        var pubSettings = {pubId: this.props.publisherSettings.pubId,
                           topic: this.state.topic,
                           qos: this.state.qos,
                           retain: this.state.retain,
                           payload: this.state.payload};
        AppActions.onAddPublisherButtonClick({bsId:this.props.bsId,publisher:pubSettings});
    }

    publishMessageToBroker(topic,payload,qos,retain) {
        if(BrokerConnectionService.getBrokerState(this.props.bsId)==AppConstants.ONLINE) {
            if(topic.indexOf('#') > -1 || topic.indexOf('+') > -1) {
               AppActions.showUserMessage({message:'You cannot publish message to topic having + or #'});
            } else {
                AppActions.publishMessage({bsId:this.props.bsId,pubId:this.props.publisherSettings.pubId,
                topic:topic,payload:payload,options:{qos:qos,retain:retain}});

                var publishedMessages = this.state.publishedMessages;
                publishedMessages.push({topic:topic,
                                        payload:payload,
                                        qos:qos,
                                        retain:retain});

                if(publishedMessages.length>10) {
                    publishedMessages.shift();
                }
                this.setState({publishedMessages:publishedMessages});
                return true;
            }
        } else {
            AppActions.showUserMessage({message:'Client is not connected to broker. Please check your broker settings'});
            return false;
        }
    }

    rePublishMessage(topic,payload,qos,retain) {
        if(this.publishMessageToBroker(topic,payload,qos,retain)) {
            AppActions.showUserMessage({message:'Message republished successfully',autoHideDuration:1000});
        }
    }

    publishMessage() {
        if(this.state.topic!=null && this.state.topic.length>0) {
            this.publishMessageToBroker(this.state.topic,this.state.payload,this.state.qos,this.state.retain);
        } else {
            AppActions.showUserMessage({message:'Please enter topic name to publish message'});
        }
    }

    onPayloadCopy() {
        AppActions.showUserMessage({message:'Copied',autoHideDuration:2000});
    }

    render() {
        var messageList = [];
        if(this.state.publishedMessages!=null && this.state.publishedMessages.length>0) {
            var len = this.state.publishedMessages.length;
            for (var i=len-1; i>=0;i--) {
              messageList.push(
                <Card key={this.props.publisherSettings.pubId+i}>
                    <CardText>
                        <div>
                            <div>
                                {this.state.publishedMessages[i].payload}
                            </div>
                            <div>
                                <b>topic</b>:{this.state.publishedMessages[i].topic},
                                <b> qos</b>:{this.state.publishedMessages[i].qos},
                                <b> retain</b>:{this.state.publishedMessages[i].retain.toString()}
                             </div>
                             <div>
                                <CopyToClipboard onCopy={this.onPayloadCopy} text={this.state.publishedMessages[i].payload}>
                                    <IconButton iconStyle={style.smallIcon} style={style.small}
                                        tooltipPosition="top-center" tooltip="Copy payload">
                                        <ContentCopy/>
                                    </IconButton>
                                </CopyToClipboard>

                                <IconButton iconStyle={style.smallIcon} style={style.small}
                                    onTouchTap={this.rePublishMessage.bind(this,this.state.publishedMessages[i].topic,
                                                                                this.state.publishedMessages[i].payload,
                                                                                this.state.publishedMessages[i].qos,
                                                                                this.state.publishedMessages[i].retain)}
                                    tooltipPosition="top-center" tooltip="Republish">
                                    <Reply/>
                                </IconButton>
                             </div>
                         </div>
                    </CardText>
                </Card>);
            }
        }

        return (
            <Paper style={style.publisherPaper} zDepth={4}>
                <div>
                    <TextField onChange={this.onTopicChange} onBlur={this.savePublisherSettings}  value={this.state.topic} fullWidth={true} hintText="Topic to publish" floatingLabelText="Topic to publish"/>
                    <SelectField onChange={this.onQosChange} fullWidth={true} value={this.state.qos} floatingLabelText='QOS'>
                        <MenuItem value={0} primaryText='0 - Almost Once'/>
                        <MenuItem value={1} primaryText='1 - Atleast Once'/>
                        <MenuItem value={2} primaryText='2 - Exactly Once'/>
                    </SelectField>
                    <Checkbox onBlur={this.savePublisherSettings} defaultChecked={this.state.retain} onCheck={this.onRetainChange} label='Retain'/>
                    <TextField onBlur={this.savePublisherSettings} value={this.state.payload} onChange={this.onPayloadChange} multiLine={true} rows={2} fullWidth={true} hintText='Payload' floatingLabelText='Payload'/>
                    <RaisedButton label='Publish' onTouchTap={this.publishMessage} primary={true}/>
                </div>
                <div>
                    <span className="remove" style={style.removeStyle}>
                        <IconButton onTouchTap={this.onRemovePublisherButtonClick} tooltipPosition="top-center" tooltip="Remove">
                            <Clear  color={Colors.yellow900}/>
                        </IconButton>
                    </span>
                </div>
                <div>
                    {messageList}
                </div>
            </Paper>
        );
    }
}

export default Publisher;
