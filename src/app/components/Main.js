import React, {Component} from 'react';

import UserMessageSnackbar from './common/UserMessageSnackbar';

class Main extends Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div>
                <UserMessageSnackbar/>
                {this.props.children}
            </div>
        );
    }
}

export default Main;
