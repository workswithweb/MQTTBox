import React from 'react';
import getmac from 'getmac';
import {render} from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Router, hashHistory } from 'react-router';
import request from 'request';
import compareVersions from 'compare-versions';

import AppRoutes from './utils/AppRoutes';
import CommonActions from './actions/CommonActions';
import CommonConstants from './utils/CommonConstants';

injectTapEventPlugin();
hashHistory.replace('/mqttclientslist');

render(
  <Router history={hashHistory}>
    {AppRoutes}
  </Router>
, document.getElementById('app'));


getmac.getMac(function(err,macAddress) {
    var reqUrl = 'http://workswithweb.com/api/application/version?currentversion='+CommonConstants.APP_VERSION;

    if(process!=null && process.platform!=null) {
        reqUrl = reqUrl+'&platform='+process.platform;
    } else {
        reqUrl = reqUrl+'&platform=unknown';
    }

    if (!err)  {
        reqUrl = reqUrl+'&uuid='+macAddress;
    } else {
        macAddress = 'nouuid'
    }

    request(reqUrl,function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var latestVersion = JSON.parse(body).latestVersion;
            if(compareVersions(latestVersion, CommonConstants.APP_VERSION) ==1) {
                CommonActions.showMessageToUser({message:'New version of MQTTBox is available for download - '+latestVersion});
            }
        }
    });
});


