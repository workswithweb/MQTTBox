import React from 'react';
import Snackbar from 'material-ui/Snackbar';

import CommonAppService from '../services/CommonAppService';
import AppConstants from '../utils/AppConstants';

class UserMessage extends React.Component {

    constructor(props) {
        super(props);
        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.showUserMessage = this.showUserMessage.bind(this);

        this.state = {
              open: false,
              message:'',
              autoHideDuration:10000
        };
    }

    showUserMessage(data) { 
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
        CommonAppService.addChangeListener(AppConstants.EVENT_SHOW_MESSAGE,this.showUserMessage);
    }

    componentWillUnmount() {
        CommonAppService.removeChangeListener(AppConstants.EVENT_SHOW_MESSAGE,this.showUserMessage);
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

export default UserMessage;
