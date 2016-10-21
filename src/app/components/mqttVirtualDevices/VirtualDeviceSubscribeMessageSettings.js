import React, {Component} from 'react';

class VirtualDeviceSubscribeMessageSettings extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="panel-group" role="tablist" aria-multiselectable="true">
                <div className="panel panel-success">
                    <div data-toggle="collapse" data-target="#collapseVdsms" className="panel-heading" role="tab" style={{cursor:'pointer'}}>
                        <h4 className="panel-title">
                            <a role="button" aria-expanded="true" aria-controls="collapseVdcs">
                                Subscribe Messages From Topics
                            </a>
                        </h4>
                    </div>
                    <div id="collapseVdsms" className="panel-collapse collapse in" role="tabpanel">
                        <div className="panel-body">
                            Subscribe Messages To Virtual Device
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default VirtualDeviceSubscribeMessageSettings;
