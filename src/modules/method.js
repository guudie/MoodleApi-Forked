module.exports = {
  getImgDrive(url) {
    return `https://drive.google.com/uc?export=view&id=${url.split("/")[5]}`;
  },
};
