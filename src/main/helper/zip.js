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

const GetImageFromZip = async (filePath) => {
  // open the zip
  const zip = new AdmZip(filePath);

  // extract the contents of the mod_info/*/images folder
  const entries = zip.getEntries();
  const images = [];

  const entryNameArray = entries.forEach((entry) => {
    if (
      entry.entryName.includes('mod_info' && '/images' && ('.png' || '.jpg'))
    ) {
      if (entry.entryName.split('/')[2] === 'images') {
        return images.push(entry.entryName);
      }
    }
  });

  if (images) {
    const firstImage = images[0];
    if (firstImage) {
      const imagePath = path.join(filePath, firstImage);
      const imageBuffer = await fs.promises.readFile(imagePath);
      // const imageBase64 = imageBuffer.toString('base64');

      console.log(imageBuffer);

      // const imageURL = `data:image/${
      //   firstImage.split('.')[1]
      // };base64,${imageBase64}`;
      // return imageURL;
    }
  }
};

const GetModPictures = async (zipdirectory) => {
  const files = await fs.promises.readdir(zipdirectory);
  const filesNoFolders = files.filter((file) => !file.includes('/'));
  GetImageFromZip(`${zipdirectory}/${filesNoFolders[0]}`);
  // const res = filesNoFolders.map((file) => {
  //   const filePath = `${zipdirectory}/${file}`;
  //   const image = GetImageFromZip(filePath);
  //   if (image) {
  //     return image;
  //   }
  //   return 'No Images';
  // });
  // return res;
};

module.exports = { GetFolderNames, GetModPictures };
