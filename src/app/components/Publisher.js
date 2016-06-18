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

import BrokerSettingsAction from '../actions/BrokerSettingsAction';
import BrokerConnectionStore from '../stores/BrokerConnectionStore';
import AppConstants from '../utils/AppConstants';
import CommonActions from '../actions/CommonActions';

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
        this.setPublisherData = this.setPublisherData.bind(this);
        this.rePublishMessage = this.rePublishMessage.bind(this);
        this.publishMessageToBroker = this.publishMessageToBroker.bind(this);

        this.state = {
            qos:this.props.publisherSettings.qos,
            topic:this.props.publisherSettings.topic,
            retain:this.props.publisherSettings.retain,
            payload:this.props.publisherSettings.payload,
            publishedMessages: []
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
        BrokerSettingsAction.onAddPublisherButtonClick(this.props.bsId,pubSettings);
    }

    onRetainChange(event) {
        this.setState({retain:event.target.checked});
    }

    onPayloadChange(event) {
        this.setState({payload:event.target.value});
    }

    onRemovePublisherButtonClick() {
        BrokerSettingsAction.onRemovePublisherButtonClick(this.props.bsId,this.props.publisherSettings.pubId);
    }

    savePublisherSettings() {
        var pubSettings = {pubId: this.props.publisherSettings.pubId,
                           topic: this.state.topic,
                           qos: this.state.qos,
                           retain: this.state.retain,
                           payload: this.state.payload};
        BrokerSettingsAction.onAddPublisherButtonClick(this.props.bsId,pubSettings);
    }

    publishMessageToBroker(topic,payload,qos,retain) {
        if(BrokerConnectionStore.isBrokerConnected(this.props.bsId)) {
            BrokerSettingsAction.publishMessage(this.props.bsId,this.props.publisherSettings.pubId,
            topic,payload,{qos:qos,retain:retain});

            var publishedMessages = this.state.publishedMessages;
            publishedMessages.push({topic:topic,
                                    payload:payload,
                                    qos:qos,
                                    retain:retain});

            if(publishedMessages.length>10) {
                publishedMessages.shift();
            }
            this.setState({publishedMessages:publishedMessages});
        } else {
            CommonActions.showUserMessage({message:'Unable to connect to Broker. Please check your broker settings'});
        }
    }

    rePublishMessage(topic,payload,qos,retain) {
        this.publishMessageToBroker(topic,payload,qos,retain);
        CommonActions.showUserMessage({message:'Re-published successfully',autoHideDuration:1000});
    }

    publishMessage() {
        if(this.state.topic!=null && this.state.topic.length>0) {
            this.publishMessageToBroker(this.state.topic,this.state.payload,this.state.qos,this.state.retain);
        } else {
            CommonActions.showUserMessage({message:'Please enter topic name to publish message'});
        }
    }

    setPublisherData(data) {
        if(data!=null && data.bsId == this.props.bsId && data.pubId == this.props.publisherSettings.pubId) {
            this.setState({publishedMessages:_.clone(data.publishedMessages)});
        }
    }

    onPayloadCopy() {
        CommonActions.showUserMessage({message:'Copied',autoHideDuration:2000});
    }

    componentDidMount() {
        BrokerConnectionStore.addChangeListener(AppConstants.EVENT_PUBLISHER_DATA,this.setPublisherData);
    }

    componentWillUnmount() {
        BrokerConnectionStore.removeChangeListener(AppConstants.EVENT_PUBLISHER_DATA,this.setPublisherData);
    }

    render() {
        var messageList = [];
        if(this.state.publishedMessages!=null && this.state.publishedMessages.length>0) {
            var len = this.state.publishedMessages.length;
            for (var i=len-1; i>=0;i--) {
              messageList.push(
                <Card key={i}>
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
                                    tooltipPosition="top-center" tooltip="Re publish">
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
