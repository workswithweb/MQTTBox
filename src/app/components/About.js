import React from 'react';
import ActionDehaze from 'material-ui/svg-icons/image/dehaze';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import {Card,CardTitle, CardActions, CardHeader, CardText} from 'material-ui/Card';
import Subheader from 'material-ui/Subheader';

import AppActions from '../actions/AppActions';

const styles = {
    marginBottom: {
        marginBottom: 15
    }
};

class About extends React.Component {

    constructor(props) {
        super(props);
        this.onShowHideMenuClick = this.onShowHideMenuClick.bind(this);
    }

    onShowHideMenuClick() {
        AppActions.showHideMenu(true);
    }

    render() {
       return(
        <div>
            <Toolbar>
                <ToolbarGroup>
                    <IconButton onTouchTap={this.onShowHideMenuClick}>
                        <ActionDehaze/>
                    </IconButton>
                </ToolbarGroup>
            </Toolbar>
            <div>
                <Card>
                    <CardHeader
                      title="MQTTBox"
                      subtitle="Version 0.0.14"
                      avatar="./img/icon-128.png"
                    />
                    <CardText >
                        <div style={styles.marginBottom}>
                            <b>Please <a target="_blank" href="https://chrome.google.com/webstore/detail/mqttbox/kaajoficamnjijhkeomgfljpicifbkaf/reviews">leave a review</a> to support us, make this tool awesome and help others find.</b>
                        </div>
                        <div style={styles.marginBottom}>
                            <b>Web app - <a target="_blank" href="http://workswithweb.com/mqttbox/app">Click Here</a></b>
                        </div>
                        <div style={styles.marginBottom}>
                            <b>Chrome app - <a target="_blank" href="https://chrome.google.com/webstore/detail/mqttbox/kaajoficamnjijhkeomgfljpicifbkaf">Click Here</a></b>
                        </div>
                        <div style={styles.marginBottom}>
                           <b>Source on Github - <a target="_blank" href="https://github.com/workswithweb/MQTTBox">Click Here</a></b>
                        </div>
                    </CardText>
                  </Card>
                  <Card>
                      <CardTitle title="Road map"/>
                      <CardText>
                        <ul>
                          <li>MQTT Load - Load testing support</li>
                          <li>Adding help pages</li>
                          <li>Sync - Sync all your MQTT data to cloud and can be reached from any computer.</li>
                          <li>Bug fixes - included in every release</li>
                          <li>Native desktop apps for Linux, Mac and Windows</li>
                        </ul>
                        <b><a target="_blank" href="https://chrome.google.com/webstore/detail/mqttbox/kaajoficamnjijhkeomgfljpicifbkaf/reviews">Click Here</a> to write a Review, Report Feature Requests, Enhancements and Bugs</b>
                      </CardText>
                  </Card>
            </div>
        </div>
       );
    }
}

export default About;