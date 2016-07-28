import React from 'react';
import UUID from 'node-uuid';
import _ from 'lodash';

import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import ActionDehaze from 'material-ui/svg-icons/image/dehaze';
import * as Colors from 'material-ui/styles/colors.js';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import SignalIcon from 'material-ui/svg-icons/device/network-wifi';
import CloudUploadIcon from 'material-ui/svg-icons/file/cloud-upload';
import CloudDownloadIcon from 'material-ui/svg-icons/file/cloud-download';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import {Responsive, WidthProvider} from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

import AppActions from '../actions/AppActions';
import BrokerSettingsService from '../services/BrokerSettingsService';
import BrokerConnectionService from '../services/BrokerConnectionService';
import Publisher from './Publisher';
import Subscriber from './Subscriber';
import AppConstants from '../utils/AppConstants';
import PublisherSettings from '../models/PublisherSettings';
import SubscriberSettings from '../models/SubscriberSettings';

class BrokerView extends React.Component {

    constructor(props) {
        super(props);
        this.onShowHideMenuClick = this.onShowHideMenuClick.bind(this);
        this.onEditBrokerSettingsClick = this.onEditBrokerSettingsClick.bind(this);
        this.onAddPublisherButtonClick = this.onAddPublisherButtonClick.bind(this);
        this.onAddSubscriberButtonClick = this.onAddSubscriberButtonClick.bind(this);
        this.onBrokerSettingsChanged = this.onBrokerSettingsChanged.bind(this);
        this.onReconnectBrokerClick = this.onReconnectBrokerClick.bind(this);
        this.state = {updatedAt:+(new Date())};
    }

    onEditBrokerSettingsClick() {
        window.location.hash = AppConstants.PAGE_URL_ADD_EDIT_CLIENT_BROKER_SETTINGS+'/'+this.props.params.bsId;
    }

    onAddPublisherButtonClick() {
        AppActions.onAddPublisherButtonClick({bsId:this.props.params.bsId,publisher:new PublisherSettings()});
    }

    onAddSubscriberButtonClick() {
        AppActions.onAddSubscriberButtonClick({bsId:this.props.params.bsId,subscriber:new SubscriberSettings()});
    }

    onShowHideMenuClick() {
        AppActions.showHideMenu(true);
    }

    onReconnectBrokerClick() {
        var bsObj = BrokerSettingsService.getBrokerSettingDataByBsId(this.props.params.bsId);
        AppActions.saveBrokerSettings(bsObj);
    }

    createPublishersView(bsObj) {
        var publishersListView = [];
        var publishersList = bsObj.publishSettings;

        if(publishersList!=null && publishersList.length>0) {
            publishersList = _.sortBy(publishersList, ['createdOn']);

            for (var i=publishersList.length;i>0;i--) {
                var publisher = publishersList[i-1];
                if(publisher!=null && publisher.pubId!=null) {
                    var publisherXPos = (publishersListView.length%4);
                    var subscriberYPos = Math.floor(publishersListView.length/4);
                    publishersListView.push(<div key={'key_'+publisher.pubId+'_'+publisherXPos+'_'+subscriberYPos} data-grid={{i:publisher.pubId,x:publisherXPos, y:subscriberYPos, w: 1, h: 3}}><Publisher key={'key_'+publisher.pubId+'_'+publisherXPos+'_'+subscriberYPos} bsId={bsObj.bsId} publisherSettings={publisher}/></div>);
                }
            }
        }
        return publishersListView;
    }

    createSubscribersView(bsObj) {
        var subscribersListView = [];
        var subscribersList = bsObj.subscribeSettings;
        var publisherLength = 0;

        if(bsObj.publishSettings && bsObj.publishSettings.length>0) {
            publisherLength = bsObj.publishSettings.length;
        }

        if(subscribersList!=null && subscribersList.length>0) {
            subscribersList = _.sortBy(subscribersList, ['createdOn']);

            for (var i=subscribersList.length;i>0;i--) {
                var subscriber = subscribersList[i-1];
                if(subscriber!=null && subscriber.subId!=null) {
                    var subscriberXPos = ((subscribersListView.length+publisherLength)%4);
                    var subscriberYPos = Math.floor((subscribersListView.length+publisherLength)/4);
                    subscribersListView.push(<div key={'key_'+subscriber.subId+'_'+subscriberXPos+'_'+subscriberYPos} data-grid={{i:subscriber.subId,x:subscriberXPos, y: subscriberYPos, w: 1, h: 3}}><Subscriber key={'key_'+subscriber.subId+'_'+subscriberXPos+'_'+subscriberYPos} bsId={bsObj.bsId} subscriberSettings={subscriber}/></div>);
                }
            }
        }
        return subscribersListView;
    }

