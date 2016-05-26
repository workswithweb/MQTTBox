import React from 'react';
import {deepOrange500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Tabs, Tab} from 'material-ui/Tabs';
import BrokersView from './BrokersView';

const styles = {
    tabItemContainerStyle:{
        backgroundColor:'#666'
    }
};

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
});

class Main extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
        <MuiThemeProvider muiTheme={muiTheme}>
            <Tabs tabItemContainerStyle={styles.tabItemContainerStyle}>
                <Tab label="Brokers" value="mqttBrokers" >
                    <BrokersView/>
                </Tab>
            </Tabs>
        </MuiThemeProvider>
    );
  }
}

export default Main;
