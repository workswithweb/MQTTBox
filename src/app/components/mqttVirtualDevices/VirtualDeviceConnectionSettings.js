import React, {Component} from 'react';

class VirtualDeviceConnectionSettings extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="panel-group" role="tablist" aria-multiselectable="true">
                <div className="panel panel-default">
                    <div data-toggle="collapse" data-target="#collapseVdcs" className="panel-heading" role="tab" style={{cursor:'pointer'}}>
                        <h4 className="panel-title">
                            <a role="button" aria-expanded="true" aria-controls="collapseVdcs">
                                CONNECTION SETTINGS
                            </a>
                        </h4>
                    </div>
                    <div id="collapseVdcs" className="panel-collapse collapse in" role="tabpanel">
                        <div className="panel-body">
                            Virtual Device Connection Settings
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default VirtualDeviceConnectionSettings;
