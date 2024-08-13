/* eslint no-console: "off" */
const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

const GetFolderNames = async (filePath) => {
  const file = await fs.promises.readFile(filePath);

  const zip = new AdmZip(file);
  const zipEntries = zip.getEntries();
  const zipFolders = zipEntries.map((entry) => {
    return entry.entryName;
  });

  return zipFolders[1].split('/')[1];
};

const GetModPictures = (filePath, root) => {
  console.log(root);
  // filePath =  `J:\\BeamMP\\resources\\client\\custom_mod.zip`
  // open the zip
  const zip = new AdmZip(filePath);

  // extract the contents of the mod_info/*/images folder
  // get entries
  const entries = zip.getEntries();
  // create empty array for images
  const images = [];

  // loop through entries
  const entryNameArray = entries.forEach((entry) => {
    if (
      entry.entryName.includes('mod_info' && '/images' && ('.png' || '.jpg'))
    ) {
      if (entry.entryName.split('/')[2] === 'images') {
        return images.push(entry.entryName);
      }
    }
  });

  if (images.length > 0) {
    const firstImagePath = images[0];
    const imageFile = firstImagePath.split('/')[3];
    const fileExists = fs.existsSync(`${root}/image_cache/${imageFile}`);
    //check if the image exists in ./image_cache
    if (!fileExists) {
      // download the image
      zip.extractEntryTo(firstImagePath, `${root}/image_cache`, false, true);
    }
    return `${root}/image_cache/${imageFile}`;
  } else {
    return `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROCUtTGbskK6E3lU-aeNtcNjGKUu4YTwzRpg&s`;
  }
};

module.exports = { GetFolderNames, GetModPictures };
