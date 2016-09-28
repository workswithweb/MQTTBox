import React from 'react';

import LeftMenuButton from '../common/LeftMenuButton';
import PlatformUtils from '../../platform/common/PlatformUtils';
import NavUtils from '../../utils/NavUtils';
import CommonConstants from '../../utils/CommonConstants';

const styles = {
    clickDiv: {
        cursor:'pointer',
        fontWeight: 'bold',
        margin:10
    },
    buttonContainer: {
        marginTop:10,
        marginRight:5
    }
};

export default class AboutApp extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-default navbar-fixed-top">
                    <div>
                        <div className="navbar-header">
                            <LeftMenuButton/>
                        </div>
                        <div id="navbar" className="navbar-collapse collapse">
                            <ul className="nav navbar-nav">
                                <li style={styles.buttonContainer}>
                                    <button onClick={NavUtils.goToMqttClientList} title="MQTT CLIENTS" type="button" className="btn btn-default">
                                      <span className="glyphicon glyphicon-modal-window" aria-hidden="true"></span>
                                    </button>
                                </li>
                                <li style={styles.buttonContainer}>
                                    <button onClick={NavUtils.goToMqttLoadList} title="MQTT LOAD" type="button" className="btn btn-default">
                                      <span className="glyphicon glyphicon-flash" aria-hidden="true"></span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div className="media">
                    <div style={styles.clickDiv} className="media-left">
                        <img style={{width:100,height:100}} className="media-object"
                            onClick={PlatformUtils.openExternalLink.bind(this,"http://workswithweb.com/mqttbox.html")}
                            src="./images/icon-128.png" alt="workswithweb.com"/>
                    </div>
                    <div className="media-body">
                        <h3 className="media-heading">MQTTBox</h3>
                        <h4 className="media-heading">Version {CommonConstants.APP_VERSION}</h4>
                    </div>
                </div>
                <div>
                    <div onClick={PlatformUtils.openExternalLink.bind(this,"http://workswithweb.com/html/mqttbox/downloads.html")} style={styles.clickDiv}>Download Native MQTTBox Apps for Chrome, Linux, MAC and Windows  - <span className="label label-primary">Click Here</span></div>
                    <div onClick={PlatformUtils.openExternalLink.bind(this,"http://workswithweb.com/mqttbox.html")} style={styles.clickDiv}>Documentation - <span className="label label-primary">Click Here</span></div>
                    <div onClick={PlatformUtils.openExternalLink.bind(this,"http://workswithweb.com/mqttbox/app")} style={styles.clickDiv}>Web app - <span className="label label-primary">Click Here</span></div>
                    <div style={{margin:10}}>
                        <b>If you have issues or request new features, please
                        contact us via email - <b><span className="label label-success">workswithweb@gmail.com</span></b> or request on Github
                        <span onClick={PlatformUtils.openExternalLink.bind(this,"https://github.com/workswithweb/MQTTBox")} style={styles.clickDiv} className="label label-primary">
                            Here
                        </span>
                        </b>
                    </div>
                </div>
            </div>
        );
    }
}