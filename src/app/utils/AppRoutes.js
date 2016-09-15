import React from 'react';
import {Route} from 'react-router';

import Main from '../components/Main';
import MqttClientList from '../components/mqttClient/MqttClientList';
import AddEditMqttClient from '../components/mqttClient/AddEditMqttClient';
import MqttClientDashboard from '../components/mqttClient/MqttClientDashboard';
import AboutApp from '../components/common/AboutApp';

const AppRoutes = (
    <Route path="/" component={Main}>
        <Route path="/mqttclientslist" component={MqttClientList}/>
        <Route path="/mqttclientdashboard/:mcsId" component={MqttClientDashboard}/>
        <Route path="/addeditmqttclient" component={AddEditMqttClient}/>
        <Route path="/addeditmqttclient/:mcsId" component={AddEditMqttClient}/>
        <Route path="/aboutapp" component={AboutApp}/>
    </Route>
);
export default AppRoutes;