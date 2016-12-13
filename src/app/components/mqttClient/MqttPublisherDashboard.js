import React from 'react';

import LeftMenuButton from '../common/LeftMenuButton';
import MqttClientService from '../../services/MqttClientService';

export default class MqttPublisherDashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {conState:MqttClientService.getMqttClientStateByMcsId(this.props.params.mcsId),
                                mqttClientSettings:MqttClientService.getMqttClientSettingsByMcsId(this.props.params.mcsId)};
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-default navbar-fixed-top">
                    <div>
                        <div className="navbar-header">
                            <LeftMenuButton/>
                            <a href={"#/mqttclientdashboard/"+this.props.params.mcsId} className="btn btn-default"><span className="glyphicon glyphicon-arrow-left" aria-hidden="true"> </span></a>
                        </div>
                        <div id="navbar" className="navbar-collapse collapse">
                            <ul className="nav navbar-nav">
                                <li>
                                    <button onClick={this.changeConnectionState} style={styles.button} type="button" className={conStateColor} aria-label="Left Align">
                                        <span className="glyphicon glyphicon-signal" aria-hidden="true"></span> {conStateText}
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div className="container-fluid">
                    <div className="row">
                        This is mqtt publisher dashboard
                    </div>
                </div>
            </div>
        );
    }
}