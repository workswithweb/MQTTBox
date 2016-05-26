import React from 'react';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import AddEditBrokerForm from './AddEditBrokerForm';

class BrokersView extends React.Component {

  constructor(props, context) {
    super(props, context);
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
            <AddEditBrokerForm/>
        </div>
    );
  }
}

export default BrokersView;
