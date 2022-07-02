module.exports = {
  getImgDrive(url) {
    if (url) {
      if (url.includes("drive.google.com"))
        return `https://drive.google.com/uc?export=view&id=${
          url.split("/")[5]
        }`;
      else return url;
    } else return "";
  },
};
