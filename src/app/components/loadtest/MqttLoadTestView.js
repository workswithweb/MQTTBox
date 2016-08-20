import React from 'react';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import ActionDehaze from 'material-ui/svg-icons/image/dehaze';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import * as Colors from 'material-ui/styles/colors.js';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {GridList,GridTile} from 'material-ui/GridList';
import Paper from 'material-ui/Paper';
import StopLoadIcon from 'material-ui/svg-icons/action/highlight-off';
import StartLoadIcon from 'material-ui/svg-icons/action/trending-up';
import GraphIcon from 'material-ui/svg-icons/device/graphic-eq';
import ArchiveIcon from 'material-ui/svg-icons/content/archive';
import HelpIcon from 'material-ui/svg-icons/action/help';
import _ from 'lodash';

import AppActions from '../../actions/AppActions';
import AppConstants from '../../utils/AppConstants';
import MqttLoadConstants from '../../utils/MqttLoadConstants';
import MqttLoadResult from './MqttLoadResult';
import MqttLoadSettingsService from '../../services/MqttLoadSettingsService';
import CommonUtils from '../../utils/CommonUtils';

const styles = {
    paper: {
      width: '96%',
      margin: 10
    },
    gridRow: {
        overflowY: 'auto',
        border: '1px solid #1976d2'
    },
    actionButtons: {
        margin: 10,
        color:'white'
    }
};

class MqttLoadTestView extends React.Component {

    constructor(props) {
        super(props);
        this.initLoadObj = this.initLoadObj.bind(this);
        this.onShowHideMenuClick = this.onShowHideMenuClick.bind(this);
        this.onEditLoadSettingsClick = this.onEditLoadSettingsClick.bind(this);
        this.startMqttLoad = this.startMqttLoad.bind(this);
        this.stopMqttLoad = this.stopMqttLoad.bind(this);
        this.onMqttLoadSettingsChanged = this.onMqttLoadSettingsChanged.bind(this);
        this.openGraph = this.openGraph.bind(this);
        this.openArchiveData = this.openArchiveData.bind(this);

        this.initLoadObj(this.props.params.bsId);
    }

    initLoadObj(bsId) {
        var loadObj = MqttLoadSettingsService.getMqttLoadSettingsDataByBsId(bsId);
        this.state = {loadObj:loadObj};
    }

    onShowHideMenuClick() {
        AppActions.showHideMenu(true);
    }

    onEditLoadSettingsClick() {
        window.location.hash = AppConstants.PAGE_URL_ADD_EDIT_MQTT_LOAD+'/'+this.props.params.bsId;
    }

    startMqttLoad() {
        AppActions.startMqttLoad(this.props.params.bsId);
    }

    stopMqttLoad() {
        AppActions.stopMqttLoad(this.props.params.bsId);
    }

    onMqttLoadSettingsChanged(bsId) {
        if(bsId==this.props.params.bsId) {
            var loadObj = MqttLoadSettingsService.getMqttLoadSettingsDataByBsId(bsId);
            this.setState({loadObj:loadObj});
        }
    }

    openGraph() {
        CommonUtils.openWindow('./loadgraph.html?iids='+_.keys(this.state.loadObj.instances).join());
    }

    openArchiveData() {
        CommonUtils.openWindow('./loaddata.html?iids='+_.keys(this.state.loadObj.instances).join());
    }

    componentWillReceiveProps(nextProps) {
        this.initLoadObj(nextProps.params.bsId);
    }

    componentDidMount() {
        MqttLoadSettingsService.addChangeListener(AppConstants.EVENT_MQTT_LOAD_SETTINGS_CHANGED,this.onMqttLoadSettingsChanged);
    }

    componentWillUnmount() {
        MqttLoadSettingsService.removeChangeListener(AppConstants.EVENT_MQTT_LOAD_SETTINGS_CHANGED,this.onMqttLoadSettingsChanged);
    }

    render() {
        var instances = _.values(this.state.loadObj.instances);
        var isOverStateInProgress = false;
        var instanceElements = '';

        if(instances!=null && instances.length>0) {
            var instanceData = [];
            for(var i=0;i<instances.length;i++) {
                var instanceObj = instances[i];

                if(instanceObj.metaData.status == MqttLoadConstants.STATE_IN_PROGRESS) {
                    isOverStateInProgress = true;
                }
                instanceData.push(
                    <GridTile
                        key={instanceObj.iId}
                        rows={3}
                        style={styles.gridRow}
                    >
                        <MqttLoadResult instanceObj={instanceObj}></MqttLoadResult>
                    </GridTile>
                );
            }

            instanceElements =   <Paper style={styles.paper} zDepth={2}>
                                    <GridList>
                                        {instanceData}
                                    </GridList>
                                </Paper>
        }

        var runTimeMsg = '';
        if(this.state.loadObj.loadType == MqttLoadConstants.LOAD_TYPE_PUBLISHING) {
            runTimeMsg = ', Run time = '+this.state.loadObj.runTime;
        }

        return (
            <div>
                <Toolbar>
                    <ToolbarGroup firstChild={true}>
                        <IconButton onTouchTap={this.onShowHideMenuClick}>
                            <ActionDehaze/>
                        </IconButton>
                        <IconButton tooltipPosition="bottom-center" target="_blank" href="http://workswithweb.com/html/mqttbox/mqtt_load_test_metrics.html" tooltip="Help - MQTT Load Metrics.">
                            Help <HelpIcon color={Colors.red500}/>
                        </IconButton>
                        <div>
                            {isOverStateInProgress==false ?(<IconButton onTouchTap={this.onEditLoadSettingsClick} tooltipPosition="bottom-center" tooltip="Edit load settings"><SettingsIcon color={Colors.brown900}/></IconButton>):null}
                        </div>
                        <h3>{this.state.loadObj.brokerName +' - '+
                            this.state.loadObj.host+' , '+'Messages = '+this.state.loadObj.msgCount+runTimeMsg+
                            ', Time Out = '+this.state.loadObj.timeOut+', Instances = '+this.state.loadObj.instanceCount+', Type = '+
                            this.state.loadObj.loadType}</h3>
                    </ToolbarGroup>
                </Toolbar>
                <div>
                    {isOverStateInProgress==true ?(<RaisedButton secondary={true} style={styles.actionButtons} labelPosition="before" icon={<StopLoadIcon/>} onTouchTap={this.stopMqttLoad} label="Stop Load"/>):(<RaisedButton icon={<StartLoadIcon/>} style={styles.actionButtons} labelPosition="before" onTouchTap={this.startMqttLoad} label="Start Load" secondary={true}/>)}
                    {(instances.length>0 && isOverStateInProgress==false) ? <RaisedButton style={styles.actionButtons} label="View All Graph" onTouchTap={this.openGraph} labelPosition="before" primary={true} icon={<GraphIcon/>}/>:null}
                    {(instances.length>0 && isOverStateInProgress==false) ? <RaisedButton style={styles.actionButtons} label="View All Data" onTouchTap={this.openArchiveData} labelPosition="before" primary={true} icon={<ArchiveIcon/>}/>:null}
                </div>
                <div>
                    {instanceElements}
                </div>
                <div>
                    {instances.length<=0 ?(<Card>
                        <CardTitle subtitle="No data available to show graphs. Please start MQTT Load" />
                      </Card>):null}
                </div>
            </div>
        );
    }
}

export default MqttLoadTestView;