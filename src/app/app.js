import React from 'react';
import {render} from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Router, hashHistory } from 'react-router'

import AppRoutes from './utils/AppRoutes';
injectTapEventPlugin();

hashHistory.replace('/');

render(
  <Router history={hashHistory}>
    {AppRoutes}
  </Router>
, document.getElementById('app'));
