module.exports = {
  getImgDrive(url) {
    return url
      ? `https://drive.google.com/uc?export=view&id=${url.split("/")[5]}`
      : "";
  },
};
