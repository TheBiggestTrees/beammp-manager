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
import { GetFolderNames, GetModPictures } from './helper/zip';
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

ipcMain.on('setLayout', (event, arg) => {
  userconfig = {
    ...userconfig,
    layout: arg,
  };
  fs.writeFileSync('userconfig.json', JSON.stringify(userconfig, null, 4));
});

ipcMain.handle('getLayout', (event, arg) => {
  const res = userconfig.layout;
  return res;
});

ipcMain.handle('openModsFolder', (event, arg) => {
  const directory = Directory();
  shell.openPath(`${directory}\\Resources\\Client`);
});

ipcMain.handle('openMapsFolder', (event, arg) => {
  const directory = Directory();
  shell.openPath(`${directory}\\custom_maps`);
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
  console.log(res);

  return res;
});

ipcMain.handle('getModList', async () => {
  try {
    const pathD = Directory();

    const activated = await fs.promises.readdir(`${pathD}\\Resources\\Client`);
    const deactivated = await fs.promises.readdir(
      `${pathD}\\Resources\\Client\\deactivated_mods`
    );

    const activeListWImages = () => {
      const activate = [];
      const deactivate = [];

      for (let i = 0; i < activated.length; i++) {
        try {
          const image = GetModPictures(
            `${pathD}\\Resources\\Client\\${activated[i]}`,
            pathD
          );

          if (image !== undefined) {
            activate.push({
              name: activated[i],
              image: image,
            });
          }

          if (image === undefined) {
            activate.push({
              name: activated[i],
              image: undefined,
            });
          }
        } catch (error) {
          console.error(
            `Error getting mod picture for ${activated[i]}:`,
            error
          );
        }
      }

      for (let i = 0; i < deactivated.length; i++) {
        try {
          const image = GetModPictures(
            `${pathD}\\Resources\\Client\\deactivated_mods\\${deactivated[i]}`,
            pathD
          );

          if (image !== undefined) {
            deactivate.push({
              name: deactivated[i],
              image: image,
            });
          }

          if (image === undefined) {
            deactivate.push({
              name: deactivated[i],
              image: undefined,
            });
          }
        } catch (error) {
          console.error(
            `Error getting mod picture for ${deactivated[i]}:`,
            error
          );
        }
      }

      const modList = {
        activated: [...activate],
        deactivated: [...deactivate],
      };

      return modList;
    };

    const List = activeListWImages();

    console.log(List);
    return List;
  } catch (error) {
    console.error('Error getting mod list:', error);
    return null;
  }
});

