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
        this.selectMenuItem = this.selectMenuItem.bind(this);
        this.onAddBrokerMenuClick = this.onAddBrokerMenuClick.bind(this);
        this.onBrokerSelected = this.onBrokerSelected.bind(this);
        this.initView = this.initView.bind(this);

        this.state = {
            open:false,
            selectedMenu:null,
            bsList:[],
            pageData: {}
        }
        this.initView();
    }

    showHideMenu(open) { 
        this.setState({open:open});
    }

    selectMenuItem(data) { 
        switch(data.menuId) {
            case AppConstants.MENU_ADD_BROKER:
                this.onAddBrokerMenuClick();
                break;
            case AppConstants.MENU_BROKER_DETAILS:
                this.onBrokerSelected(data);
                break;
        }
    }

    onAddBrokerMenuClick() { 
        this.setState({open:false,selectedMenu:AppConstants.MENU_ADD_BROKER,pageData:{}});
    }

    onBrokerSelected(data) { 
        var pageData = {};
        Q.fcall(BrokerSettingsStore.getAllBrokerSettings)
        .then(function(list) {
            var bsIndex = _.findIndex(list,{'bsId':data.bsId});
            if(bsIndex!=-1) {
                pageData['broker'] = list[bsIndex];
                this.setState({bsList:list,open:false,selectedMenu:AppConstants.MENU_BROKER_DETAILS,pageData:pageData});
            } 
        }.bind(this)).done();


    }

    initView() { 
        Q.fcall(BrokerSettingsStore.getAllBrokerSettings)
        .then(function(list) {
            this.setState({bsList:list});
        }.bind(this)).done();
    }

    componentDidMount() {
        CommonRegister.addChangeListener(AppConstants.EVENT_OPEN_CLOSE_MENU,this.showHideMenu);
        CommonRegister.addChangeListener(AppConstants.EVENT_SELECT_MENU_ITEM,this.selectMenuItem);
    }

    componentWillUnmount() {
        CommonRegister.removeChangeListener(AppConstants.EVENT_OPEN_CLOSE_MENU,this.showHideMenu);
        CommonRegister.removeChangeListener(AppConstants.EVENT_SELECT_MENU_ITEM,this.selectMenuItem);
    }

    render() {
        console.log('render Main');
        var displayComponent = '';
        if(this.state.selectedMenu == AppConstants.MENU_ADD_BROKER) {
            displayComponent = <AddEditBrokerForm/>;
        } else if(this.state.selectedMenu == AppConstants.MENU_BROKER_DETAILS) {
            displayComponent = <BrokerView broker={this.state.pageData.broker}/>;
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
