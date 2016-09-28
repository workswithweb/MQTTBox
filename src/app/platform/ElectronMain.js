const electron = require('electron');
const {app, BrowserWindow,Menu} = electron;
const PlatformMqttClientService = require('./PlatformMqttClientService');

let win;
const template = [
    {
        label: 'About',
        submenu: [
            {
                label: 'Documentation',
                click () { require('electron').shell.openExternal('http://workswithweb.com/mqttbox.html') }
            },
            {
                label: 'Downloads',
                click () { require('electron').shell.openExternal('http://workswithweb.com/html/mqttbox/downloads.html') }
            }
        ]
    }
];

function createWindow () {
    const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize;
    win = new BrowserWindow({width, height})
    win.loadURL(`file://${app.getAppPath()}/index.html`);
    win.webContents.openDevTools();
    win.on('closed', () => {
        win = null
    });
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    //ElectronIpcMainService.killChildProcess();
    app.quit();
});

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
});

