import React from 'react';

import Drawer from 'material-ui/Drawer';
import {List, ListItem} from 'material-ui/List';
import DevicesIcon from 'material-ui/svg-icons/hardware/developer-board';
import FlashIcon from 'material-ui/svg-icons/image/flash-on';
import AddIcon from 'material-ui/svg-icons/content/add-circle-outline';
import IconButton from 'material-ui/IconButton';
import ActionClear from 'material-ui/svg-icons/content/clear';
import SignalIcon from 'material-ui/svg-icons/device/network-wifi';
import InfoIcon from 'material-ui/svg-icons/action/info';
import Divider from 'material-ui/Divider';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import {blue500, red500, green500} from 'material-ui/styles/colors';

import CommonAppService from '../services/CommonAppService';
import AppConstants from '../utils/AppConstants';
import NavLink from './NavLink';
import BrokerSettingsService from '../services/BrokerSettingsService';
import BrokerConnectionService from '../services/BrokerConnectionService';
import MqttLoadSettingsService from '../services/MqttLoadSettingsService';

const style = {
    leftFloat: {
        float:'left'
    },
    rightFloat: {
        float:'right'
    }
};

class AppDrawer extends React.Component {

    constructor(props) {
        super(props);

        this.onShowHideAppDrawer = this.onShowHideAppDrawer.bind(this);
        this.navigateToAddEditBrokerPage = this.navigateToAddEditBrokerPage.bind(this);
        this.navigateToBrokerPage = this.navigateToBrokerPage.bind(this);
        this.onBrokerSettingsChanged = this.onBrokerSettingsChanged.bind(this);
        this.onMqttLoadSettingsChanged = this.onMqttLoadSettingsChanged.bind(this);

        var bsList = BrokerSettingsService.getAllBrokerSettingData();
        var mqttLoadList = MqttLoadSettingsService.getAllMqttLoadSettingsData();

        this.state = {open:true,bsList:bsList,mqttLoadList:mqttLoadList};
    }

    onShowHideAppDrawer(open) {
        this.setState({open:open});
    }

    navigateToAddEditBrokerPage() {
        this.onShowHideAppDrawer(false);
        window.location.hash = AppConstants.PAGE_URL_ADD_EDIT_CLIENT_BROKER_SETTINGS;
        //window.location.hash = AppConstants.PAGE_URL_ADD_EDIT_MQTT_LOAD;
    }

    navigateToBrokerPage(bsId) {
        this.onShowHideAppDrawer(false);
        window.location.hash = AppConstants.PAGE_URL_CLIENT_CONNECTION_DETAILS+bsId;
    }

    onBrokerSettingsChanged(bsId) {
        var bsList = BrokerSettingsService.getAllBrokerSettingData();
        this.setState({bsList:bsList});
    }

    onMqttLoadSettingsChanged(bsId) {
        var mqttLoadList = MqttLoadSettingsService.getAllMqttLoadSettingsData();
        this.setState({mqttLoadList:mqttLoadList});
    }

    componentDidMount() {
        CommonAppService.addChangeListener(AppConstants.EVENT_OPEN_CLOSE_APP_DRAWER,this.onShowHideAppDrawer);
        BrokerSettingsService.addChangeListener(AppConstants.EVENT_BROKER_SETTINGS_CHANGED,this.onBrokerSettingsChanged);
        BrokerConnectionService.addChangeListener(AppConstants.EVENT_BROKER_SETTINGS_CHANGED,this.onBrokerSettingsChanged);
        MqttLoadSettingsService.addChangeListener(AppConstants.EVENT_MQTT_LOAD_SETTINGS_CHANGED,this.onMqttLoadSettingsChanged);

        if(this.state.bsList==null || this.state.bsList.length<=0) {
           this.navigateToAddEditBrokerPage();
        } else {
            this.navigateToBrokerPage(this.state.bsList[0].bsId);
        }
    }

    componentWillUnmount() {
        CommonAppService.removeChangeListener(AppConstants.EVENT_OPEN_CLOSE_APP_DRAWER,this.onShowHideAppDrawer);
        BrokerSettingsService.removeChangeListener(AppConstants.EVENT_BROKER_SETTINGS_CHANGED,this.onBrokerSettingsChanged);
        BrokerConnectionService.removeChangeListener(AppConstants.EVENT_BROKER_SETTINGS_CHANGED,this.onBrokerSettingsChanged);
        MqttLoadSettingsService.removeChangeListener(AppConstants.EVENT_MQTT_LOAD_SETTINGS_CHANGED,this.onMqttLoadSettingsChanged);
    }

    render() {
        var brokerList = this.state.bsList.map(function(brokerSetting,index) {
            var connState = red500;
            if(BrokerConnectionService.getBrokerState(brokerSetting.bsId) == AppConstants.ONLINE) {
                connState = green500;
            }

            return (<ListItem leftIcon={<SignalIcon color={connState}/>} onClick={this.onShowHideAppDrawer.bind(this,false)} key={brokerSetting.bsId} primaryText={brokerSetting.brokerName} containerElement={<NavLink key={brokerSetting.bsId} to={"/broker/"+brokerSetting.bsId}/>}></ListItem>);
        }.bind(this));

        brokerList.push(<ListItem primaryText="Add New Client" onClick={this.onShowHideAppDrawer.bind(this,false)} key="addEditNewBroker" leftIcon={<AddIcon/>}
            containerElement={<NavLink key="addEditNewBroker" to="/addedit"/>}></ListItem>);

        var mqttLoadList = [];
        var mqttLoadList = this.state.mqttLoadList.map(function(mqttLoadSettings,index) {
            return (<ListItem onClick={this.onShowHideAppDrawer.bind(this,false)} key={mqttLoadSettings.bsId}
             primaryText={mqttLoadSettings.brokerName} containerElement={<NavLink key={mqttLoadSettings.bsId} to={"/mqttloadtest/"+mqttLoadSettings.bsId}/>}></ListItem>);
        }.bind(this));

        mqttLoadList.push(<ListItem primaryText="Add New Load" onClick={this.onShowHideAppDrawer.bind(this,false)} key="addeditmqttload" leftIcon={<AddIcon/>}
            containerElement={<NavLink key="addeditmqttload" to="/addeditmqttload"/>}></ListItem>);


        return (
            <Drawer
              docked={true}
              open={this.state.open}
              onRequestChange={this.onShowHideAppDrawer}
            >
                <Toolbar>
                    <ToolbarGroup style={style.leftFloat}/>
                    <ToolbarGroup style={style.rightFloat}>
                        <IconButton onTouchTap={this.onShowHideAppDrawer.bind(this,false)}>
                            <ActionClear/>
                        </IconButton>
                    </ToolbarGroup>
                </Toolbar>
                <Divider/>
                <List>
                    <ListItem
                      primaryText="MQTT Clients"
                      leftIcon={<DevicesIcon/>}
                      initiallyOpen={true}
                      primaryTogglesNestedList={true}
                      nestedItems={brokerList}
                    />
                    <ListItem
                      primaryText="MQTT Load"
                      leftIcon={<FlashIcon/>}
                      initiallyOpen={true}
                      primaryTogglesNestedList={true}
                      nestedItems={mqttLoadList}
                    />
                    <ListItem
                      primaryText="About"
                      leftIcon={<InfoIcon/>}
                      initiallyOpen={true}
                      primaryTogglesNestedList={true}
                      onClick={this.onShowHideAppDrawer.bind(this,false)}
                      containerElement={<NavLink key="aboutapp" to="/aboutapp"/>}
                    />
                </List>
            </Drawer>
        );
    }
}

export default AppDrawer;
