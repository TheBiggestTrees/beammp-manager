/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import * as fs from 'fs';
import path from 'path';
import {
  BackGround,
  CheckServer,
  Directory,
  ExecuteServer,
  getMaps,
} from '../executer';
import GetFolderNames from './helper/zip';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

const TOML = require('@iarna/toml');

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.handle('Directory', async () => {
  const res = await Directory();
  return res;
});

let userconfig;

ipcMain.on('SetFolder', (event, arg) => {
  userconfig = {
    ...userconfig,
    beammpFolder: arg,
  };

  fs.writeFileSync('userconfig.json', JSON.stringify(userconfig, null, 4));
});

ipcMain.on('setBackground', (event, arg) => {
  userconfig = {
    ...userconfig,
    background: arg,
  };
  fs.writeFileSync('userconfig.json', JSON.stringify(userconfig, null, 4));
});

ipcMain.handle('getBackground', async () => {
  const res = await BackGround();
  return res;
});

ipcMain.handle('getServerSettings', async () => {
  const tomlconfig = fs.readFileSync(`${Directory()}/ServerConfig.toml`);
  const parseToml = TOML.parse(tomlconfig);
  return parseToml;
});

ipcMain.on('setServerSettings', (event, arg) => {
  const tomlconfig = TOML.stringify(arg);
  fs.writeFileSync(`${Directory()}/ServerConfig.toml`, tomlconfig);
});

ipcMain.handle('getMaps', async () => {
  const res = await getMaps();
  const zippedFolders = [];
  for (let i = 0; i < res.length; i++) {
    try {
      const zipFolders = await GetFolderNames(
        `${Directory()}\\custom_maps\\${res[i]}`
      );
      zippedFolders.push(zipFolders);
    } catch (err) {
      console.log(err);
    }
  }
  return zippedFolders;
});

ipcMain.handle('getModList', async () => {
  const activated = await fs.promises.readdir(
    `${Directory()}\\Resources\\Client`
  );
  const deactivated = await fs.promises.readdir(
    `${Directory()}\\Resources\\Client\\deactivated_mods`
  );
  const res = { ...activated, deactivated: { ...deactivated } };
  return res;
});

ipcMain.on('selectMap', (event, arg) => {
  userconfig = fs.readFileSync('userconfig.json');
  const tomlconfig = fs.readFileSync(`${Directory()}/ServerConfig.toml`);
  const parsed = JSON.parse(userconfig);
  const parseToml = TOML.parse(tomlconfig);
  const toml = TOML.stringify({
    ...parseToml,
    General: { ...parseToml.General, Map: `/levels/${arg}/info.json` },
  });
  const JSONstring = JSON.stringify({ ...parsed, selectedMap: arg }, null, 4);
  fs.writeFileSync('userconfig.json', JSONstring);

  fs.writeFileSync(`${Directory()}/ServerConfig.toml`, toml);
});

ipcMain.handle('getSelectedMap', async () => {
  const user = fs.readFileSync('userconfig.json');
  if (user) {
    userconfig = JSON.parse(user);
    return userconfig.selectedMap;
  }
  return false;
});

ipcMain.on('executeServer', async (event, arg) => {
  const user = fs.readFileSync('userconfig.json');

  if (user) {
    userconfig = JSON.parse(user);
  }

  switch (arg) {
    case 'start':
      ExecuteServer(
        `cd /d ${userconfig.beammpFolder} && start ${
          userconfig.background ? '/b' : ''
        } BeamMP-Server.exe`
      );
      event.reply('executeServer', 'Server Started');
      console.log(arg, 'Server Started');

      break;

    case 'stop':
      ExecuteServer('taskkill /im BeamMP-Server.exe /f ');
      event.reply('executeServer', 'Server Stopped');
      console.log(arg, 'Server Stopped');
      break;

    case 'restart':
      ExecuteServer(
        `taskkill /im BeamMP-Server.exe /f && cd /d ${
          userconfig.beammpFolder
        } && start ${userconfig.background ? '/b' : ''} BeamMP-Server.exe`
      );
      event.reply('executeServer', 'Server Restarted');
      console.log(arg, 'Server Restarted');

      break;

    case 'gameCheck':
      event.reply('executeServer', 'Game Found');
      break;

    default:
      break;
  }
});

ipcMain.handle('checkServer', async () => {
  const response = await CheckServer();
  return response;
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  ipcMain.handle('dialog:openDirectory', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
    });
    if (canceled) {
    } else {
      return filePaths[0];
    }
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
