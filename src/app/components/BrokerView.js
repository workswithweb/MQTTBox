import React from 'react';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

class BrokerView extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div>
            <Toolbar>
                <ToolbarGroup firstChild={true}>
                    <DropDownMenu value="addNewBroker">
                        <MenuItem value="addNewBroker" primaryText="Add New Broker" />
                    </DropDownMenu>
                </ToolbarGroup>
            </Toolbar>
        </div>
    );
  }
}

export default BrokerView;
