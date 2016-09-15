import React from 'react';
import Drawer from 'material-ui/Drawer';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import ActionClear from 'material-ui/svg-icons/content/clear';
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';
import DevicesIcon from 'material-ui/svg-icons/hardware/developer-board';
import FlashIcon from 'material-ui/svg-icons/image/flash-on';
import InfoIcon from 'material-ui/svg-icons/action/info';

import NavLink from './NavLink';
import CommonEventEmitter from '../../dispatcher/CommonEventEmitter';
import CommonConstants from '../../utils/CommonConstants';

const style = {
    leftFloat: {
        float:'left'
    },
    rightFloat: {
        float:'right'
    }
};

export default class AppLeftDrawer extends React.Component {

  constructor(props) {
    super(props);
    this.handleToggle = this.handleToggle.bind(this);
    this.showHideAppLeftMenu = this.showHideAppLeftMenu.bind(this);
    this.state = {open: false};
  }

  handleToggle() {
    this.setState({open: !this.state.open});
  }

  showHideAppLeftMenu(open) {
    this.setState({open:open});
  }

  componentDidMount() {
    CommonEventEmitter.addChangeListener(CommonConstants.EVENT_OPEN_CLOSE_APP_LEFT_DRAWER,this.showHideAppLeftMenu);
  }

  componentWillUnmount() {
    CommonEventEmitter.removeChangeListener(CommonConstants.EVENT_OPEN_CLOSE_APP_LEFT_DRAWER,this.showHideAppLeftMenu);
  }

  render() {
    return (
        <Drawer open={this.state.open} docked={true} onRequestChange={this.showHideAppLeftMenu}>
            <Toolbar>
                <ToolbarGroup style={style.leftFloat}/>
                <ToolbarGroup style={style.rightFloat}>
                    <IconButton onTouchTap={this.showHideAppLeftMenu.bind(this,false)}>
                        <ActionClear/>
                    </IconButton>
                </ToolbarGroup>
            </Toolbar>
          <Divider/>
          <List>
            <ListItem
                primaryText="MQTT CLIENTS"
                leftIcon={<DevicesIcon/>}
                onClick={this.showHideAppLeftMenu.bind(this,false)}
                containerElement={<NavLink to="/mqttclientslist"/>}
            />
            <ListItem
                primaryText="ABOUT"
                leftIcon={<InfoIcon/>}
                onClick={this.showHideAppLeftMenu.bind(this,false)}
                containerElement={<NavLink to="/aboutapp"/>}
            />
          </List>
        </Drawer>
    );
  }
}