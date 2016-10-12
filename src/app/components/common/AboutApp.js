import React from 'react';

import LeftMenuButton from '../common/LeftMenuButton';
import PlatformUtils from '../../platform/common/PlatformUtils';
import NavUtils from '../../utils/NavUtils';
import CommonConstants from '../../utils/CommonConstants';

const styles = {
    clickDiv: {
        cursor:'pointer'
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
                <div className="container-fluid" style={{margin:10}}>
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
                        <div style={{textAlign:'center'}} className="row">
                            <div className="col-xs-12 col-sm-4 col-md-3">
                                <div style={{minHeight:160}} className="thumbnail">
                                    <div>
                                        <div className="caption">
                                            <h4>Follow Us</h4>
                                            <p>For latest news and release, follow us on</p>
                                            <span onClick={PlatformUtils.openExternalLink.bind(this,"https://twitter.com/workswithweb")} style={styles.clickDiv} ><i style={{color:'#00aced'}} className="fa fa-twitter fa-2x" aria-hidden="true"></i></span>&nbsp;&nbsp;
                                            <span onClick={PlatformUtils.openExternalLink.bind(this,"https://www.facebook.com/mqttbox")} style={styles.clickDiv} ><i onClick={PlatformUtils.openExternalLink.bind(this,this.props.href)} style={styles.clickDiv} style={{color:'#3b5998'}} className="fa fa-facebook-official fa-2x" aria-hidden="true"></i></span>&nbsp;&nbsp;
                                            <span onClick={PlatformUtils.openExternalLink.bind(this,"https://github.com/workswithweb/MQTTBox")} style={styles.clickDiv} ><i onClick={PlatformUtils.openExternalLink.bind(this,this.props.href)} style={styles.clickDiv} className="fa fa-github fa-2x" aria-hidden="true"></i></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-4 col-md-3">
                                <div style={{height:160}}  className="thumbnail">
                                    <div onClick={PlatformUtils.openExternalLink.bind(this,"http://workswithweb.com/html/mqttbox/downloads.html")} style={styles.clickDiv}>
                                        <div className="caption">
                                            <h4>MQTTBox Download</h4>
                                            <p>Apps for Chrome, Linux, Mac, Web and Windows</p>
                                            <p className="btn btn-primary">Download</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-4 col-md-3">
                                <div style={{minHeight:160}} className="thumbnail">
                                    <div onClick={PlatformUtils.openExternalLink.bind(this,"http://workswithweb.com/mqttbox.html")} style={styles.clickDiv}>
                                        <div className="caption">
                                            <h4>MQTTBox Documentation</h4>
                                            <p>Learn about MQTTBox features and tutorials</p>
                                            <p className="btn btn-primary">Documentation</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-4 col-md-3">
                                <div style={{minHeight:160}} className="thumbnail">
                                    <div>
                                        <div className="caption">
                                            <h4>Contact Us</h4>
                                            <p>If you have feature requests, custom app requirements or bugs, contact us at <b>workswithweb@outlook.com</b></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}