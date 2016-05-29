import React from 'react';
import Q from 'q';

import {deepOrange500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import AppDrawer from './AppDrawer';
import BrokerView from './BrokerView';
import AddEditBrokerForm from './AddEditBrokerForm';
import BrokerSettingsStore from '../stores/BrokerSettingsStore';
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
        this.onMenuItemClick = this.onMenuItemClick.bind(this);
        this.onAddBrokerMenuClick = this.onAddBrokerMenuClick.bind(this);
        this.initView = this.initView.bind(this);

        this.state = {
            open:false,
            selectedMenu:null,
            bsList:[]
        }
        this.initView();
    }

    showHideMenu(open) { 
        this.setState({open:open});
    }

    onMenuItemClick(menuId,data) { 
        switch(menuId) {
            case AppConstants.MENU_ADD_BROKER:
                this.onAddBrokerMenuClick();
                break;
        }
    }

    onAddBrokerMenuClick() { 
        this.setState({open:false,selectedMenu:AppConstants.MENU_ADD_BROKER});
    }

    initView() { 
        Q.fcall(BrokerSettingsStore.getAllBrokerSettings)
        .then(function(list) {
            this.setState({bsList:list});
        }.bind(this)).done();
    }

    componentDidMount() {
        CommonRegister.addChangeListener(AppConstants.EVENT_OPEN_CLOSE_MENU,this.showHideMenu);
        CommonRegister.addChangeListener(AppConstants.EVENT_SELECT_MENU_ITEM,this.onMenuItemClick);
        //CHANGE THIS TO CONNECTION EVENTS
        CommonRegister.addChangeListener(AppConstants.EVENT_BROKER_SETTINGS_CHANGED,this.initView);
    }

    componentWillUnmount() {
        CommonRegister.removeChangeListener(AppConstants.EVENT_OPEN_CLOSE_MENU,this.showHideMenu);
        CommonRegister.removeChangeListener(AppConstants.EVENT_SELECT_MENU_ITEM,this.onMenuItemClick);
        //CHANGE THIS TO CONNECTION EVENTS
        CommonRegister.removeChangeListener(AppConstants.EVENT_BROKER_SETTINGS_CHANGED,this.initView);
    }

    render() {
        console.log('render Main');
        var displayComponent = '';
        if(this.state.selectedMenu == AppConstants.MENU_ADD_BROKER) {
            displayComponent = <AddEditBrokerForm/>;
        } else {
            displayComponent = <BrokerView/>;
        }
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div>
                    <AppDrawer open={this.state.open} bsList={this.state.bsList}/>
                    {displayComponent}
                </div>
            </MuiThemeProvider>
        );
    }
}

export default Main;
