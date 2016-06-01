import React from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import * as Colors from 'material-ui/styles/colors.js';
import IconButton from 'material-ui/IconButton';
import Clear from 'material-ui/svg-icons/content/clear';
import Divider from 'material-ui/Divider';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import Forward from 'material-ui/svg-icons/content/forward';

import BrokerSettingsAction from '../actions/BrokerSettingsAction';

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
    sendButton : {
      marginLeft: 10,
      cursor: 'pointer'
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

    publishMessage() {
        if(BrokerConnectionFactory.isBrokerConnected(this.props.bsId)) {
            BrokerSettingsAction.publishMessage(this.props.bsId,
                        this.state.topic,
                        this.state.payload,
                        {qos:this.state.qos,retain: this.state.retain});

            var publishedMessages = this.state.publishedMessages;
            publishedMessages.push({topic:this.state.topic,
                                    payload:this.state.payload,
                                    qos:this.state.qos,
                                    retain: this.state.retain});
            if(publishedMessages.length>10) {
                publishedMessages.shift();
            }
            this.setState({publishedMessages:publishedMessages});
        } else {
            alert('Broker is not connected. Please check broker settings.');
        }
    }

    render() {
        console.log('render Publisher');
        var messageList = [];
        if(this.state.publishedMessages!=null && this.state.publishedMessages.length>0) {
            var len = this.state.publishedMessages.length;

            for (var i=len-1; i>=0;i--) {
              messageList.push(
                <Card key={i}>
                    <CardHeader subtitle={
                        <div>
                            <div style={{color: Colors.darkBlack}}>
                                {this.state.publishedMessages[i].topic}
                            </div>
                            <div>
                                {this.state.publishedMessages[i].payload}
                            </div>
                            <div>
                                qos:{this.state.publishedMessages[i].qos} ,
                                retain:{this.state.publishedMessages[i].retain}
                             </div>
                         </div>}
                    />
                </Card>);
            }
        }


        return (
            <Paper style={style.publisherPaper} zDepth={4}>
                <div>
                    <TextField onChange={this.onTopicChange} onBlur={this.savePublisherSettings}  value={this.state.topic} fullWidth={true} hintText="Topic to publish" floatingLabelText="Topic to publish"/>
                    <SelectField onBlur={this.savePublisherSettings} onChange={this.onQosChange} fullWidth={true} value={this.state.qos} floatingLabelText='QOS'>
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
