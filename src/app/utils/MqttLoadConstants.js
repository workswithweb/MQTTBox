class MqttLoadConstants {}

//WORKER COMMANDS
MqttLoadConstants.WORKER_CMD_MQTT_LOAD_START = 'WORKER_CMD_MQTT_LOAD_START';
MqttLoadConstants.WORKER_CMD_MQTT_LOAD_STOP = 'WORKER_CMD_MQTT_LOAD_STOP';

//WORKER EVENTS
MqttLoadConstants.WORKER_EVENT_MQTT_LOAD_DATA = 'WORKER_EVENT_MQTT_LOAD_DATA';
MqttLoadConstants.WORKER_EVENT_MQTT_LOAD_FINISHED = 'WORKER_EVENT_MQTT_LOAD_FINISHED';

//CONSTANTS
MqttLoadConstants.STATUS = 'STATUS';
MqttLoadConstants.STATE_IN_PROGRESS = 'In Progress';
MqttLoadConstants.STATE_SUCCESS = 'Success';
MqttLoadConstants.STATE_FAILED = 'Failed';
MqttLoadConstants.STATE_STOPPED = 'Stopped';
MqttLoadConstants.STATE_ERROR = 'Error';
MqttLoadConstants.STATE_TIME_OUT = 'Timeout';

MqttLoadConstants.LOAD_TYPE_PUBLISHING = 'publishing';
MqttLoadConstants.LOAD_TYPE_SUBSCRIBING = 'subscribing';

//DB
MqttLoadConstants.DB_MQTT_LOAD_DATA = 'mqttLoadData';

//MESSAGES
MqttLoadConstants.LOAD_STARTED = 'Starting MQTT Load';
MqttLoadConstants.LOAD_BROKER_CONNECTING = 'Connecting to Broker...';
MqttLoadConstants.LOAD_BROKER_CONNECTED = 'Connected to broker';
MqttLoadConstants.LOAD_BROKER_PUBLISHING = 'Publishing messages to topic...';
MqttLoadConstants.LOAD_BROKER_PUBLISHED = 'Publishing completed';
MqttLoadConstants.LOAD_BROKER_WAITING_FOR_QOS = 'Waiting for QoS responses...';
MqttLoadConstants.LOAD_BROKER_SAVING_DATA = 'Saving data...';
MqttLoadConstants.LOAD_BROKER_ERROR_SAVING_DATA = 'Error saving data...';
MqttLoadConstants.LOAD_COMPLETED = 'Execution completed successfully';
MqttLoadConstants.LOAD_STOPPED = 'Execution stopped by user';

MqttLoadConstants.LOAD_BROKER_SUBSCRIBING = 'Subscribing to topic...';
MqttLoadConstants.LOAD_BROKER_SUBSCRIBED = 'Subscribed. Waiting for messages...';
MqttLoadConstants.LOAD_BROKER_SUBSCRIBING_ERROR = 'Error subscribing to topic';

MqttLoadConstants.LOAD_BROKER_CONNECTION_CLOSED = 'Connection to broker closed';
MqttLoadConstants.LOAD_BROKER_CONNECTION_OFFLINE = 'Broker is offline';
MqttLoadConstants.LOAD_BROKER_CONNECTION_ERROR = 'Broker connection error';

MqttLoadConstants.LOAD_TIME_OUT = 'Execution timed out.';
MqttLoadConstants.LOAD_STOP = 'Stop MQTT Load';


export default MqttLoadConstants;