import React from 'react';

import {Toolbar, ToolbarGroup,ToolbarTitle} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import ActionDehaze from 'material-ui/svg-icons/image/dehaze';
import * as Colors from 'material-ui/styles/colors.js';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import SignalIcon from 'material-ui/svg-icons/device/network-wifi';
import CloudUploadIcon from 'material-ui/svg-icons/file/cloud-upload';
import CloudDownloadIcon from 'material-ui/svg-icons/file/cloud-download';
import RaisedButton from 'material-ui/RaisedButton';

import CommonActions from '../actions/CommonActions';
import AppConstants from '../utils/AppConstants';

class BrokerView extends React.Component {

    constructor(props) {
        super(props);
        this.onShowHideMenuClick = this.onShowHideMenuClick.bind(this);
        this.onEditBrokerSettingsClick = this.onEditBrokerSettingsClick.bind(this);
    }

    onShowHideMenuClick() {
        CommonActions.showHideMenu(true);
    }

    onEditBrokerSettingsClick() {
        var eventData = {menuId:AppConstants.MENU_ADD_EDIT_BROKER,bsId:this.props.broker.bsId};
        CommonActions.onMenuItemClick(eventData);
    }

    render() {
        console.log('render BrokerView');
        return (
            <div>
                <div>
                    <Toolbar>
                        <ToolbarGroup firstChild={true}>
                            <IconButton onTouchTap={this.onShowHideMenuClick}>
                                <ActionDehaze/>
                            </IconButton>
                            <IconButton onTouchTap={this.onReconnectBrokerClick} tooltipPosition="bottom-center" tooltip="Reconnect Broker">
                                <SignalIcon color={Colors.greenA700}/>
                            </IconButton>
                            <IconButton onTouchTap={this.onEditBrokerSettingsClick} tooltipPosition="bottom-center" tooltip="Edit Broker Settings">
                                <SettingsIcon color={Colors.brown900}/>
                            </IconButton>
                            <IconButton onTouchTap={this.onAddPublisherButtonClick} tooltipPosition="bottom-center" tooltip="Add New Publisher">
                                <CloudUploadIcon color={Colors.yellow900}/>
                            </IconButton>
                            <IconButton onTouchTap={this.onAddSubscriberButtonClick} tooltipPosition="bottom-center" tooltip="Subscribe to new topic">
                                <CloudDownloadIcon color={Colors.blue700}/>
                            </IconButton>
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <h3>{this.props.broker.brokerName}</h3>
                        </ToolbarGroup>
                    </Toolbar>
                </div>
            </div>
        );
    }
}

export default BrokerView;
