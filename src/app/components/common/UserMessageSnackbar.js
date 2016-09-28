import React from 'react';

import CommonEventEmitter from '../../dispatcher/CommonEventEmitter';
import CommonConstants from '../../utils/CommonConstants';

const styles = {
    messageContainer: {
        textAlign:'center',
        width:'100%',
        margin:'0 auto',
        zIndex:100,
        position:'fixed'
    }
};

class UserMessageSnackbar extends React.Component {

    constructor(props) {
        super(props);

        this.showMessage = this.showMessage.bind(this);
        this.closeMessage = this.closeMessage.bind(this);

        this.state = {open: false,message:''};
    }

    showMessage(data) { 
        this.setState({open:true,message:data.message,type:data.type});
    }

    closeMessage() { 
        if(this.state.open == true) {
            this.setState({open:false,message:''});
        }
    }

    componentDidMount() {
        CommonEventEmitter.addChangeListener(CommonConstants.EVENT_SHOW_MESSAGE_TO_USER,this.showMessage);
        window.addEventListener('mousedown', this.closeMessage);
    }

    componentWillUnmount() {
        CommonEventEmitter.removeChangeListener(CommonConstants.EVENT_SHOW_MESSAGE_TO_USER,this.showMessage);
        window.removeChangeListener('mousedown', this.closeMessage);
    }

    render() {
        var component = '';

        if(this.state.open == true && this.state.message!=null && this.state.message.length>0) {
            var className = 'alert alert-dismissible';
            if(this.state.type == CommonConstants.ALERT_SUCCESS) {
                className += ' alert-success';
            } else {
                className += ' alert-danger';
            }
            component = <div className={className} style={styles.messageContainer} role="alert">
                            <button onClick={this.closeMessage} type="button" className="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <strong>{this.state.message}</strong>
                        </div>
        }

        return (
            <div>
                {component}
            </div>
        );
    }
}

export default UserMessageSnackbar;