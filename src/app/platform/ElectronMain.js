const electron = require('electron');
const {app, BrowserWindow,Menu} = electron;
const PlatformMqttClientService = require('./PlatformMqttClientService');
const PlatformMqttLoadService = require('./PlatformMqttLoadService');
let win;
const template = [
    {
        label: 'MQTTBox',
        submenu: [
            {
                label: 'About MQTTBox',
                click () { require('electron').shell.openExternal('http://workswithweb.com/mqttbox.html') }
            },
            {
                label: 'Quit MQTTBox',
                accelerator: 'CmdOrCtrl+Q',
                click: function () {
                    PlatformMqttClientService.default.killChildProcess();
                    PlatformMqttLoadService.default.killChildProcess();
                    app.quit();
                }
            }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
            { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
            { type: "separator" },
            { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
            { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
        ]
    },
    {
        label: 'Help',
        submenu: [
            {
                label: 'Documentation',
                click () { require('electron').shell.openExternal('http://workswithweb.com/html/mqttbox/getstarted.html') }
            },
            {
                label: 'Download Apps',
                click () { require('electron').shell.openExternal('http://workswithweb.com/html/mqttbox/downloads.html') }
            }
        ]
    }
];

function createWindow () {
    const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize;
    win = new BrowserWindow({width, height})
    win.loadURL(`file://${app.getAppPath()}/index.html`);
    //win.webContents.openDevTools();
    win.on('closed', () => {
        win = null
    });
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    PlatformMqttClientService.default.killChildProcess();
    PlatformMqttLoadService.default.killChildProcess();
    app.quit();
});

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
});

