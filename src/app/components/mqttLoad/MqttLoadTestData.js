"use strict";
import React, {Component} from 'react';
import _ from 'lodash';
import {Table, Column, Cell} from 'fixed-data-table';
import moment from 'moment';

import LeftMenuButton from '../common/LeftMenuButton';
import MqttLoadService from '../../services/MqttLoadService';

const styles = {
    navBar: {
        marginTop: 10
    }
};

const TextCell = (dataObj) => (
  <Cell columnKey={dataObj.columnKey} height={dataObj.height} width={dataObj.width}>
    {dataObj.data[dataObj.rowIndex].data[dataObj.col]}
  </Cell>
);

const DateCell = (dataObj) => (
  <Cell columnKey={dataObj.columnKey} height={dataObj.height} width={dataObj.width}>
    {moment(dataObj.data[dataObj.rowIndex].time).format("MMM-DD-YYYY hh:mm:ss:SSS A")}
  </Cell>
);

class MqttLoadTestData extends Component {

    constructor(props) {
        super(props);
        this._onColumnResizeEndCallback = this._onColumnResizeEndCallback.bind(this);
        this.onTargetValueChange = this.onTargetValueChange.bind(this);
        var mqttLoadSettings = MqttLoadService.getMqttLoadSettingsByMcsId(this.props.params.mcsId);
        var instances = _.values(mqttLoadSettings.instances);
        var iIds = [];
        for (var i=0;i<instances.length;i++) {
            iIds.push(instances[i].iId);
        }
        MqttLoadService.getMqttLoadDataByIIds(iIds)
        .then(function(instanceData) {
            var pWidth = window.innerWidth;
            this.setState({mqttLoadSettings:mqttLoadSettings,instanceFilter:'all',instanceData:instanceData,
                            columnWidths: {time:(25/100)*pWidth,messageId:(10/100)*pWidth,topic:(20/100)*pWidth,qos:(5/100)*pWidth,inum:(5/100)*pWidth,payload:(35/100)*pWidth}});
        }.bind(this));
    }

    _onColumnResizeEndCallback(newColumnWidth,columnKey) {
        var columnWidths = this.state.columnWidths;
        columnWidths[columnKey] = newColumnWidth;
        this.setState({columnWidths:columnWidths});
    }

    onTargetValueChange(event) {
        this.setState({instanceFilter:event.target.value});
    }

    render() {
        var dataTable = '';
        var noDataMessage = '';
        var options = [<option key="all" value="all">All Instances</option>];
        var dataList = [];
        if(this.state!=null && this.state.instanceData!=null && this.state.instanceData.length>0) {
            for(var i=0;i<this.state.instanceData.length;i++) {
                var instObj = this.state.instanceData[i];
                if(instObj!=null && instObj.metaData!=null) {
                    options.push(<option key={instObj.metaData.iId} value={instObj.metaData.iId}>{'Instance '+instObj.metaData.inum}</option>);
                    if(this.state.instanceFilter=='all'||this.state.instanceFilter==instObj.metaData.iId) {
                        dataList = dataList.concat(instObj.receivedMessages);
                    }
                }
            }
            dataList = _.sortBy(dataList,[function(o) { return o.time; }]);
        }

        var pWidth = window.innerWidth;
        if(dataList.length>0) {
            dataTable = <Table rowHeight={40} headerHeight={30} rowsCount={dataList.length}  width={pWidth} height={window.innerHeight-50} {...this.props}
                            onColumnResizeEndCallback={this._onColumnResizeEndCallback} isColumnResizing={false}>
                           <Column
                                columnKey="time"
                                header={<Cell>Time</Cell>}
                                cell={<DateCell data={dataList} col="time"/>}
                                fixed={true}
                                width={this.state.columnWidths.time}
                                isResizable={true}
                                fixed={true}
                           />
                           <Column
                                columnKey="messageId"
                                header={<Cell>Message Id</Cell>}
                                cell={<TextCell data={dataList} col="messageId"/>}
                                fixed={true}
                                width={this.state.columnWidths.messageId}
                                isResizable={true}
                                fixed={true}
                           />
                           <Column
                                columnKey="topic"
                                header={<Cell>Topic</Cell>}
                                cell={<TextCell data={dataList} col="topic"/>}
                                width={this.state.columnWidths.topic}
                                isResizable={true}
                                fixed={true}
                           />
                           <Column
                                columnKey="qos"
                                header={<Cell>QoS</Cell>}
                                cell={<TextCell data={dataList} col="qos"/>}
                                width={this.state.columnWidths.qos}
                                isResizable={true}
                                fixed={true}
                           />
                           <Column
                                columnKey="inum"
                                header={<Cell>Instance</Cell>}
                                cell={<TextCell data={dataList} col="inum"/>}
                                width={this.state.columnWidths.inum}
                                isResizable={true}
                                fixed={true}
                           />
                           <Column
                                columnKey="payload"
                                header={<Cell>Payload</Cell>}
                                cell={<TextCell data={dataList} col="payload"/>}
                                width={this.state.columnWidths.payload}
                                isResizable={true}
                                fixed={true}
                           />
                       </Table>
        } else {
            noDataMessage =   <div className="alert" role="alert">
                            <b>No MQTT load data available. Please run load test.</b>
                        </div>;

        }

        return (
            <div>
                <nav className="navbar navbar-default navbar-fixed-top">
                    <div>
                        <div className="navbar-header">
                            <LeftMenuButton/>
                            <a href={"#/mqttloaddashboard/"+this.props.params.mcsId} className="btn btn-default"><span className="glyphicon glyphicon-arrow-left" aria-hidden="true"></span></a>
                        </div>
                        <div id="navbar" className="navbar-collapse collapse">
                            <ul style={{marginLeft:5}} className="nav navbar-nav">
                                <li style={styles.navBar}>
                                    <select value={this.state==null ? 'all':this.state.instanceFilter} onChange={this.onTargetValueChange} className="form-control">
                                      {options}
                                    </select>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div>
                    {dataTable}
                </div>
                <div>
                    {noDataMessage}
                </div>

            </div>
        );
    }
}

export default MqttLoadTestData;