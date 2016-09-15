import React from 'react'
import CommonActions from '../../actions/CommonActions';

const styles = {
    button: {
        margin: 10
    }
};

export default React.createClass({
    render() {
        return (<span>
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
            </button>
            <button onTouchTap={CommonActions.showHideAppLeftMenu.bind(this,{open:true})}
                style={styles.button} type="button" className="btn btn-default" aria-label="Left Align">
                <span className="glyphicon glyphicon-menu-hamburger" aria-hidden="true"></span><b> Menu</b>
            </button>
        </span>);
    }
});