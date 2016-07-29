import React from 'react';
import moment from 'moment';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import SuccessIcon from 'material-ui/svg-icons/action/check-circle';
import ErrorIcon from 'material-ui/svg-icons/alert/error';
import StopIcon from 'material-ui/svg-icons/av/stop';
import TimeOutIcon from 'material-ui/svg-icons/image/timer-off';
import CircularProgress from 'material-ui/CircularProgress';
import * as Colors from 'material-ui/styles/colors.js';
import GraphIcon from 'material-ui/svg-icons/device/graphic-eq';
import ArchiveIcon from 'material-ui/svg-icons/content/archive';
import IconButton from 'material-ui/IconButton';
import _ from 'lodash';

import MqttLoadConstants from '../../utils/MqttLoadConstants';
import CommonUtils from '../../utils/CommonUtils';

const styles = {
    tableHeaderStyle: {
      color: 'black',
      fontWeight: 'bold'
    },
    statusWidth: {
      width: 50
    },
    datesWidth: {
      width: 550
    },
    timeWidth: {
      width: 200
    },
    iconStyles : {
      marginLeft: 10
    }
}
class MqttLoadResult extends React.Component {

    constructor(props) {
        super(props);
        this.openGraph = this.openGraph.bind(this);
        this.openArchiveData = this.openArchiveData.bind(this);
    }

    openGraph() {
        CommonUtils.openWindow('./loadgraph.html?iids='+this.props.instanceObj.iId);
    }

    openArchiveData() {
        CommonUtils.openWindow('./loaddata.html?iids='+this.props.instanceObj.iId);
    }

    render() {
        var headerComp = [];

        headerComp.push(<TableRow key="headerComp1" displayBorder={false}>
                                <TableHeaderColumn>Name : <span style={styles.tableHeaderStyle}>{'Instance '+this.props.instanceObj.metaData.instanceNumber}</span></TableHeaderColumn>
                                <TableHeaderColumn>Status : <span style={styles.tableHeaderStyle}>{this.props.instanceObj.metaData.status}</span></TableHeaderColumn>
                                <TableHeaderColumn>Type : <span style={styles.tableHeaderStyle}>{this.props.instanceObj.metaData.loadType}</span></TableHeaderColumn>
                                <TableHeaderColumn>Topic : <span style={styles.tableHeaderStyle}>{this.props.instanceObj.metaData.topic}</span></TableHeaderColumn>
                            </TableRow>);

        var messageStartTime = moment(this.props.instanceObj.metaData.messageStartTime).isValid()?moment(this.props.instanceObj.metaData.messageStartTime).format("MMM-DD-YYYY hh:mm:ss:SSS A"):'';
        var messageEndTime = moment(this.props.instanceObj.metaData.messageEndTime).isValid()?moment(this.props.instanceObj.metaData.messageEndTime).format("MMM-DD-YYYY hh:mm:ss:SSS A"):'';

        if(this.props.instanceObj.metaData.loadType == MqttLoadConstants.LOAD_TYPE_PUBLISHING) {
            var qosEndTime = moment(this.props.instanceObj.metaData.qosEndTime).isValid()?moment(this.props.instanceObj.metaData.qosEndTime).format("MMM-DD-YYYY hh:mm:ss:SSS A"):'';
            var publishDuration = '';
            var qosTime = '';

            if(messageStartTime!='' && messageEndTime!='') {
                publishDuration = moment(this.props.instanceObj.metaData.messageEndTime).diff(moment(this.props.instanceObj.metaData.messageStartTime));
            }

            if(messageStartTime!='' && qosEndTime !='') {
                qosTime = moment(this.props.instanceObj.metaData.qosEndTime).diff(moment(this.props.instanceObj.metaData.messageStartTime));
            }

            headerComp.push(<TableRow key="headerComp2" displayBorder={false}>
                        <TableHeaderColumn>Message Sent : <span style={styles.tableHeaderStyle}>{this.props.instanceObj.metaData.messCount}</span></TableHeaderColumn>
                        <TableHeaderColumn>QoS Count : <span style={styles.tableHeaderStyle}>{this.props.instanceObj.metaData.receivedMessagesCount}</span></TableHeaderColumn>
                        <TableHeaderColumn>Publish Time: <span style={styles.tableHeaderStyle}>{publishDuration}</span></TableHeaderColumn>
                        <TableHeaderColumn>QoS Time: <span style={styles.tableHeaderStyle}>{qosTime}</span></TableHeaderColumn>
                      </TableRow>);

        } else if(this.props.instanceObj.metaData.loadType == MqttLoadConstants.LOAD_TYPE_SUBSCRIBING) {
            var subscribedDuration = '';
            if(messageStartTime!='' && messageEndTime!='') {
                subscribedDuration = moment(this.props.instanceObj.metaData.messageEndTime).diff(moment(this.props.instanceObj.metaData.messageStartTime));
            }

            headerComp.push(<TableRow key="headerComp2" displayBorder={false}>
                        <TableHeaderColumn>Message Received : <span style={styles.tableHeaderStyle}>{this.props.instanceObj.metaData.receivedMessagesCount}</span></TableHeaderColumn>
                        <TableHeaderColumn>Subscribed Time: <span style={styles.tableHeaderStyle}>{subscribedDuration}</span></TableHeaderColumn>
                      </TableRow>);
        }

        if(this.props.instanceObj.metaData.receivedMessagesCount>0) {
            headerComp.push(<TableRow key="headerComp3" displayBorder={false}>
                        <TableHeaderColumn>
                            <IconButton onTouchTap={this.openGraph}>
                              <GraphIcon/>
                            </IconButton>
                        </TableHeaderColumn>
                        <TableHeaderColumn>
                            <IconButton onTouchTap={this.openArchiveData}>
                              <ArchiveIcon/>
                            </IconButton>
                        </TableHeaderColumn>
                      </TableRow>);
        }

        return (
            <Table selectable={false}>
                <TableHeader style={styles.tableHeaderStyle} displaySelectAll={false}  adjustForCheckbox={false} enableSelectAll={false}>
                    {headerComp}
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                    {this.props.instanceObj.messages.map((messageObj,index) => (
                        <TableRow key={index}>
                            <TableRowColumn style={{wordWrap: 'break-word', whiteSpace: 'normal'}}>{messageObj.message}</TableRowColumn>
                            <TableRowColumn style={styles.timeWidth}>{moment(messageObj.time).format("MMM-DD-YYYY hh:mm:ss:SSS A")}</TableRowColumn>
                            <TableRowColumn style={styles.statusWidth}>
                                {(() => {
                                  switch (messageObj.status) {
                                    case MqttLoadConstants.STATE_IN_PROGRESS:return <CircularProgress size={0.3}/>;
                                    case MqttLoadConstants.STATE_SUCCESS:return <SuccessIcon style={styles.iconStyles} color={Colors.green500}/>;
                                    case MqttLoadConstants.STATE_FAILED:return <ErrorIcon style={styles.iconStyles} color={Colors.red500}/>;
                                    case MqttLoadConstants.STATE_STOPPED:return <StopIcon style={styles.iconStyles} color={Colors.red500}/>;
                                    case MqttLoadConstants.STATE_ERROR:return <ErrorIcon style={styles.iconStyles} color={Colors.red500}/>;
                                    case MqttLoadConstants.STATE_TIME_OUT:return <TimeOutIcon style={styles.iconStyles} color={Colors.red500}/>;
                                    default: return "";
                                  }
                                })()}
                          </TableRowColumn>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }
}

export default MqttLoadResult;