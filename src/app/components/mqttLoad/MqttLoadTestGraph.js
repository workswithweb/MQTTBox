"use strict";
import React, {Component} from 'react';
import _ from 'lodash';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import moment from 'moment';

import LeftMenuButton from '../common/LeftMenuButton';
import MqttLoadService from '../../services/MqttLoadService';
import MqttLoadConstants from '../../utils/MqttLoadConstants';

const strokes =  {
    All:"DarkRed",
    Instance1:"DarkBlue",
    Instance2:"DarkCyan",
    Instance3:"DarkGoldenRod",
    Instance4:"DarkGrey",
    Instance5:"DarkGreen",
    Instance6:"DarkMagenta",
    Instance7:"DarkOrange",
    Instance8:"DarkViolet",
    Instance9:"DarkTurquoise",
    Instance10:"Black"
};

const styles = {
    navBar: {
        marginTop: 10
    },
    graphContainer: {
        WebkitBoxSizing: 'border-box',
        MozBoxSizing: 'border-box',
        boxSizing: 'border-box',
        padding: 10,
        width: 800,
        height: 800,
        backgroundColor: '#fff'
    }
};

class MqttLoadTestGraph extends Component {

    constructor(props) {
        super(props);
        this.onTargetValueChange = this.onTargetValueChange.bind(this);
        var mqttLoadSettings = MqttLoadService.getMqttLoadSettingsByMcsId(this.props.params.mcsId);
        var instances = _.values(mqttLoadSettings.instances);
        var iIds = [];
        for (var i=0;i<instances.length;i++) {
            iIds.push(instances[i].iId);
        }
        MqttLoadService.getMqttLoadDataByIIds(iIds)
        .then(function(instanceData) {
            var samRate = 10;
            if(mqttLoadSettings.loadTestType == MqttLoadConstants.TYPE_LOAD_TEST_PUBLISHING) {
                samRate = mqttLoadSettings.msgCount/mqttLoadSettings.runTime;
            } else if(mqttLoadSettings.loadTestType == MqttLoadConstants.TYPE_LOAD_TEST_SUBSCRIBING) {
                samRate = mqttLoadSettings.msgCount/mqttLoadSettings.timeOut;
            }
            if(samRate<5) {
                samRate = 5;
            } else if(samRate>50) {
                samRate = 50;
            }

            this.setState({mqttLoadSettings:mqttLoadSettings,instanceFilter:'all',instanceData:instanceData,samplingRate:samRate});
        }.bind(this));
    }

    onTargetValueChange(event) {
        var newState = {};
        newState[event.target.name] = event.target.value;
        this.setState(newState);
    }

