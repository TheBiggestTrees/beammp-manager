/* eslint no-console: "off" */
const AdmZip = require('adm-zip');
const fs = require('fs');

const GetFolderNames = async (filePath) => {
  const file = await fs.promises.readFile(filePath);

  const zip = new AdmZip(file);
  const zipEntries = zip.getEntries();
  const zipFolders = zipEntries.map((entry) => {
    return entry.entryName;
  });

  return zipFolders[1].split('/')[1];
};

export default GetFolderNames;
