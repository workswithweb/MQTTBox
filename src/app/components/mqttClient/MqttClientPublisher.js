import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import _ from 'lodash';

import MqttClientActions from '../../actions/MqttClientActions';
import MqttClientService from '../../services/MqttClientService';
import CommonActions from '../../actions/CommonActions';
import MqttClientConstants from '../../utils/MqttClientConstants';
import CommonConstants from '../../utils/CommonConstants';

const style = {
    publisherPaper: {
        height: '500px',
        width: '100%',
        display: 'inline-block',
        border: '1px solid #1976d2',
        padding:10,
        overflow: 'auto'
    },
    removeStyle:{
        position: 'absolute',
        right: '20px',
        top: 0,
        cursor: 'pointer',
        color:'#1976d2'
    },
    messageIcons:{
        cursor: 'pointer',
        marginRight:10,
        marginLeft:10
    }
};

export default class MqttClientPublisher extends React.Component {

    constructor(props) {
        super(props);

        this.onTargetValueChange = this.onTargetValueChange.bind(this);
        this.onCheckBoxValueChange = this.onCheckBoxValueChange.bind(this);
        this.deletePublisher = this.deletePublisher.bind(this);
        this.publishMessageToBroker = this.publishMessageToBroker.bind(this);
        this.publishMessage = this.publishMessage.bind(this);
        this.rePublishMessage = this.rePublishMessage.bind(this);
        this.onPayloadCopy = this.onPayloadCopy.bind(this);
        this.savePublisherSettings = this.savePublisherSettings.bind(this);

        this.state = {
            qos:this.props.publisherSettings.qos,
            topic:this.props.publisherSettings.topic,
            retain:this.props.publisherSettings.retain,
            payload:this.props.publisherSettings.payload,
            publishedMessages:_.clone(MqttClientService.getPublishedMessages(this.props.mcsId,this.props.publisherSettings.pubId))
        }
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

    deletePublisher() {
        MqttClientActions.deletePublisher({mcsId:this.props.mcsId,pubId:this.props.publisherSettings.pubId});
    }

    publishMessageToBroker(topic,payload,qos,retain) {
        if(this.props.conState==MqttClientConstants.CONNECTION_STATE_CONNECTED) {
            if(topic!=null && topic.trim().length>0) {
                if(topic.indexOf('#') > -1 || topic.indexOf('+') > -1) {
                    CommonActions.showMessageToUser({message:'You cannot publish message to topic having + or #'});
                } else {
                    MqttClientActions.publishMessage(this.props.mcsId,this.props.publisherSettings.pubId,topic,new Buffer(payload,'utf8'),qos,retain);
                    var pubMess = this.state.publishedMessages;
                    if(pubMess==null) {
                        pubMess = [];
                    }
                    pubMess.push({topic:topic,payload:payload,qos:qos,retain:retain});
                    if(pubMess.length>20) {
                        pubMess.shift();
                    }
                    this.setState({publishedMessages:pubMess});
                    return true;
                }
            } else {
                CommonActions.showMessageToUser({message:'Please enter valid topic to subscribe'});
            }
        } else {
            CommonActions.showMessageToUser({message:'MQTT Client is not connected to broker. Please check client settings'});
        }
        return false;
    }

    publishMessage() {
        this.publishMessageToBroker(this.state.topic,this.state.payload,this.state.qos,this.state.retain);
    }

    rePublishMessage(topic,payload,qos,retain) {
        this.publishMessageToBroker(topic,payload,qos,retain);
    }

    onPayloadCopy() {
        CommonActions.showMessageToUser({message:'Copied',type:CommonConstants.ALERT_SUCCESS});
    }

    savePublisherSettings() {
        var pubSettings = {pubId: this.props.publisherSettings.pubId,
                           topic: this.state.topic,
                           qos: this.state.qos,
                           retain: this.state.retain,
                           payload: this.state.payload};
        MqttClientActions.savePublisherSettings({mcsId:this.props.mcsId,publisher:pubSettings});
    }

    render() {
        var messageList = [];
        for(var i=this.state.publishedMessages.length-1;i>=0;i--) {
            var pubMess = this.state.publishedMessages[i];
            messageList.push(<div key={'pub_mess_'+i} className="thumbnail">
                                    <div>{pubMess.payload}</div>
                                    <div>
                                        <span><b>topic:</b>{pubMess.topic},</span>
                                        <span><b> qos:</b>{pubMess.qos},</span>
                                        <span><b> retain:</b>{pubMess.retain.toString()}</span>
                                    </div>
                                    <div>
                                        <CopyToClipboard onCopy={this.onPayloadCopy} text={pubMess.payload}>
                                            <span title="Copy" style={style.messageIcons} className="glyphicon glyphicon-copy" aria-hidden="true"></span>
                                        </CopyToClipboard>
                                        <span onClick={this.rePublishMessage.bind(this,pubMess.topic,pubMess.payload,pubMess.qos,pubMess.retain)} title="Publish again" style={style.messageIcons} className="glyphicon glyphicon-share-alt" aria-hidden="true"></span>
                                    </div>
                                </div>);
        }


        return (
            <div className="col-xs-12 col-sm-6 col-md-4">
                <div style={style.publisherPaper} className="thumbnail">
                    <div className="form-group">
                        <label htmlFor="topic">Topic to publish</label>
                        <input type="text" className="form-control" name="topic"
                            onBlur={this.savePublisherSettings} placeholder="Topic to publish" onChange={this.onTargetValueChange} value={this.state.topic}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="qos">QoS</label>
                        <select onBlur={this.savePublisherSettings} name="qos" onChange={this.onTargetValueChange} value={this.state.qos} className="form-control">
                            <option value="0">0 - Almost Once</option>
                            <option value="1">1 - Atleast Once</option>
                            <option value="2">2 - Exactly Once</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="retain">Retain</label>
                        <div className="checkbox">
                            <label>
                                <input onBlur={this.savePublisherSettings} name="retain" checked={this.state.retain}
                                    onChange={this.onCheckBoxValueChange}
                                    type="checkbox"/> {this.state.retain==true? <span>Yes</span>:<span>No</span>}
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="payload">Payload</label>
                        <textarea name="payload" onBlur={this.savePublisherSettings} onChange={this.onTargetValueChange} value={this.state.payload} className="form-control" rows="5"></textarea>
                    </div>
                    <div className="form-group">
                        <button type="button" onClick={this.publishMessage} className="btn btn-primary">Publish</button>
                    </div>
                    {messageList}
                </div>
                <div>
                    <span onClick={this.deletePublisher} className="remove" style={style.removeStyle}>
                        <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                    </span>
                </div>
            </div>
        );
    }
}