import React from 'react';

import Drawer from 'material-ui/Drawer';
import {List, ListItem} from 'material-ui/List';
import DevicesIcon from 'material-ui/svg-icons/hardware/developer-board';
import AddIcon from 'material-ui/svg-icons/content/add-circle-outline';
import IconButton from 'material-ui/IconButton';
import ActionClear from 'material-ui/svg-icons/content/clear';
import Divider from 'material-ui/Divider';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';

import CommonActions from '../actions/CommonActions';
import AppConstants from '../utils/AppConstants';

const styles = {
    closeMenu:{
        float:'right',
        width: '100%'
    }
};

class AppDrawer extends React.Component {

    constructor(props) {
        super(props);
        this.onRequestChange = this.onRequestChange.bind(this);
        this.onShowHideMenuClick = this.onShowHideMenuClick.bind(this);
        this.onMenuItemClick = this.onMenuItemClick.bind(this);
    }

    onRequestChange(open,reason) { 
        CommonActions.showHideMenu(open);
    }

    onShowHideMenuClick() {
        CommonActions.showHideMenu(false);
    }

    onMenuItemClick(menuId,data) {
        var eventData = {"menuId":menuId};
        if(menuId == AppConstants.MENU_BROKER_DETAILS) {
            eventData["bsId"] = data;
        }
        CommonActions.onMenuItemClick(eventData);
    }

    render() {
        console.log('render AppDrawer');
        var brokerList = this.props.bsList.map(function(brokerSetting,index) {
            return (
                <ListItem
                  key={brokerSetting.bsId}
                  primaryText={brokerSetting.brokerName}
                  onTouchTap={this.onMenuItemClick.bind(this,AppConstants.MENU_BROKER_DETAILS,brokerSetting.bsId)}
                />
            );
        }.bind(this));
        brokerList.push(<ListItem
                          key="addNewBroker"
                          primaryText="Add New Broker"
                          onTouchTap={this.onMenuItemClick.bind(this,AppConstants.MENU_ADD_EDIT_BROKER)}
                          leftIcon={<AddIcon/>}
                        />);
        return (
            <div>
                <Drawer
                  docked={true}
                  open={this.props.open}
                  onRequestChange={this.onRequestChange}
                >
                    <Toolbar>
                        <ToolbarGroup float='left'>
                        </ToolbarGroup>
                        <ToolbarGroup float='right'>
                            <IconButton onTouchTap={this.onShowHideMenuClick}>
                                <ActionClear/>
                            </IconButton>
                        </ToolbarGroup>
                    </Toolbar>
                    <Divider />
                    <List>
                        <ListItem
                          primaryText="Brokers"
                          leftIcon={<DevicesIcon/>}
                          initiallyOpen={true}
                          primaryTogglesNestedList={true}
                          nestedItems={brokerList}
                        />
                    </List>
                </Drawer>
            </div>
        );
    }
}

export default AppDrawer;
