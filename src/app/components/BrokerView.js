import React from 'react';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import ActionDehaze from 'material-ui/svg-icons/image/dehaze';
import CommonActions from '../actions/CommonActions';

class BrokerView extends React.Component {

    constructor(props) {
        super(props);
        this.onShowHideMenuClick = this.onShowHideMenuClick.bind(this);
    }

    onShowHideMenuClick() {
        CommonActions.showHideMenu(true);
    }

    render() {
        console.log('render BrokerView');
        return (
            <div>
                <Toolbar>
                    <ToolbarGroup>
                        <IconButton onTouchTap={this.onShowHideMenuClick}>
                            <ActionDehaze/>
                        </IconButton>
                    </ToolbarGroup>
                </Toolbar>
            </div>
        );
    }
}

export default BrokerView;
