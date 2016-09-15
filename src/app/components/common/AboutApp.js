import React from 'react';
const {shell} = require('electron');

import LeftMenuButton from '../common/LeftMenuButton';

const styles = {
    clickDiv: {
        cursor:'pointer',
        fontWeight: 'bold',
        margin:10
    }
};

export default class AboutApp extends React.Component {

    constructor(props) {
        super(props);
    }

    openExternalLink(url) {
        shell.openExternal(url);
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-default navbar-fixed-top">
                    <div>
                        <div className="navbar-header">
                            <LeftMenuButton/>
                        </div>
                    </div>
                </nav>
                <div className="media">
                    <div style={styles.clickDiv} className="media-left">
                        <img style={{width:100,height:100}} className="media-object"
                            onTouchTap={this.openExternalLink.bind(this,"http://workswithweb.com/mqttbox.html")}
                            src="./images/icon-128.png" alt="workswithweb.com"/>
                    </div>
                    <div className="media-body">
                        <h3 className="media-heading">MQTTBox</h3>
                        <h4 className="media-heading">Version 0.1.2</h4>
                    </div>
                </div>
                <div>
                    <div onTouchTap={this.openExternalLink.bind(this,"http://workswithweb.com/html/mqttbox/downloads.html")} style={styles.clickDiv}>Download MQTTBox Apps for other platforms  - <span className="label label-primary">Click Here</span></div>
                    <div onTouchTap={this.openExternalLink.bind(this,"http://workswithweb.com/mqttbox.html")} style={styles.clickDiv}>Documentation - <span className="label label-primary">Click Here</span></div>
                    <div onTouchTap={this.openExternalLink.bind(this,"http://workswithweb.com/mqttbox/app")} style={styles.clickDiv}>Web app - <span className="label label-primary">Click Here</span></div>
                    <div style={{margin:10}}>
                        If you have issues or request new features, please
                        contact us via email - <b><span className="label label-success">workswithweb@gmail.com</span></b> or request on Github
                        <span onTouchTap={this.openExternalLink.bind(this,"https://github.com/workswithweb/MQTTBox")} style={styles.clickDiv} className="label label-primary">
                            Here
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}