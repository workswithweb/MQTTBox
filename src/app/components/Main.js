import React from 'react';
import {deepOrange500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppDrawer from './AppDrawer';
import BrokerView from './BrokerView';

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
            <div>
                <AppDrawer open={false}/>
                <BrokerView/>
            </div>
        </MuiThemeProvider>
    );
  }
}

export default Main;
