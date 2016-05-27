import React from 'react';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import ActionDehaze from 'material-ui/svg-icons/image/dehaze';
import CommonActions from '../actions/CommonActions';

class BrokerView extends React.Component {

    constructor(props) {
        super(props);
        this.onShowMenuClick = this.onShowMenuClick.bind(this);
    }

    onShowMenuClick() {
        CommonActions.showHideMenu(true);
    }

    render() {
        console.log('render BrokerView');
        return (
            <div>
                <Toolbar>
                    <ToolbarGroup>
                        <IconButton onTouchTap={this.onShowMenuClick} tooltip="Menu">
                            <ActionDehaze/>
                        </IconButton>
                    </ToolbarGroup>
                </Toolbar>
            </div>
        );
    }
}

export default BrokerView;
