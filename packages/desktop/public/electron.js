// Modules to control application life and create native browser window
const { app, BrowserWindow, Notification, dialog, Menu, Tray, nativeImage } = require('electron');
const log = require('electron-log');
const { autoUpdater } = require("electron-updater");
const path = require('path')
const isDev = require("electron-is-dev");

const platform = require('os').platform()
// Logging
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

let trayIcon = null
let appIcon = null
let closeByTray = false

// autoUpdater.setFeedURL({ provider: 'github', owner: 'hytechlab', repo: 'abacus-ims', token: '6dd663ef72fdcce97c2dbf9aff3dfddd4e558667', private: true });

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// if (platform == 'darwin') {
//   trayIcon = path.join(__dirname, 'logo_box.png')
// } else if (platform == 'win32') {
//   trayIcon = path.join(__dirname, 'icon.ico')
// } else {
trayIcon = nativeImage.createFromPath(path.join(__dirname, 'logo_box.png'))
// }

function sendStatusToWindow(text) {
  log.info(text);
  mainWindow.webContents.send('update_status', text);
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    // frame: false,
    useContentSize: true,
    title: "Realesta PMS",
    icon: trayIcon,
    'accept-first-mouse': true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
      defaultEncoding: 'UTF-8',
    }
  })

  appIcon = new Tray(trayIcon)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Restore app',
      click: () => {
        mainWindow.show()
      }
    },
    {
      label: 'Quit app',
      click: () => {
        closeByTray = true
        app.quit();
      }
    }
  ])

  // Set title for tray icon
  appIcon.setTitle('Realesta PMS')

  // Set toot tip for tray icon
  appIcon.setToolTip('Realesta | Property Management System')

  // Create RightClick context menu
  appIcon.setContextMenu(contextMenu)

  // Restore (open) the app after clicking on tray icon
  // if window is already open, minimize it to system tray
  appIcon.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  })

  // and load the index.html of the app.
  mainWindow.loadURL(isDev ? 'http://localhost:8000' : `file://${path.join(__dirname, '../dist/index.html')}`);

  mainWindow.on('close', function (event) {
    if (!app.isQuiting && !closeByTray) {
      event.preventDefault();
      mainWindow.hide();
    }

    return false;
  });


  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  // Minimize window to system tray
  // mainWindow.on('minimize', function (event) {
  //     event.preventDefault()
  //     mainWindow.hide()
  // })
}
// mainWindow.setMenu(null);



if (isDev) {
  // const {
  //     default: installExtension,
  //     REACT_DEVELOPER_TOOLS,
  // } = require('electron-devtools-installer');
  //
  // installExtension(REACT_DEVELOPER_TOOLS)
  //     .then(name => {
  //         console.log(`Added Extension: ${name}`);
  //     })
  //     .catch(err => {
  //         console.log('An error occurred: ', err);
  //     });

} else {
  // mainWindow.removeMenu();

}

//mainWindow.loadURL(`file://${__dirname}/vanilla.html#v${app.getVersion()}`);

// Open the DevTools.
//mainWindow.webContents.openDevTools()

// Emitted when the window is closed.
// }

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on('ready', createWindow)
app.on('ready', function () {
  createWindow();


  // This will immediately download an update, then install when the
  // app quits.
  autoUpdater.checkForUpdatesAndNotify();

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('version', app.getVersion());
    log.info(`App Version : v${app.getVersion()}`);
  });

});


autoUpdater.channel = 'latest'
autoUpdater.allowDowngrade = false

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'silly'
autoUpdater.logger.transports.file.appName = 'private repo'
autoUpdater.autoDownload = true

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
  new Notification({
    title: 'Realesta PMS',
    body: 'Update available'
  }).show()
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded and will install on restart');
  new Notification({
    title: 'Realesta PMS',
    body: 'Update downloaded'
  }).show()
});

app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
//
// CHOOSE one of the following options for Auto updates
//

//-------------------------------------------------------------------
// Auto updates - Option 1 - Simplest version
//
// This will immediately download an update, then install when the
// app quits.
//-------------------------------------------------------------------

//-------------------------------------------------------------------
// Auto updates - Option 2 - More control
//
// For details about these events, see the Wiki:
// https://github.com/electron-userland/electron-builder/wiki/Auto-Update#events
//
// The app doesn't need to listen to any events except `update-downloaded`
//
// Uncomment any of the below events to listen for them.  Also,
// look in the previous section to see them being used.
//-------------------------------------------------------------------
// app.on('ready', function()  {
//   autoUpdater.checkForUpdates();
// });
// autoUpdater.on('checking-for-update', () => {
// })
// autoUpdater.on('update-available', (info) => {
// })
// autoUpdater.on('update-not-available', (info) => {
// })
// autoUpdater.on('error', (err) => {
// })
// autoUpdater.on('download-progress', (progressObj) => {
// })
// autoUpdater.on('update-downloaded', (info) => {
//   autoUpdater.quitAndInstall();
// })