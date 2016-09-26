class MqttLoadConstants {}

//ACTIONS
MqttLoadConstants.ACTION_SAVE_MQTT_LOAD = 'ACTION_SAVE_MQTT_LOAD';
MqttLoadConstants.ACTION_DELETE_MQTT_LOAD = 'ACTION_DELETE_MQTT_LOAD';
MqttLoadConstants.ACTION_START_MQTT_LOAD_TEST = 'ACTION_START_MQTT_LOAD_TEST';
MqttLoadConstants.ACTION_STOP_MQTT_LOAD_TEST = 'ACTION_STOP_MQTT_LOAD_TEST';

//EVENTS
MqttLoadConstants.EVENT_MQTT_LOAD_SETTINGS_CHANGED = 'EVENT_MQTT_LOAD_SETTINGS_CHANGED';
MqttLoadConstants.EVENT_MQTT_LOAD_STATUS_MESSAGE = 'EVENT_MQTT_LOAD_STATUS_MESSAGE';
MqttLoadConstants.EVENT_MQTT_LOAD_TEST_ENDED = 'EVENT_MQTT_LOAD_TEST_ENDED';

//CONSTANTS
MqttLoadConstants.STATE_IN_PROGRESS = 'In Progress';
MqttLoadConstants.STATE_SUCCESS = 'Success';
MqttLoadConstants.STATE_ERROR = 'Error';
MqttLoadConstants.STATE_STOPPED = 'Stopped';
MqttLoadConstants.STATE_DONE = 'Done';
MqttLoadConstants.STATE_TIME_OUT = 'Timeout';
MqttLoadConstants.TYPE_LOAD_TEST_PUBLISHING = 'publishing';
MqttLoadConstants.TYPE_LOAD_TEST_SUBSCRIBING= 'subscribing';


//MESSAGES
MqttLoadConstants.LOAD_STARTED = 'Starting MQTT load test';
MqttLoadConstants.LOAD_MQTT_CLIENT_CONNECTING = 'Connecting to Broker...';
MqttLoadConstants.LOAD_MQTT_CLIENT_CONNECTED = 'Connected to broker';
MqttLoadConstants.LOAD_MQTT_CLIENT_PUBLISHING = 'Publishing messages to topic...';
MqttLoadConstants.LOAD_MQTT_CLIENT_PUBLISHED = 'Publishing completed';
MqttLoadConstants.LOAD_MQTT_CLIENT_WAITING_FOR_QOS = 'Waiting for QoS responses...';
MqttLoadConstants.LOAD_MQTT_CLIENT_SAVING_DATA = 'Saving data...';
MqttLoadConstants.LOAD_MQTT_CLIENT_ERROR_SAVING_DATA = 'Error saving data...';
MqttLoadConstants.LOAD_COMPLETED = 'Load test completed successfully';
MqttLoadConstants.LOAD_STOPPED = 'Load test stopped by user';

MqttLoadConstants.LOAD_MQTT_CLIENT_SUBSCRIBING = 'Subscribing to topic...';
MqttLoadConstants.LOAD_MQTT_CLIENT_SUBSCRIBED = 'Subscribed. Waiting for messages...';
MqttLoadConstants.LOAD_MQTT_CLIENT_SUBSCRIBING_ERROR = 'Error subscribing to topic';

MqttLoadConstants.LOAD_MQTT_CLIENT_CONNECTION_CLOSED = 'Connection to broker closed';
MqttLoadConstants.LOAD_BROKER_CONNECTION_OFFLINE = 'Broker is offline';
MqttLoadConstants.LOAD_BROKER_CONNECTION_ERROR = 'Broker connection error';
MqttLoadConstants.LOAD_TIME_OUT = 'Load test timed out.';

module.exports = MqttLoadConstants;