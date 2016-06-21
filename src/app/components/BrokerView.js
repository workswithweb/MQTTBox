import React from 'react';

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

import CommonActions from '../actions/CommonActions';
import AppConstants from '../utils/AppConstants';
import Publisher from './Publisher';
import Subscriber from './Subscriber';
import BrokerSettingsAction from '../actions/BrokerSettingsAction';
import PublisherSettings from '../models/PublisherSettings';
import SubscriberSettings from '../models/SubscriberSettings';
import BrokerConnectionStore from '../stores/BrokerConnectionStore';

class BrokerView extends React.Component {

    constructor(props) {
        super(props);
        this.onShowHideMenuClick = this.onShowHideMenuClick.bind(this);
        this.onEditBrokerSettingsClick = this.onEditBrokerSettingsClick.bind(this);
        this.createPublishersView = this.createPublishersView.bind(this);
        this.createSubscribersView = this.createSubscribersView.bind(this);
        this.onAddPublisherButtonClick = this.onAddPublisherButtonClick.bind(this);
        this.onAddSubscriberButtonClick = this.onAddSubscriberButtonClick.bind(this);
        this.setConnectionState = this.setConnectionState.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.onReconnectBrokerClick = this.onReconnectBrokerClick.bind(this);

        this.state = {
            connState:AppConstants.CLOSE
        }
    }

    onShowHideMenuClick() {
        CommonActions.showHideMenu(true);
    }

    onEditBrokerSettingsClick() {
        var eventData = {menuId:AppConstants.MENU_ADD_EDIT_BROKER,bsId:this.props.broker.bsId};
        CommonActions.onMenuItemClick(eventData);
    }

    createPublishersView() {
        var publishersListView = [];
        var publishersList = this.props.broker.publishSettings;

        if(publishersList!=null && publishersList.length>0) {
            publishersList = _.sortBy(publishersList, ['createdOn']);

            for (var i=publishersList.length;i>0;i--) {
                var publisher = publishersList[i-1];
                if(publisher!=null && publisher.pubId!=null) {
                    var publisherXPos = (publishersListView.length%4);
                    var subscriberYPos = Math.floor(publishersListView.length/4);
                    publishersListView.push(<div key={'key_'+publisher.pubId+'_'+publisherXPos+'_'+subscriberYPos} _grid={{i:publisher.pubId,x:publisherXPos, y:subscriberYPos, w: 1, h: 3}}><Publisher bsId={this.props.broker.bsId} publisherSettings={publisher}/></div>);
                }
            }
        }
        return publishersListView;
    }

    createSubscribersView() {
        var subscribersListView = [];
        var subscribersList = this.props.broker.subscribeSettings;
        var publisherLength = 0;

        if(this.props.broker.publishSettings && this.props.broker.publishSettings.length>0) {
            publisherLength = this.props.broker.publishSettings.length;
        }

        if(subscribersList!=null && subscribersList.length>0) {
            subscribersList = _.sortBy(subscribersList, ['createdOn']);

            for (var i=subscribersList.length;i>0;i--) {
                var subscriber = subscribersList[i-1];
                if(subscriber!=null && subscriber.subId!=null) {
                    var subscriberXPos = ((subscribersListView.length+publisherLength)%4);
                    var subscriberYPos = Math.floor((subscribersListView.length+publisherLength)/4);
                    subscribersListView.push(<div key={'key_'+subscriber.subId+'_'+subscriberXPos+'_'+subscriberYPos} _grid={{i:subscriber.subId,x:subscriberXPos, y: subscriberYPos, w: 1, h: 3}}><Subscriber bsId={this.props.broker.bsId} subscriberSettings={subscriber}/></div>);
                }
            }
        }
        return subscribersListView;
    }

    onAddPublisherButtonClick() {
        BrokerSettingsAction.onAddPublisherButtonClick(this.props.broker.bsId,new PublisherSettings());
    }

    onAddSubscriberButtonClick() {
        BrokerSettingsAction.onAddSubscriberButtonClick(this.props.broker.bsId,new SubscriberSettings());
    }

    onReconnectBrokerClick() {
        BrokerSettingsAction.reconnectBroker(this.props.broker.bsId);
    }

    setConnectionState(data) {
        if(this.props.broker.bsId == data.bsId) {
            this.setState({connState:data.status});
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !nextProps.open;
    }

    componentDidMount() {
        BrokerConnectionStore.addChangeListener(AppConstants.EVENT_BROKER_CONNECTION_STATE_CHANGED,this.setConnectionState);
    }

    componentWillUnmount() {
        BrokerConnectionStore.removeChangeListener(AppConstants.EVENT_BROKER_CONNECTION_STATE_CHANGED,this.setConnectionState);
    }

    render() {
        var gridList = this.createPublishersView().concat(this.createSubscribersView());

        return (
            <div>
                <div>
                    <Toolbar>
                        <ToolbarGroup firstChild={true}>
                            <IconButton onTouchTap={this.onShowHideMenuClick}>
                                <ActionDehaze/>
                            </IconButton>
                            <IconButton onTouchTap={this.onReconnectBrokerClick} tooltipPosition="bottom-center" tooltip="Reconnect broker">
                                <SignalIcon color={this.state.connState == AppConstants.ONLINE? Colors.greenA700:Colors.redA700} />
                            </IconButton>
                            <IconButton onTouchTap={this.onEditBrokerSettingsClick} tooltipPosition="bottom-center" tooltip="Edit broker settings">
                                <SettingsIcon color={Colors.brown900}/>
                            </IconButton>
                            <IconButton onTouchTap={this.onAddPublisherButtonClick} tooltipPosition="bottom-center" tooltip="Add new publisher">
                                <CloudUploadIcon color={Colors.yellow900}/>
                            </IconButton>
                            <IconButton onTouchTap={this.onAddSubscriberButtonClick} tooltipPosition="bottom-center" tooltip="Subscribe new topic">
                                <CloudDownloadIcon color={Colors.blue700}/>
                            </IconButton>
                            <h3>{this.props.broker.brokerName}</h3>
                        </ToolbarGroup>
                        <ToolbarGroup>

                        </ToolbarGroup>
                    </Toolbar>
                </div>
                <div>
                    <ResponsiveReactGridLayout key={this.props.broker.bsId} isDraggable={false} autoSize={true} className="layout" breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}} cols={{lg: 4, md: 3, sm: 2, xs:1, xxs: 1}}>
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
