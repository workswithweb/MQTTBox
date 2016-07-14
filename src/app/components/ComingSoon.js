import React from 'react';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import ActionDehaze from 'material-ui/svg-icons/image/dehaze';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import AppActions from '../actions/AppActions';
import NavLink from './NavLink';

class ComingSoon extends React.Component {

    constructor(props) {
        super(props);
        this.onShowHideMenuClick = this.onShowHideMenuClick.bind(this);
    }

    onShowHideMenuClick() {
        AppActions.showHideMenu(true);
    }

    render() {
        return (
            <div>
                <div>
                    <Toolbar>
                        <ToolbarGroup firstChild={true}>
                            <IconButton onTouchTap={this.onShowHideMenuClick}>
                                <ActionDehaze/>
                            </IconButton>
                        </ToolbarGroup>
                    </Toolbar>
                </div>
                <div>
                    <Card>
                        <CardTitle title="MQTT Load" subtitle="Load test your MQTT infrastructure from your chrome app or browser" />
                        <CardText>
                          <h4>Features:</h4>
                          <ul>
                            <li>Load test publishing or subscribing to topics</li>
                            <li>Number of messages to publish/second to a topic</li>
                            <li>Create more instance threads to generate load</li>
                            <li>View real time status of each instance</li>
                            <li>Time series graph view of results</li>
                            <li>Download test data</li>
                          </ul>
                          <b><NavLink key="about" to="/aboutapp">Click Here</NavLink> for Roadmap</b>
                        </CardText>
                    </Card>
                </div>
            </div>
        );
    }
}

export default ComingSoon;