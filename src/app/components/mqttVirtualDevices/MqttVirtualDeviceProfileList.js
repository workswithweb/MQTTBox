import React, {Component} from 'react';

import LeftMenuButton from '../common/LeftMenuButton';
import NavUtils from '../../utils/NavUtils';

const styles = {
    container: {
        marginTop:10
    },
    buttonContainer: {
        marginTop:10,
        marginRight:5
    }
}

class MqttVirtualDeviceProfileList extends Component {

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
                            <span style={{margin:15}}>MQTT VIRTUAL DEVICES</span>
                        </div>
                        <div id="navbar" className="navbar-collapse collapse">
                            <ul className="nav navbar-nav">
                                <li style={styles.buttonContainer}>
                                    <button onClick={NavUtils.gotToAddMqttVirtualDeviceProfile} type="button" className="btn btn-success">
                                        <b>Create MQTT Virtual Device Profile</b>
                                    </button>
                                </li>
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
                <div className="container-fluid" style={styles.container}>
                    <div className="row">
                        MQTT Virtual devices
                    </div>
                </div>
            </div>
        );
    }
}

export default MqttVirtualDeviceProfileList;