ipcMain.on('selectMap', async (event, arg) => {
  const defaultMaps = [
    'gridmap',
    'gridmap_v2',
    'automation_test_track',
    'east_coast_usa',
    'hirochi_raceway',
    'italy',
    'industrial',
    'small_island',
    'smallgrid',
    'utah',
    'west_coast_usa',
    'driver_training',
    'derby',
    'jungle_rock_island',
    'johnson_valley',
  ];

  userconfig = fs.readFileSync('userconfig.json');
  const pathD = Directory();
  const tomlconfig = fs.readFileSync(`${pathD}/ServerConfig.toml`);
  const parsed = JSON.parse(userconfig);
  const parseToml = TOML.parse(tomlconfig);
  let selected = parsed.selectedMap;
  console.log(selected);
  // const zipFolder = await GetFolderNames(
  // `${pathD}\\custom_maps\\${}`
  // );

  const defaultClickSaveConfig = () => {
    const toml = TOML.stringify({
      ...parseToml,
      General: { ...parseToml.General, Map: `/levels/${arg}/info.json` },
    });

    const JSONstring = JSON.stringify({ ...parsed, selectedMap: arg }, null, 4);

    fs.writeFileSync('userconfig.json', JSONstring);

    fs.writeFileSync(`${pathD}/ServerConfig.toml`, toml);
  };

  const zipClickSaveConfig = async () => {
    try {
      const zipName = await GetFolderNames(
        `${pathD}\\Resources\\Client\\${arg}`
      );

      const toml = TOML.stringify({
        ...parseToml,
        General: { ...parseToml.General, Map: `/levels/${zipName}/info.json` },
      });

      const JSONstring = JSON.stringify(
        { ...parsed, selectedMap: arg },
        null,
        4
      );

      fs.writeFileSync('userconfig.json', JSONstring);

      fs.writeFileSync(`${pathD}/ServerConfig.toml`, toml);
    } catch (error) {
      console.error('Error saving config:', error);
    }
  };

  if (defaultMaps.includes(arg)) {
    console.log('default map CLICKED', arg);

    if (defaultMaps.includes(selected)) {
      console.log('default map current', selected);

      defaultClickSaveConfig();
    } else {
      console.log('zip map current', selected);

      try {
        const selectedZipName = await GetFolderNames(
          `${pathD}\\Resources\\Client\\${selected}`
        );

        if (selectedZipName) {
          console.log('selectedZipName: ', selectedZipName);
          console.log('saving default clicked and zip selected');

          // move file specified by selectedZipName to custom_maps folder from `{pathD}/Resources/Client` folder

          const fromZip = `${pathD}\\Resources\\Client\\${selected}`;
          const toZip = `${pathD}\\custom_maps\\${selected}`;
          fs.renameSync(fromZip, toZip);

          defaultClickSaveConfig();
        }
      } catch (error) {
        console.error('Error getting zip folder name:', error);
      }
    }
  } else if (!defaultMaps.includes(arg)) {
    console.log('zip map CLICKED', arg);

    if (defaultMaps.includes(selected)) {
      console.log('default map current', selected);

      // move file specified by arg to resources//client folder from `{pathD}/custom_maps` folder
      const from = `${pathD}\\custom_maps\\${arg}`;
      const to = `${pathD}\\Resources\\Client\\${arg}`;
      fs.renameSync(from, to);

      zipClickSaveConfig();
    } else {
      console.log('zip map current', selected);

      try {
        const selectedZipName = await GetFolderNames(
          `${pathD}\\Resources\\Client\\${selected}`
        );

        if (selectedZipName) {
          console.log('selectedZipName: ', selectedZipName);
          console.log('saving zip clicked and zip selected');

          // move file specified by arg to resources//client folder from `{pathD}/custom_maps` folder

          const from = `${pathD}\\custom_maps\\${arg}`;
          const to = `${pathD}\\Resources\\Client\\${arg}`;
          fs.renameSync(from, to);

          // move file specified by selectedZipName to custom_maps folder from `{pathD}/Resources/Client` folder

          const fromZip = `${pathD}\\Resources\\Client\\${selected}`;
          const toZip = `${pathD}\\custom_maps\\${selected}`;
          fs.renameSync(fromZip, toZip);

          zipClickSaveConfig();
        }
      } catch (error) {
        console.error('Error getting zip folder name:', error);
      }
    }
  }

  // zipFolArr = ['gtavc', 'libertycity'];
  // selected = 'motorsports_playground';
  // selectedZip = 'gtavc.zip';
  // arg = 'motorsports_playground';
  // modMaps = ['gtavc.zip', 'libertycity.zip'];

  // // // // TO DO: FIX MAP SELECTION/MOVING MAPS TO AND FROM RESOURCES/CLIENT and custom_maps // // // //
});

ipcMain.handle('getSelectedMap', async () => {
  const user = fs.readFileSync('userconfig.json');
  if (user) {
    userconfig = JSON.parse(user);
    return userconfig.selectedMap;
  }
  return false;
});

ipcMain.on('deactivateMod', (event, arg) => {
  // move file specified by arg to deactivated_mods folder from `{Directory()}/Resources/Client` folder
  const from = `${Directory()}/Resources/Client/${arg}`;
  const to = `${Directory()}/Resources/Client/deactivated_mods/${arg}`;
  fs.renameSync(from, to);
});

ipcMain.on('activateMod', (event, arg) => {
  // move file specified by arg to deactivated_mods folder from `{Directory()}/Resources/Client` folder
  const from = `${Directory()}/Resources/Client/deactivated_mods/${arg}`;
  const to = `${Directory()}/Resources/Client/${arg}`;
  fs.renameSync(from, to);
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
    icon: getAssetPath('beammp_manager.jpg'),
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
