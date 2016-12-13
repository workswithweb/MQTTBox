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
        height: '600px',
        width: '100%',
        display: 'inline-block',
        border: '1px solid #1976d2',
        padding:10,
        overflow: 'auto',
        wordBreak:'break-all'
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

        var payloadType = this.props.publisherSettings.payloadType;
        if(payloadType==null || !(payloadType=="0"||payloadType=="2"||payloadType=="8"||payloadType=="10"||payloadType=="16")) {
            payloadType = "0";
        }

        this.state = {
            qos:this.props.publisherSettings.qos,
            topic:this.props.publisherSettings.topic,
            retain:this.props.publisherSettings.retain,
            payload:this.props.publisherSettings.payload,
            payloadType:payloadType,
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

    publishMessageToBroker(topic,payload,qos,retain,payloadType) {
        if(this.props.conState==MqttClientConstants.CONNECTION_STATE_CONNECTED) {
            if(topic!=null && topic.trim().length>0) {
                if(topic.indexOf('#') > -1 || topic.indexOf('+') > -1) {
                    CommonActions.showMessageToUser({message:'You cannot publish message to topic having + or #'});
                } else {
                    if(payloadType != "0" && (payloadType == "2"||payloadType == "8"||payloadType == "10"||payloadType == "16")) {
                        var inputArray = payload.split(",");
                        var convertedValue = '';
                        for(var i=0;i<inputArray.length;i++) {
                            var intVal = parseInt(inputArray[i],parseInt(payloadType));
                            if(Number.isNaN(intVal)) {
                                CommonActions.showMessageToUser({message:'Invalid payload. Payload data should match Payload Type.'});
                                return;
                            } else {
                                convertedValue+=String.fromCharCode(intVal);
                            }
                        }
                        MqttClientActions.publishMessage(this.props.mcsId,this.props.publisherSettings.pubId,topic,convertedValue,qos,retain);
                    } else {
                        MqttClientActions.publishMessage(this.props.mcsId,this.props.publisherSettings.pubId,topic,payload,qos,retain);
                    }
                    var pubMess = this.state.publishedMessages;
                    if(pubMess==null) {
                        pubMess = [];
                    }
                    pubMess.push({topic:topic,payload:payload,qos:qos,retain:retain,payloadType:payloadType});
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
        this.publishMessageToBroker(this.state.topic,this.state.payload,this.state.qos,this.state.retain,this.state.payloadType);
    }

    rePublishMessage(topic,payload,qos,retain,payloadType) {
        this.publishMessageToBroker(topic,payload,qos,retain,payloadType);
    }

    onPayloadCopy() {
        CommonActions.showMessageToUser({message:'Copied',type:CommonConstants.ALERT_SUCCESS});
    }

    savePublisherSettings() {
        var pubSettings = {pubId: this.props.publisherSettings.pubId,
                           topic: this.state.topic,
                           qos: this.state.qos,
                           retain: this.state.retain,
                           payload: this.state.payload,
                           payloadType:this.state.payloadType
                           };
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
                                        <span onClick={this.rePublishMessage.bind(this,pubMess.topic,pubMess.payload,pubMess.qos,pubMess.retain,pubMess.payloadType)} title="Publish again" style={style.messageIcons} className="glyphicon glyphicon-share-alt" aria-hidden="true"></span>
                                    </div>
                                </div>);
        }

        var payloadMsg = '';

        if(this.state.payloadType == "0") {
            payloadMsg = <span>e.g: {"{'hello':'world'}"}</span>;
        } else if(this.state.payloadType == "2") {
            payloadMsg = <span>e.g: 01001101,01010001,01010100,1010100,01000010,01101111,01111000</span>;
        } else if(this.state.payloadType == "8") {
            payloadMsg = <span>e.g: 115,121,124,124,102,157,170</span>;
        } else if(this.state.payloadType == "10") {
            payloadMsg = <span>e.g: 77,81,84,84,66,111,120</span>;
        } else if(this.state.payloadType == "16") {
            payloadMsg = <span>e.g: 0x4D,0x51,54,0x54,0x42,0x6f,0x78</span>;
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
                        <div className="form-inline">
                            <div className="checkbox">
                                <label>
                                    <span style={{paddingRight:5}}><b>Retain</b></span>
                                    <input onBlur={this.savePublisherSettings} name="retain" checked={this.state.retain}
                                        onChange={this.onCheckBoxValueChange}
                                        type="checkbox"/>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="payloadType">Payload Type</label>
                        <select onBlur={this.savePublisherSettings} name="payloadType" onChange={this.onTargetValueChange} value={this.state.payloadType} className="form-control">
                            <option value="0">Strings / JSON / XML / Characters</option>
                            <option value="2">Binary Array</option>
                            <option value="8">Octal Array</option>
                            <option value="10">Decimal Array</option>
                            <option value="16">Hex Array</option>
                        </select>
                        <div>{payloadMsg}</div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="payload">Payload</label>
                        <textarea name="payload" onBlur={this.savePublisherSettings} onChange={this.onTargetValueChange} value={this.state.payload} className="form-control" rows="4"></textarea>
                    </div>
                    <div className="form-group">
                        <button type="button" onClick={this.publishMessage} className="btn btn-primary">Publish</button>
                        <a style={{marginLeft:5}} href={"#/mqttpublisherdashboard/"+this.props.mcsId+"/"+this.props.publisherSettings.pubId} className="btn btn-default"><span className="fa fa-arrows-alt"> </span></a>
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