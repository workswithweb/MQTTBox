import React, {Component} from 'react';
import _ from 'lodash';

import LeftMenuButton from '../common/LeftMenuButton';
import NavUtils from '../../utils/NavUtils';
import MqttLoadService from '../../services/MqttLoadService';
import MqttLoadConstants from '../../utils/MqttLoadConstants';
import MqttLoadActions from '../../actions/MqttLoadActions';
import MqttLoadInstance from './MqttLoadInstance';

const styles = {
    button: {
        margin: 10
    }
};

class MqttLoadDashboard extends Component {

    constructor(props) {
        super(props);

        this.updatePageData = this.updatePageData.bind(this);

        this.state = {mqttLoadSettings:MqttLoadService.getMqttLoadSettingsByMcsId(this.props.params.mcsId)};
    }

    updatePageData(mcsId) {
        if(mcsId == this.props.params.mcsId) {
            this.setState({mqttLoadSettings:MqttLoadService.getMqttLoadSettingsByMcsId(this.props.params.mcsId)});
        }
    }

    componentDidMount() {
        MqttLoadService.addChangeListener(MqttLoadConstants.EVENT_MQTT_LOAD_SETTINGS_CHANGED,this.updatePageData);
    }

    componentWillUnmount() {
        MqttLoadService.removeChangeListener(MqttLoadConstants.EVENT_MQTT_LOAD_SETTINGS_CHANGED,this.updatePageData);
    }

    render() {
        var mqttLoadInstances = [];
        var instances = _.values(this.state.mqttLoadSettings.instances);
        var message = '';
        var isExecutionInProgress = false;

        for(var i=0;i<instances.length;i++) {
            var instanceObj = instances[i];
            mqttLoadInstances.push(<MqttLoadInstance key={instanceObj.iId} instanceObj={instanceObj}/>);
            if(instanceObj.overallStatus == MqttLoadConstants.STATE_IN_PROGRESS) {
                isExecutionInProgress = true;
            }
        }

        var loadTestButton =    <button onClick={MqttLoadActions.startMqttLoadTest.bind(this,this.props.params.mcsId)} title="Start Load Test" style={styles.button} type="button" className="btn btn-default" aria-label="Left Align">
                                    <span style={{color:"#d43f3a"}} className="glyphicon glyphicon-flash" aria-hidden="true"></span> Start Load Test
                                </button>
        var viewGraphsButton =  <button onClick={NavUtils.goToMqttLoadTestGraph.bind(this,this.props.params.mcsId)} title="View Graph" style={styles.button} type="button" className="btn btn-default" aria-label="Left Align">
                                    <span className="glyphicon glyphicon-stats" aria-hidden="true"></span> View Graph
                                </button>
        var viewDataButton =    <button onClick={NavUtils.goToMqttLoadTestData.bind(this,this.props.params.mcsId)} title="View Data" style={styles.button} type="button" className="btn btn-default" aria-label="Left Align">
                                   <span className="glyphicon glyphicon-cd" aria-hidden="true"></span> View Data
                                </button>
        var editLoadButton =    <button onClick={NavUtils.gotToAddEditMqttLoad.bind(this,this.props.params.mcsId)} title="Edit MQTT Load Settings"
                                    style={styles.button} type="button" className="btn btn-default" aria-label="Left Align">
                                    <span className="glyphicon glyphicon-cog" aria-hidden="true"></span>
                                </button>

        if(isExecutionInProgress==true) {
            loadTestButton =    <button onClick={MqttLoadActions.stopMqttLoadTest.bind(this,this.props.params.mcsId)} title="Stop Load Test" style={styles.button} type="button" className="btn btn-default" aria-label="Left Align">
                                        <i style={{color:"#d43f3a"}} className="fa fa-stop-circle" aria-hidden="true"></i> Stop Load Test
                                </button>
            viewGraphsButton = '';
            viewDataButton = '';
            editLoadButton = '';
        }

        if(mqttLoadInstances.length ==0) {
            message = <div style={{marginLeft:10}}>
                        <b>No load test data available. Click
                        <button onClick={MqttLoadActions.startMqttLoadTest.bind(this,this.props.params.mcsId)} title="Start Load Test" style={styles.button} type="button" className="btn btn-default" aria-label="Left Align">
                            <span style={{color:"#d43f3a"}} className="glyphicon glyphicon-flash" aria-hidden="true"></span> Start Load Test
                        </button>to run load test</b>
                      </div>;
            viewGraphsButton = '';
            viewDataButton = '';
        }

        return (
            <div>
                <nav className="navbar navbar-default navbar-fixed-top">
                    <div>
                        <div className="navbar-header">
                            <LeftMenuButton/>
                            <a href="#/mqttloadlist" className="navButton"><b><span className="glyphicon glyphicon-arrow-left" aria-hidden="true"></span> MQTT LOAD</b></a>
                        </div>
                        <div id="navbar" className="navbar-collapse collapse">
                            <ul className="nav navbar-nav">
                                <li>
                                    {loadTestButton}
                                </li>
                                <li>
                                    {viewGraphsButton}
                                </li>
                                <li>
                                    {viewDataButton}
                                </li>
                                <li>
                                    {editLoadButton}
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div style={{marginLeft:15}}>
                    <small><code style={{color:'#337ab7'}}>{this.state.mqttLoadSettings.mqttClientName+' - '+this.state.mqttLoadSettings.protocol+'://'+this.state.mqttLoadSettings.host}</code></small>
                    <small><code style={{color:'#337ab7'}}>{',Test Type='+this.state.mqttLoadSettings.loadTestType+', Msg Count='+this.state.mqttLoadSettings.msgCount+', Instances='+this.state.mqttLoadSettings.instanceCount+', Topic='+this.state.mqttLoadSettings.topic}</code></small>
                </div>
                {message}
                <div className="container-fluid">
                    <div className="row">
                        {mqttLoadInstances}
                    </div>
                </div>
            </div>
        );
    }
}

export default MqttLoadDashboard;