    render() {
        var dataGraph = null;
        var noDataMessage = '';
        var options = [<option key="all" value="all">All Instances</option>];
        var allData = null;
        var graphData = null;

        if(this.state!=null && this.state.instanceData!=null && this.state.instanceData.length>0) {
            allData = {};
            if(this.state.instanceFilter=='all') {
                allData = {"All":{receivedMessages:[]}};
            }
            for(var i=0;i<this.state.instanceData.length;i++) {
                var instObj = this.state.instanceData[i];
                if(instObj!=null && instObj.metaData!=null) {
                    options.push(<option key={instObj.metaData.inum} value={instObj.metaData.inum}>{'Instance '+instObj.metaData.inum}</option>);
                    if(instObj.receivedMessages!=null && instObj.receivedMessages.length>0) {
                        if(this.state.instanceFilter=='all') {
                            allData['All'].receivedMessages =  _.sortBy(allData['All'].receivedMessages.concat(instObj.receivedMessages),[function(o){return o.time;}]);
                            allData['Instance'+instObj.metaData.inum] = {receivedMessages:[]};
                            allData['Instance'+instObj.metaData.inum].receivedMessages = _.sortBy(instObj.receivedMessages,[function(o){return o.time;}]);
                        } else if(this.state.instanceFilter ==instObj.metaData.inum){
                            allData['Instance'+instObj.metaData.inum] = {receivedMessages:[]};
                            allData['Instance'+instObj.metaData.inum].receivedMessages = _.sortBy(instObj.receivedMessages,[function(o){return o.time;}]);
                        }
                    }
                }
            }
        }

        if(allData!=null) {
            graphData = [];
            var minTime =0;
            var maxTime =100;
            if(allData['All']!=null && allData['All'].receivedMessages.length>0) {
                minTime = Math.floor(_.minBy(allData['All'].receivedMessages,function(o){return o.time;}).time);
                maxTime = Math.floor(_.maxBy(allData['All'].receivedMessages,function(o){return o.time;}).time);
            } else if(allData['Instance'+this.state.instanceFilter]!=null && allData['Instance'+this.state.instanceFilter].receivedMessages!=null && allData['Instance'+this.state.instanceFilter].receivedMessages.length>0){
                minTime = Math.floor(_.minBy(allData['Instance'+this.state.instanceFilter].receivedMessages,function(o){return o.time;}).time);
                maxTime = Math.floor(_.maxBy(allData['Instance'+this.state.instanceFilter].receivedMessages,function(o){return o.time;}).time);
            }
            var timeSample = Math.floor((maxTime - minTime)/this.state.samplingRate);
            var timeSlices = [];
            var graphInstances = Object.keys(allData);

            for(var i=minTime;i<=maxTime;i=i+timeSample) {
                var gObj={name:moment(i).format("ss:SSS")};
                for(var j=0;j<graphInstances.length;j++) {
                    var messsObs = _.filter(allData[graphInstances[j]].receivedMessages,function(o) { return (o.time>=i && o.time<i+timeSample);});
                    gObj[graphInstances[j]] = messsObs.length;
                }
                graphData.push(gObj);
            }

            if(graphData.length>0) {
                var lines = [];
                for(var j=0;j<graphInstances.length;j++) {
                    lines.push(<Line key={graphInstances[j]} type="monotone" dataKey={graphInstances[j]}
                                    stroke={strokes[graphInstances[j]]} activeDot={{r: 2}}/>);
                }
                dataGraph = <LineChart width={window.innerWidth*0.9} height={window.innerHeight*0.7} data={graphData} margin={{top: 25, right: 30, left: 20, bottom: 0}}>
                                <XAxis dataKey="name"/>
                                <YAxis/>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <Tooltip/>
                                <Legend />
                                {lines}
                            </LineChart>
            }
        }

        if(dataGraph==null) {
            noDataMessage = <div className="alert" role="alert"><b>No MQTT load data available. Please run load test.</b></div>;
        }

        return (
            <div>
                <nav className="navbar navbar-default navbar-fixed-top">
                    <div>
                        <div className="navbar-header">
                            <LeftMenuButton/>
                            <a href={"#/mqttloaddashboard/"+this.props.params.mcsId} className="navButton"><b><span className="glyphicon glyphicon-arrow-left" aria-hidden="true"></span> BACK</b></a>
                        </div>
                        <div id="navbar" className="navbar-collapse collapse">
                            <ul className="nav navbar-nav">
                                <li style={styles.navBar}>
                                    <select name="instanceFilter" value={this.state==null ? 'all':this.state.instanceFilter} onChange={this.onTargetValueChange} className="form-control">
                                      {options}
                                    </select>
                                </li>
                                <li style={{marginTop:15,marginLeft:20}}>
                                    <label htmlFor="samplingRate"> Sampling</label>
                                </li>
                                <li style={styles.navBar}>
                                    <input min="1" max="100" type="number" className="form-control" name="samplingRate"
                                        onChange={this.onTargetValueChange} value={this.state==null ? 10:this.state.samplingRate}/>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div style={styles.graphContainer}>
                    {dataGraph}
                </div>
                <div>
                    {noDataMessage}
                </div>
            </div>
        );
    }
}

export default MqttLoadTestGraph;