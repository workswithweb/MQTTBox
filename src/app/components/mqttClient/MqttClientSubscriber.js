import React from 'react';

import MqttClientActions from '../../actions/MqttClientActions';
import MqttClientConstants from '../../utils/MqttClientConstants';
import CommonActions from '../../actions/CommonActions';
import MqttClientService from '../../services/MqttClientService';

const style = {
    subscriberPaper: {
        height: '500px',
        width: '100%',
        display: 'inline-block',
        border: '1px solid #eea236',
        padding:10,
        overflow: 'auto'
    },
    removeStyle:{
        position: 'absolute',
        right: '20px',
        top: 0,
        cursor: 'pointer',
        color:'#eea236'
    }
};

export default class MqttClientSubscriber extends React.Component {

    constructor(props) {
        super(props);
        this.onTargetValueChange = this.onTargetValueChange.bind(this);
        this.saveSubscriberSettings = this.saveSubscriberSettings.bind(this);
        this.deleteSubscriber = this.deleteSubscriber.bind(this);
        this.subscribeToTopic = this.subscribeToTopic.bind(this);
        this.updatePageData = this.updatePageData.bind(this);
        this.unSubscribeToTopic = this.unSubscribeToTopic.bind(this);

        this.state = {
            qos:this.props.subscriberSettings.qos,
            topic:this.props.subscriberSettings.topic
        }
    }

    onTargetValueChange(event) {
        var newState = {};
        newState[event.target.name] = event.target.value;
        this.setState(newState);
    }

    saveSubscriberSettings() {
        var subSettings = {subId: this.props.subscriberSettings.subId,
                           topic: this.state.topic,
                           qos: this.state.qos};
        MqttClientActions.saveSubscriberSettings({mcsId:this.props.mcsId,subscriber:subSettings});
    }

    deleteSubscriber() {
        MqttClientActions.deleteSubscriber({mcsId:this.props.mcsId,subId:this.props.subscriberSettings.subId});
    }

    subscribeToTopic() {
        if(this.props.conState==MqttClientConstants.CONNECTION_STATE_CONNECTED) {
            if(this.state.topic!=null && this.state.topic.trim().length>0) {
                MqttClientActions.subscribeToTopic(this.props.mcsId,this.props.subscriberSettings.subId,this.state.topic,this.state.qos);
            } else {
                CommonActions.showMessageToUser({message:'Please enter valid topic to subscribe'});
            }
        } else {
            CommonActions.showMessageToUser({message:'MQTT Client is not connected to broker. Please check client settings'});
        }
    }

    unSubscribeToTopic() {
        MqttClientActions.unSubscribeToTopic(this.props.mcsId,this.props.subscriberSettings.subId,this.state.topic);
    }

    updatePageData(data) {
        if(data.subId == this.props.subscriberSettings.subId) {
            this.setState({updated:+(new Date())});
        }
    }

    componentDidMount() {
        MqttClientService.addChangeListener(MqttClientConstants.EVENT_MQTT_CLIENT_SUBSCRIBED_DATA_RECIEVED,this.updatePageData);
    }

    componentWillUnmount() {
        MqttClientService.removeChangeListener(MqttClientConstants.EVENT_MQTT_CLIENT_SUBSCRIBED_DATA_RECIEVED,this.updatePageData);
    }

    render() {
        var subData = MqttClientService.getSubscribedData(this.props.mcsId,this.props.subscriberSettings.subId);
        var component ='';
        var messageList = [];

        if(subData!=null && subData.receivedMessages!=null && subData.receivedMessages.length>0) {
            var len = subData.receivedMessages.length;
            for (var i=len-1; i>=0;i--) {
                messageList.push(
                    <div key={this.props.subscriberSettings.subId+i} className="panel-group" id={"accordion_"+this.props.subscriberSettings.subId+i}  role="tablist" aria-multiselectable="true">
                        <div className="panel" style={{border:'1px solid #e1e1e8'}}>
                            <div className="panel-heading" role="tab" id={"heading_"+this.props.subscriberSettings.subId+i}>
                                <div className="panel-title">
                                    <a className="panel-title" role="button" data-toggle="collapse" data-parent={"#accordion_"+this.props.subscriberSettings.subId+i} href={"#collapse"+this.props.subscriberSettings.subId+i}
                                        aria-expanded="false" aria-controls={"collapse"+this.props.subscriberSettings.subId+i}>
                                        {subData.receivedMessages[i].message}
                                    </a>
                                </div>
                            </div>
                            <div id={"collapse"+this.props.subscriberSettings.subId+i} className="panel-collapse collapse" role="tabpanel" aria-labelledby={"heading_"+this.props.subscriberSettings.subId+i}>
                                <div className="panel-body">
                                    <div>
                                        <div><b>qos</b> : {subData.receivedMessages[i].packet.qos}</div>
                                        <div><b> retain</b> : {subData.receivedMessages[i].packet.retain.toString()}</div>
                                        <div><b> cmd</b> : {subData.receivedMessages[i].packet.cmd}</div>
                                        <div><b> dup</b> : {subData.receivedMessages[i].packet.dup.toString()}</div>
                                        <div><b> topic</b> : {subData.receivedMessages[i].packet.topic}</div>
                                        <div><b> messageId</b> : {subData.receivedMessages[i].packet.messageId}</div>
                                        <div><b> length</b> : {subData.receivedMessages[i].packet.length}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
        }

        if(subData!=null && subData.isSubscribed==true) {
            component = <div>
                            <div style={{marginBottom:10}}>
                                <button onClick={this.unSubscribeToTopic} title="Unsubscribe" type="button" className="btn btn-warning btn-sm btn-block">
                                  <span style={{marginRight:10}} className="glyphicon glyphicon-remove" aria-hidden="true"></span>{this.state.topic}
                                </button>
                            </div>
                            <div>
                                {messageList}
                            </div>
                        </div>
        } else {
            component = <div>
                            <div className="form-group">
                                <label htmlFor="topic">Topic to subscribe</label>
                                <input type="text" className="form-control" name="topic"
                                    onBlur={this.saveSubscriberSettings} placeholder="Topic to subscribe" onChange={this.onTargetValueChange} value={this.state.topic}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="qos">QoS</label>
                                <select onBlur={this.saveSubscriberSettings} name="qos" onChange={this.onTargetValueChange} value={this.state.qos} className="form-control">
                                    <option value="0">0 - Almost Once</option>
                                    <option value="1">1 - Atleast Once</option>
                                    <option value="2">2 - Exactly Once</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <button type="button" onClick={this.subscribeToTopic}  className="btn btn-warning">Subscribe</button>
                            </div>
                            <div>
                                {messageList}
                            </div>
                        </div>;
        }

        return (
            <div className="col-xs-12 col-sm-6 col-md-4">
                <div style={style.subscriberPaper} className="thumbnail">
                    {component}
                </div>
                { (subData==null || subData.isSubscribed !=true) ?
                    <div>
                        <span onClick={this.deleteSubscriber} className="remove" style={style.removeStyle}>
                            <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                        </span>
                    </div>: null
                }
            </div>
        );
    }
}