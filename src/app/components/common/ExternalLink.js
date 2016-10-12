import React from 'react'
import PlatformUtils from '../../platform/common/PlatformUtils';

const styles = {
    clickDiv: {
        cursor:'pointer',
        fontWeight: 'bold',
        margin:10,
        color:'#337ab7'
    }
};

export default React.createClass({
  render() {
    return <div onClick={PlatformUtils.openExternalLink.bind(this,this.props.href)} style={styles.clickDiv}>
        <i className="fa fa-info-circle" aria-hidden="true"></i>
        &nbsp;{this.props.displayText}
    </div>
  }
});