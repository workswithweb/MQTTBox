import React, {Component} from 'react';
import {deepOrange500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import AppLeftDrawer from './common/AppLeftDrawer';
import UserMessageSnackbar from './common/UserMessageSnackbar';

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
});

class Main extends Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div>
                    <AppLeftDrawer/>
                    {this.props.children}
                    <UserMessageSnackbar/>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default Main;
