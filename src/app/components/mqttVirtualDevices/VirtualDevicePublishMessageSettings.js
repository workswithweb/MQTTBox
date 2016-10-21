import React, {Component} from 'react';

class VirtualDevicePublishMessageSettings extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="panel-group" role="tablist" aria-multiselectable="true">
                <div className="panel panel-success">
                    <div data-toggle="collapse" data-target="#collapseVdpms" className="panel-heading" role="tab" style={{cursor:'pointer'}}>
                        <h4 className="panel-title">
                            <a role="button" aria-expanded="true" aria-controls="collapseVdcs">
                                Publish Messages To Topics
                            </a>
                        </h4>
                    </div>
                    <div id="collapseVdpms" className="panel-collapse collapse in" role="tabpanel">
                        <div className="panel-body">
                            Publish Messages From Device Settings
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default VirtualDevicePublishMessageSettings;
