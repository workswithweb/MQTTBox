import React from 'react';
import Q from 'q';
import _ from 'lodash';
import UUID from 'node-uuid';

import {deepOrange500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CircularProgress from 'material-ui/CircularProgress';

import AppDrawer from './AppDrawer';
import BrokerView from './BrokerView';
import AddEditBrokerForm from './AddEditBrokerForm';
import UserMessage from './UserMessage';
import BrokerSettingsStore from '../stores/BrokerSettingsStore';
import BrokerConnectionStore from '../stores/BrokerConnectionStore';
import CommonRegister from '../dispatcher/registers/CommonRegister';
import BrokerSettingsAction from '../actions/BrokerSettingsAction';
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
        this.onAddEditBrokerMenuClick = this.onAddEditBrokerMenuClick.bind(this);
        this.onBrokerSelected = this.onBrokerSelected.bind(this);
        this.state = {bsList:[],open:false,selectedMenu:null,pageData:{}}
        this.onBrokerSelected();
    }

    showHideMenu(open) { 
        this.setState({open:open});
    }

    selectMenuItem(data) { 
        switch(data.menuId) {
            case AppConstants.MENU_ADD_EDIT_BROKER:
                this.onAddEditBrokerMenuClick(data);
                break;
            case AppConstants.MENU_BROKER_DETAILS:
                this.onBrokerSelected(data);
                break;
        }
    }

    onAddEditBrokerMenuClick(data) { 
        var broker = null;
        if(data!=null && data.bsId!=null) {
            var bsIndex = _.findIndex(this.state.bsList,{'bsId':data.bsId});
            if(bsIndex>=0) {
                broker = this.state.bsList[bsIndex];
            }
        }
        this.setState({open:false,selectedMenu:AppConstants.MENU_ADD_EDIT_BROKER,pageData:{broker:broker}});
    }

    onBrokerSelected(data) { 
        Q.fcall(BrokerSettingsStore.getAllBrokerSettings)
        .then(function(list) {
            if(list!=null && list.length>0) {
                var bsIndex = _.findIndex(list,{'bsId':data!=null?data.bsId:0});
                bsIndex = bsIndex!=-1?bsIndex:0;
                this.setState({ bsList:list,
                                open:false,
                                selectedMenu:AppConstants.MENU_BROKER_DETAILS,
                                pageData:{broker:list[bsIndex]}
                             });
                BrokerSettingsAction.setCurrentSelectedBroker(list[bsIndex].bsId);
            } else {
                this.setState({ bsList:list,
                                open:false,
                                selectedMenu:AppConstants.MENU_ADD_EDIT_BROKER,
                                pageData:{broker:null}
                             });
            }
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
        var displayComponent = '';
        var appDrawer = '';

        if(this.state!=null && this.state.selectedMenu!=null) {
            if(this.state.selectedMenu == AppConstants.MENU_ADD_EDIT_BROKER) {
                var selectedMenuKey = '';
                if(this.state.pageData!=null && this.state.pageData.broker!=null && this.state.pageData.broker.bsId!=null) {
                    selectedMenuKey = this.state.pageData.broker.bsId
                } else {
                    selectedMenuKey = UUID.v4();
                }
                displayComponent = <AddEditBrokerForm key={selectedMenuKey} open={this.state.open} broker={this.state.pageData.broker}/>;
            } else if(this.state.selectedMenu == AppConstants.MENU_BROKER_DETAILS) {
                displayComponent = <BrokerView open={this.state.open} broker={this.state.pageData.broker}/>;
            }
            appDrawer = <AppDrawer open={this.state.open} bsList={this.state.bsList}/>;
        } else {
            displayComponent = <CircularProgress size={2}/>;
        }


        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div>
                    {appDrawer}
                    {displayComponent}
                    <UserMessage/>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default Main;
