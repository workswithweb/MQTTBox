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
                      subtitle="Version 0.1.0"
                      avatar="./images/icon-128.png"
                    />
                    <CardText >
                        <div style={styles.marginBottom}>
                            <b>Please <a target="_blank" href="https://chrome.google.com/webstore/detail/mqttbox/kaajoficamnjijhkeomgfljpicifbkaf/reviews">leave a review</a> to support us, make this tool awesome and help others find.</b>
                        </div>
                        <div style={styles.marginBottom}>
                            <b>Documentation - <a target="_blank" href="http://workswithweb.com/mqttbox.html">Click Here</a></b>
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
            </div>
        </div>
       );
    }
}

export default About;