    onBrokerSettingsChanged(bsId) {
        if(bsId == this.props.params.bsId) {
            this.setState({updatedAt:+(new Date())});
        }
    }

    componentDidMount() {
        BrokerSettingsService.addChangeListener(AppConstants.EVENT_BROKER_SETTINGS_CHANGED,this.onBrokerSettingsChanged);
        BrokerConnectionService.addChangeListener(AppConstants.EVENT_BROKER_SETTINGS_CHANGED,this.onBrokerSettingsChanged);
    }

    componentWillUnmount() {
        BrokerSettingsService.removeChangeListener(AppConstants.EVENT_BROKER_SETTINGS_CHANGED,this.onBrokerSettingsChanged);
        BrokerConnectionService.removeChangeListener(AppConstants.EVENT_BROKER_SETTINGS_CHANGED,this.onBrokerSettingsChanged);
    }

    render() {
        var bsObj = BrokerSettingsService.getBrokerSettingDataByBsId(this.props.params.bsId);
        var bsMetaData = BrokerConnectionService.getBrokerMetaData(this.props.params.bsId);

        var connState = AppConstants.OFFLINE;
        if(bsMetaData!=null && bsMetaData.connState!=null) {
            connState = bsMetaData.connState;
        }

        var gridList = this.createPublishersView(bsObj).concat(this.createSubscribersView(bsObj));

        return (
            <div>
                <div>
                    <Toolbar>
                        <ToolbarGroup firstChild={true}>
                            <IconButton onTouchTap={this.onShowHideMenuClick}>
                                <ActionDehaze/>
                            </IconButton>
                            <IconButton onTouchTap={this.onEditBrokerSettingsClick} tooltipPosition="bottom-center" tooltip="Edit broker settings">
                                <SettingsIcon color={Colors.brown900}/>
                            </IconButton>
                            <IconButton onTouchTap={this.onReconnectBrokerClick} tooltipPosition="bottom-center" tooltip="Reconnect broker">
                                <SignalIcon color={connState == AppConstants.ONLINE? Colors.greenA700:Colors.redA700} />
                            </IconButton>
                            <IconButton onTouchTap={this.onAddPublisherButtonClick} tooltipPosition="bottom-center" tooltip="Add new publisher">
                                <CloudUploadIcon color={Colors.yellow900}/>
                            </IconButton>
                            <IconButton onTouchTap={this.onAddSubscriberButtonClick} tooltipPosition="bottom-center" tooltip="Subscribe new topic">
                                <CloudDownloadIcon color={Colors.blue700}/>
                            </IconButton>
                            <h3>{bsObj.brokerName +' - '+bsObj.host}</h3>
                        </ToolbarGroup>
                    </Toolbar>
                </div>
                <div>
                    <ResponsiveReactGridLayout key={this.props.params.bsId} isDraggable={false} autoSize={true} className="layout" breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}} cols={{lg: 4, md: 3, sm: 2, xs:1, xxs: 1}}>
                        {gridList}
                    </ResponsiveReactGridLayout>
                </div>
                <div>
                    {gridList.length<=0 ?(<Card>
                        <CardTitle subtitle="Click below icons to add new Publisher or Subscriber" />
                        <CardActions>
                          <IconButton onTouchTap={this.onAddPublisherButtonClick} tooltipPosition="top-right" tooltip="Add new publisher">
                              <CloudUploadIcon color={Colors.yellow900}/>
                          </IconButton>
                          <IconButton onTouchTap={this.onAddSubscriberButtonClick} tooltipPosition="top-right" tooltip="Subscribe new topic">
                              <CloudDownloadIcon color={Colors.blue700}/>
                          </IconButton>
                        </CardActions>
                      </Card>):null}
                </div>
            </div>
        );
    }
}

export default BrokerView;
