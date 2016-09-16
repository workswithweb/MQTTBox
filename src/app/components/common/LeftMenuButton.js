import React from 'react'
import CommonActions from '../../actions/CommonActions';

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
                    <li><a href="#">Action</a></li>
                    <li><a href="#">Another action</a></li>
                    <li><a href="#">Something else here</a></li>
                    <li><a href="#">Separated link</a></li>
                </ul>
            </span>);
    }
});
