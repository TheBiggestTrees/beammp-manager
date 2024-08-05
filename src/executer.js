const { exec } = require('child_process');
const find = require('find-process');
const fs = require('fs');

function ExecuteServer(method) {
  const out = exec(method, (error, stdout, stderr) => stdout);

  return out;
}

let userconfig;

const Directory = () => {
  userconfig = fs.readFileSync('userconfig.json');
  if (userconfig) {
    userconfig = JSON.parse(userconfig);
    return userconfig.beammpFolder;
  }
  return 'No Folder Selected';
};

const BackGround = () => {
  userconfig = fs.readFileSync('userconfig.json');
  if (userconfig) {
    userconfig = JSON.parse(userconfig);
    return userconfig.background;
  }
  return false;
};

async function CheckServer() {
  try {
    const res = await find('name', 'BeamMP-Server');
    let response = 'Offline';
    if (res.length > 0) {
      response = 'Online';
    }
    return response;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function getMaps() {
  try {
    const directory = Directory();
    const res = await fs.promises.readdir(`${directory}/custom_maps`);
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

module.exports = {
  ExecuteServer,
  CheckServer,
  Directory,
  BackGround,
  getMaps,
};
