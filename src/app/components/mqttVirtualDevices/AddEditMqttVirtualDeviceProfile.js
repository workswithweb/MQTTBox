import React, {Component} from 'react';

import LeftMenuButton from '../common/LeftMenuButton';
import ExternalLink from '../common/ExternalLink';

class AddEditMqttVirtualDeviceProfile extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        var backButton = '';
        if(this.props.params.mcsId!=null) {
            deleteButton = <button style={styles.actionButton} onClick={this.deleteMqttClientSettings} type="button" className="btn btn-default">Delete</button>;
            backButton = <a href={"#/mqttclientdashboard/"+this.props.params.mcsId} className="navButton"><b><span className="glyphicon glyphicon-arrow-left" aria-hidden="true"> </span> BACK</b></a>;
        } else {
            backButton = <a href="#/mqttvirtualdevicesprofilelist" className="navButton"><b><span className="glyphicon glyphicon-arrow-left" aria-hidden="true"> </span> BACK</b></a>;
        }

        return (
            <div>
                <nav className="navbar navbar-default navbar-fixed-top">
                    <div>
                        <div className="navbar-header">
                            <LeftMenuButton/>
                            {backButton}
                        </div>
                        <div id="navbar" className="navbar-collapse collapse">
                            <ul style={{marginRight:10}} className="nav navbar-nav navbar-right">
                                <ExternalLink href="http://workswithweb.com/html/mqttbox/mqtt_client_settings.html" displayText="Virtual Device Settings Help"></ExternalLink>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div className="container-fluid" style={{margin:10,border:'1px solid #e7e7e7',borderRadius:5,padding:20}}>
                    add virtual device form
                </div>
            </div>
        );
    }
}

export default AddEditMqttVirtualDeviceProfile;
