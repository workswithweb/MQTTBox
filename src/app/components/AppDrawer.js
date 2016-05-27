import React from 'react';
import Drawer from 'material-ui/Drawer';
import {List, ListItem} from 'material-ui/List';
import ContentInbox from 'material-ui/svg-icons/content/inbox';

class AppDrawer extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div>
            <Drawer
              docked={false}
              open={this.props.open}
            >
                <List>
                    <ListItem
                      primaryText="Brokers"
                      leftIcon={<ContentInbox />}
                      initiallyOpen={true}
                      primaryTogglesNestedList={true}
                      nestedItems={[
                        <ListItem
                          key={1}
                          primaryText="Starred"
                        />,
                        <ListItem
                          key={2}
                          primaryText="Sent Mail"
                          disabled={true}
                          nestedItems={[
                            <ListItem key={1} primaryText="Drafts"/>,
                          ]}
                        />,
                      ]}
                    />
                </List>
            </Drawer>
        </div>
    );
  }
}

export default AppDrawer;
