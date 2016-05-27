import React from 'react';
import {deepOrange500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppDrawer from './AppDrawer';
import BrokerView from './BrokerView';
import CommonRegister from '../dispatcher/registers/CommonRegister';
import AppConstants from '../utils/AppConstants';

const styles = {
    tabItemContainerStyle:{
        backgroundColor:'#666'
    }
};

const muiTheme = getMuiTheme({
    palette: {
        accent1Color: deepOrange500,
    }
});

class Main extends React.Component {

    constructor(props) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.showHideMenu = this.showHideMenu.bind(this);

        this.state = {
            open:false
        }
    }

    showHideMenu(open) { 
        this.setState({open:open});
    }

    componentDidMount() {
        CommonRegister.addChangeListener(AppConstants.EVENT_OPEN_CLOSE_MENU,this.showHideMenu);
    }

    componentWillUnmount() {
        CommonRegister.removeChangeListener(AppConstants.EVENT_OPEN_CLOSE_MENU,this.showHideMenu);
    }

    render() {
        console.log('render Main');
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div>
                    <AppDrawer open={this.state.open}/>
                    <BrokerView/>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default Main;
