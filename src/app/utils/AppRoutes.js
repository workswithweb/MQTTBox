import React from 'react';
import {Route} from 'react-router';

import Main from '../components/Main';
import MqttClientList from '../components/mqttClient/MqttClientList';
import AddEditMqttClient from '../components/mqttClient/AddEditMqttClient';
import MqttClientDashboard from '../components/mqttClient/MqttClientDashboard';
import AboutApp from '../components/common/AboutApp';
import MqttLoadList from '../components/mqttLoad/MqttLoadList';
import AddEditMqttLoad from '../components/mqttLoad/AddEditMqttLoad';
import MqttLoadDashboard from '../components/mqttLoad/MqttLoadDashboard';
import MqttLoadTestData from '../components/mqttLoad/MqttLoadTestData';
import MqttLoadTestGraph from '../components/mqttLoad/MqttLoadTestGraph';

const AppRoutes = (
    <Route path="/" component={Main}>
        <Route path="/mqttclientslist" component={MqttClientList}/>
        <Route path="/mqttclientdashboard/:mcsId" component={MqttClientDashboard}/>
        <Route path="/addeditmqttclient" component={AddEditMqttClient}/>
        <Route path="/addeditmqttclient/:mcsId" component={AddEditMqttClient}/>
        <Route path="/aboutapp" component={AboutApp}/>
        <Route path="/mqttloadlist" component={MqttLoadList}/>
        <Route path="/addeditmqttload" component={AddEditMqttLoad}/>
        <Route path="/addeditmqttload/:mcsId" component={AddEditMqttLoad}/>
        <Route path="/mqttloaddashboard/:mcsId" component={MqttLoadDashboard}/>
        <Route path="/mqttloadtestdata/:mcsId" component={MqttLoadTestData}/>
        <Route path="/mqttloadtestgraph/:mcsId" component={MqttLoadTestGraph}/>
    </Route>
);
export default AppRoutes;