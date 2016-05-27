import React from 'react';
import Drawer from 'material-ui/Drawer';
import {List, ListItem} from 'material-ui/List';
import DevicesIcon from 'material-ui/svg-icons/device/devices';
import CommonActions from '../actions/CommonActions';

class AppDrawer extends React.Component {

    constructor(props) {
        super(props);
        this.onRequestChange = this.onRequestChange.bind(this);
    }

    onRequestChange(open,reason) { 
        CommonActions.showHideMenu(open);
    }

    render() {
        console.log('render AppDrawer');
        return (
            <div>
                <Drawer
                  docked={false}
                  open={this.props.open}
                  onRequestChange={this.onRequestChange}
                >
                    <List>
                        <ListItem
                          primaryText="Brokers"
                          leftIcon={<DevicesIcon/>}
                          initiallyOpen={true}
                          primaryTogglesNestedList={true}
                          nestedItems={[
                            <ListItem
                              key={1}
                              primaryText="Starred"
                              leftIcon={<DevicesIcon/>}
                            />
                          ]}
                        />
                    </List>
                </Drawer>
            </div>
        );
    }
}

export default AppDrawer;
