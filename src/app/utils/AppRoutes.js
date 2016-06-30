import React from 'react';
import {Route} from 'react-router';

import Main from '../components/Main';
import AddEditBrokerForm from '../components/AddEditBrokerForm';
import BrokerView from '../components/BrokerView';

const AppRoutes = (
    <Route path="/" component={Main}>
        <Route path="/addedit" component={AddEditBrokerForm}/>
        <Route path="/addedit/:bsId" component={AddEditBrokerForm}/>
        <Route path="/broker/:bsId" component={BrokerView}/>
    </Route>
);
export default AppRoutes;
