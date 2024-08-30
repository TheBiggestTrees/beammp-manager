import { ipcMain, shell } from 'electron';
import * as fs from 'fs';
import { GetFolderNames, GetModPictures } from '../helper/zip';
import {
  BackGround,
  CheckServer,
  Directory,
  ExecuteServer,
  getMaps,
} from './../../executer';

const TOML = require('@iarna/toml');

let userconfig;

export function setupIpcHandlers() {
  ipcMain.handle('Directory', Directory);
  ipcMain.handle('getLayout', (event, arg) => userconfig.layout);
  ipcMain.handle('openModsFolder', () => {
    shell.openPath(`${Directory()}\\Resources\\Client`);
  });
  ipcMain.handle('openMapsFolder', () => {
    shell.openPath(`${Directory()}\\custom_maps`);
  });
  ipcMain.handle('getBackground', BackGround);
  ipcMain.handle('getServerSettings', getServerSettings);
  ipcMain.handle('getMaps', getMaps);
  ipcMain.handle('getModList', getModList);
  ipcMain.handle('getSelectedMap', getSelectedMap);
  ipcMain.handle('checkServer', CheckServer);
}

export function setupIpcListeners() {
  ipcMain.on('SetFolder', handleSetFolder);
  ipcMain.on('setLayout', handleSetLayout);
  ipcMain.on('setBackground', handleSetBackground);
  ipcMain.on('setServerSettings', handleSetServerSettings);
  ipcMain.on('selectMap', handleSelectMap);
  ipcMain.on('deactivateMod', handleDeactivateMod);
  ipcMain.on('activateMod', handleActivateMod);
  ipcMain.on('executeServer', handleExecuteServer);
}

async function getServerSettings() {
  const tomlconfig = fs.readFileSync(`${Directory()}/ServerConfig.toml`);
  const parseToml = TOML.parse(tomlconfig);
  return parseToml;
}

async function getModList() {
  try {
    const pathD = Directory();
    const user = fs.readFileSync('userconfig.json', 'utf8');
    const userConfig = JSON.parse(user);
    const selectedMap = userConfig.selectedMap;

    const activated = await fs.promises.readdir(`${pathD}\\Resources\\Client`);
    const deactivated = await fs.promises.readdir(
      `${pathD}\\Resources\\Client\\deactivated_mods`
    );

    const activeListWImages = () => {
      const activate = [];
      const deactivate = [];

      for (let i = 0; i < activated.length; i++) {
        if (activated[i] !== selectedMap) {
          try {
            const image = GetModPictures(
              `${pathD}\\Resources\\Client\\${activated[i]}`,
              pathD
            );

            activate.push({
              name: activated[i],
              image: image || undefined,
            });
          } catch (error) {
            console.error(
              `Error getting mod picture for ${activated[i]}:`,
              error
            );
          }
        }
      }

      for (let i = 0; i < deactivated.length; i++) {
        if (deactivated[i] !== selectedMap) {
          try {
            const image = GetModPictures(
              `${pathD}\\Resources\\Client\\deactivated_mods\\${deactivated[i]}`,
              pathD
            );

            deactivate.push({
              name: deactivated[i],
              image: image || undefined,
            });
          } catch (error) {
            console.error(
              `Error getting mod picture for ${deactivated[i]}:`,
              error
            );
          }
        }
      }

      const modList = {
        activated: activate.sort((a, b) => a.name.localeCompare(b.name)),
        deactivated: deactivate.sort((a, b) => a.name.localeCompare(b.name)),
      };

      return modList;
    };

    const List = activeListWImages();

    return List;
  } catch (error) {
    console.error('Error getting mod list:', error);
    return null;
  }
}

async function getSelectedMap() {
  const user = fs.readFileSync('userconfig.json');
  if (user) {
    userconfig = JSON.parse(user);
    return userconfig.selectedMap;
  }
  return false;
}

function updateUserConfig(updates) {
  try {
    const currentConfig = JSON.parse(fs.readFileSync('userconfig.json', 'utf8'));
    const updatedConfig = { ...currentConfig, ...updates };
    fs.writeFileSync('userconfig.json', JSON.stringify(updatedConfig, null, 2));
    userconfig = updatedConfig;
  } catch (error) {
    console.error('Error updating user config:', error);
  }
}


function handleSetFolder(event, arg) {
  updateUserConfig({ beammpFolder: arg });
}

function handleSetLayout(event, arg) {
  updateUserConfig({ layout: arg });
}


function handleSetBackground(event, arg) {
  updateUserConfig({ background: arg });
}

function handleSetServerSettings(event, arg) {
  const tomlconfig = TOML.stringify(arg);
  fs.writeFileSync(`${Directory()}/ServerConfig.toml`, tomlconfig);
}

async function handleSelectMap(event, arg) {
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

      updateUserConfig({ selectedMap: arg });

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

}

function handleDeactivateMod(event, arg) {
  const from = `${Directory()}/Resources/Client/${arg}`;
  const to = `${Directory()}/Resources/Client/deactivated_mods/${arg}`;
  fs.renameSync(from, to);
}

function handleActivateMod(event, arg) {
  const from = `${Directory()}/Resources/Client/deactivated_mods/${arg}`;
  const to = `${Directory()}/Resources/Client/${arg}`;
  fs.renameSync(from, to);
}

function handleExecuteServer(event, arg) {
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
}
