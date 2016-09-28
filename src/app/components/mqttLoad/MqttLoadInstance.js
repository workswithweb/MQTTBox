import React, {Component} from 'react';
import moment from 'moment';

import MqttLoadConstants from '../../utils/MqttLoadConstants';

class MqttLoadInstance extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        var testStartTime = moment(this.props.instanceObj.testStartTime).isValid()?moment(this.props.instanceObj.testStartTime).format("MMM-DD-YYYY hh:mm:ss:SSS A"):'';
        var messList = [];
        for(var i=this.props.instanceObj.messages.length-1;i>=0;i--) {
            var msgObj = this.props.instanceObj.messages[i];
            var statusSymbol = '';

            if(msgObj.status == MqttLoadConstants.STATE_SUCCESS) {
                statusSymbol = <span style={{color:'#4cae4c'}} className="fa fa-check-circle-o" aria-hidden="true"></span>;
            } else if(msgObj.status == MqttLoadConstants.STATE_ERROR) {
                statusSymbol = <span style={{color:'#d43f3a'}} className="fa fa-exclamation-circle" aria-hidden="true"></span>;
            } else if(msgObj.status == MqttLoadConstants.STATE_STOPPED) {
                statusSymbol = <span style={{color:'#d43f3a'}} className="fa fa-ban" aria-hidden="true"></span>;
            } else if(msgObj.status == MqttLoadConstants.STATE_TIME_OUT) {
                statusSymbol = <span style={{color:'#d43f3a'}} className="fa fa-clock-o" aria-hidden="true"></span>;
            } else if(msgObj.status == MqttLoadConstants.STATE_IN_PROGRESS) {
                statusSymbol = <i style={{color:'#2e6da4'}} className="fa fa-circle-o-notch fa-spin"></i>;
            }
            messList.push(
                <tr key={i}>
                    <td colSpan="3">{msgObj.message}</td>
                    <td colSpan="2">{moment(msgObj.time).format("MMM-DD-YYYY hh:mm:ss:SSS A")}</td>
                    <td colSpan="1">{statusSymbol}</td>
                </tr>
            );
        }

        var durationObj = '';
        var qosDurationObj = '';
        var messagesCount = '';
        var qosReceivedMessCount = '';

        if(this.props.instanceObj.loadTestType == MqttLoadConstants.TYPE_LOAD_TEST_PUBLISHING) {
            var publishDuration = '';
            if(this.props.instanceObj!=null && this.props.instanceObj.messageStartTime!=null && this.props.instanceObj.messageEndTime!=null) {
                publishDuration = ((moment(this.props.instanceObj.messageEndTime).diff(moment(this.props.instanceObj.messageStartTime))/1000).toFixed(4))+'s';
            }
            durationObj =   <div className="col-xs-6 col-sm-4 col-md-4">
                                        <div>Published Time: <b>{publishDuration}</b></div>
                                    </div>

            var qosDuration = '';
            if(this.props.instanceObj!=null && this.props.instanceObj.qosStartTime!=null && this.props.instanceObj.qosEndTime!=null) {
                qosDuration = ((moment(this.props.instanceObj.qosEndTime).diff(moment(this.props.instanceObj.qosStartTime))/1000).toFixed(4))+'s';
            }
            qosDuration =   <div className="col-xs-6 col-sm-4 col-md-4">
                                <div>QoS Time: <b>{qosDuration}</b></div>
                            </div>

            messagesCount = <div className="col-xs-6 col-sm-4 col-md-4">
                                    <div>Published Messages: <b>{this.props.instanceObj.messCount>0?this.props.instanceObj.messCount:''}</b></div>
                                </div>

            qosReceivedMessCount =  <div className="col-xs-6 col-sm-4 col-md-4">
                                        <div>QoS Response: <b>{this.props.instanceObj.qosReceivedMessCount>0?this.props.instanceObj.qosReceivedMessCount:''}</b></div>
                                    </div>
        } else if(this.props.instanceObj.loadTestType == MqttLoadConstants.TYPE_LOAD_TEST_SUBSCRIBING) {
            var subDuration = '';
            if(this.props.instanceObj!=null && this.props.instanceObj.messageStartTime!=null && this.props.instanceObj.messageEndTime!=null) {
                subDuration = ((moment(this.props.instanceObj.messageEndTime).diff(moment(this.props.instanceObj.messageStartTime))/1000).toFixed(4))+'s';
            }
            durationObj =   <div className="col-xs-6 col-sm-4 col-md-4">
                                <div>Subscribed Time: <b>{subDuration}</b></div>
                            </div>
            messagesCount = <div className="col-xs-6 col-sm-4 col-md-4">
                                <div>Messages Received: <b>{this.props.instanceObj.messCount>0?this.props.instanceObj.messCount:''}</b></div>
                            </div>
        }

        return (
            <div className="col-xs-12 col-sm-12 col-md-6">
                <div style={{border:'2px solid #2e6da4'}} className="thumbnail">
                    <div style={{padding:10}} className="row">
                        <div className="col-xs-6 col-sm-4 col-md-4">
                            <div>Name: <b>Instance {this.props.instanceObj.instanceNumber}</b></div>
                        </div>
                        <div className="col-xs-6 col-sm-4 col-md-4">
                            <div>Status: <b>{this.props.instanceObj.overallStatus}</b></div>
                        </div>
                        {durationObj}
                        {messagesCount}
                        {qosReceivedMessCount}
                        {qosDuration}
                    </div>
                    <div className="table-responsive">
                        <table className="table">
                            <tbody>
                                {messList}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default MqttLoadInstance;