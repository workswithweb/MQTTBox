import React from 'react';
import Snackbar from 'material-ui/Snackbar';

import CommonRegister from '../dispatcher/registers/CommonRegister';
import AppConstants from '../utils/AppConstants';

class UserMessage extends React.Component {

    constructor(props) {
        super(props);
        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.showUserMessage = this.showUserMessage.bind(this);

        this.state = {
              open: false,
              message:''
        };
    }

    showUserMessage(data) { 
        this.setState({open:true,message:data.message});
    }

    handleRequestClose() { 
        this.setState({open:false,message:''});
    }

    componentDidMount() {
        CommonRegister.addChangeListener(AppConstants.EVENT_USER_MESSAGE,this.showUserMessage);
    }

    componentWillUnmount() {
        CommonRegister.removeChangeListener(AppConstants.EVENT_USER_MESSAGE,this.showUserMessage);
    }

    render() {
        return (
            <div>
                <Snackbar
                    open={this.state.open}
                    message={this.state.message}
                    autoHideDuration={10000}
                    onRequestClose={this.handleRequestClose}
                    onActionTouchTap={this.handleRequestClose}
                    action="OK"
                />
            </div>
        );
    }
}

export default UserMessage;
