var $  = require('jquery');
var dt = require('datatables.net')(window,$);
import moment from 'moment';

import MqttLoadSettingsService from '../../services/MqttLoadSettingsService';
import CommonUtils from '../../utils/CommonUtils';
$.fn.dataTableExt.sErrMode = "console";

class LoadDataPage  {

    constructor() {
        var iId = CommonUtils.getUrlQueryParameter(location.search,'iids');
        var iIds = iId.split(',');
        if(typeof(iIds)!='undefined' && iIds!=null && iIds.length>0) {
            this.getMqttLoadDataByInstanceIds(iIds);
        }
    }

    getMqttLoadDataByInstanceIds(iIds) {
        MqttLoadSettingsService.getMqttLoadDataByInstanceIds(iIds)
        .then(function(loadDataList) {
            var loadData = [];
            for(var i=0;i<loadDataList.length;i++) {
                if(loadDataList[i]!=null && loadDataList[i].receivedMessages!=null && loadDataList[i].receivedMessages.length>0) {
                    loadData = loadData.concat(loadDataList[i].receivedMessages);
                }
            }
            this.showData(loadData);
        }.bind(this));
    }

    showData(loadData) {
        if(loadData==null) {
            loadData = [];
        }

        var t = $('#mqttLoadData').DataTable({
            lengthMenu: [[100, 200, 500, 1000,-1], [100, 200, 500, 1000,"All"]],
            columnDefs: [ {className: "dt-head-left",searchable: false,orderable: false,width: 5,targets: 0},
                          {className: "dt-head-left",width: 200,targets:1},
                          {className: "dt-head-left",width: 150,targets:2},
                          {className: "dt-head-left",width: 150,targets:3},
                          {className: "dt-head-left",width: 5,targets:4},
                          {className: "dt-head-left",width: 5,targets:5},
                          {className: "dt-head-left",targets:6}
                        ],
            order: [[ 1, 'asc' ]],
            data: loadData,
            columns: [
                { title: " ",data:"data.inum"},
                { title: "Time" ,data:"time",
                    render: function (data) {
                        return moment(data).format("MMM-DD-YYYY hh:mm:ss:SSS A");
                    }
                },
                { title: "Message Id" ,data:"data.messageId"},
                { title: "Topic" ,data:"data.topic"},
                { title: "QoS" ,data:"data.qos"},
                { title: "Instance" ,data:"data.inum"},
                { title: "Payload" ,data:"data.payload"}

            ]
        });

        t.on( 'order.dt search.dt', function () {
            t.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
                cell.innerHTML = i+1;
            } );
        } ).draw();
    }
}

export default new LoadDataPage();
