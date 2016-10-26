import React from 'react';
import {render} from 'react-dom';
import { Router, hashHistory } from 'react-router';

import AppRoutes from './utils/AppRoutes';
import PlatformUtils from './platform/common/PlatformUtils';

PlatformUtils.init();
hashHistory.replace('/mqttclientslist');

render(
  <Router history={hashHistory}>
    {AppRoutes}
  </Router>
, document.getElementById('app'));


