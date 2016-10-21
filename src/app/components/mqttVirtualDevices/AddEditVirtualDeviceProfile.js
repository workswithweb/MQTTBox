import React, {Component} from 'react';

import LeftMenuButton from '../common/LeftMenuButton';
import ExternalLink from '../common/ExternalLink';
import VirtualDeviceConnectionSettings from './VirtualDeviceConnectionSettings';
import VirtualDevicePublishMessageSettings from './VirtualDevicePublishMessageSettings';
import VirtualDeviceSubscribeMessageSettings from './VirtualDeviceSubscribeMessageSettings';

class AddEditVirtualDeviceProfile extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        var backButton = '';
        if(this.props.params.mcsId!=null) {
            deleteButton = <button style={styles.actionButton} onClick={this.deleteMqttClientSettings} type="button" className="btn btn-default">Delete</button>;
            backButton = <a className="btn btn-default" href={"#/mqttclientdashboard/"+this.props.params.mcsId}><span className="glyphicon glyphicon-arrow-left" aria-hidden="true"> </span></a>;
        } else {
            backButton = <a className="btn btn-default" href="#/virtualdeviceprofilelist"><span className="glyphicon glyphicon-arrow-left" aria-hidden="true"></span></a>;
        }

        return (
            <div>
                <nav className="navbar navbar-default navbar-fixed-top">
                    <div>
                        <div className="navbar-header">
                            <LeftMenuButton/>
                            {backButton}
                            <span><b> MQTT VIRTUAL DEVICE SETTINGS</b></span>
                        </div>
                        <div id="navbar" className="navbar-collapse collapse">
                            <ul style={{marginRight:10}} className="nav navbar-nav navbar-right">
                                <ExternalLink href="http://workswithweb.com/html/mqttbox/mqtt_client_settings.html" displayText="Virtual Device Settings Help"></ExternalLink>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div className="container-fluid" style={{marginTop:10}}>
                    <div className="panel-group" id="vd" role="tablist" aria-multiselectable="true">
                        <VirtualDeviceConnectionSettings/>
                        <VirtualDevicePublishMessageSettings/>
                        <VirtualDeviceSubscribeMessageSettings/>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddEditVirtualDeviceProfile;
