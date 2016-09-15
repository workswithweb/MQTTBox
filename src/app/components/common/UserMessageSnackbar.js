import React from 'react';
import Snackbar from 'material-ui/Snackbar';

import CommonEventEmitter from '../../dispatcher/CommonEventEmitter';
import CommonConstants from '../../utils/CommonConstants';

class UserMessageSnackbar extends React.Component {

    constructor(props) {
        super(props);
        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.showMessageToUser = this.showMessageToUser.bind(this);

        this.state = {
              open: false,
              message:'',
              autoHideDuration:10000
        };
    }

    showMessageToUser(data) { 
        var autoHideDuration = 10000;
        if(data.autoHideDuration && data.autoHideDuration>0) {
            autoHideDuration = data.autoHideDuration;
        }
        this.setState({open:true,message:data.message,autoHideDuration:autoHideDuration});
    }

    handleRequestClose() { 
        this.setState({open:false,message:''});
    }

    componentDidMount() {
        CommonEventEmitter.addChangeListener(CommonConstants.EVENT_SHOW_MESSAGE_TO_USER,this.showMessageToUser);
    }

    componentWillUnmount() {
        CommonEventEmitter.removeChangeListener(CommonConstants.EVENT_SHOW_MESSAGE_TO_USER,this.showMessageToUser);
    }

    render() {
        return (
            <div>
                <Snackbar
                    open={this.state.open}
                    message={this.state.message}
                    autoHideDuration={this.state.autoHideDuration}
                    onRequestClose={this.handleRequestClose}
                    onActionTouchTap={this.handleRequestClose}
                    action="OK"
                />
            </div>
        );
    }
}

export default UserMessageSnackbar;