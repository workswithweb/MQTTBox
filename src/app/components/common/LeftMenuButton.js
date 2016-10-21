import React from 'react'

const styles = {
    button: {
        margin: 10
    }
};

export default React.createClass({
    render() {
        return (
            <span>
                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                </button>
                <button style={styles.button} type="button" className="btn btn-default dropdown-toggle" aria-label="Left Align" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span className="glyphicon glyphicon-menu-hamburger" aria-hidden="true"></span><b> Menu</b>
                </button>
                <ul className="dropdown-menu">
                    <li><a href="#/mqttclientslist"><span className="glyphicon glyphicon-modal-window" aria-hidden="true"></span><b> MQTT CLIENTS</b></a></li>
                    <li><a href="#/virtualdeviceprofilelist"><span className="glyphicon glyphicon-dashboard" aria-hidden="true"></span><b> MQTT VIRTUAL DEVICES</b></a></li>
                    <li><a href="#/mqttloadlist"><span className="glyphicon glyphicon-flash" aria-hidden="true"></span><b> MQTT LOAD</b></a></li>
                    <li><a href="#/aboutapp"><span className="glyphicon glyphicon-info-sign" aria-hidden="true"></span><b> ABOUT</b></a></li>
                </ul>
            </span>);
    }
});
