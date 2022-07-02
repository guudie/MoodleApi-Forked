module.exports = {
  emptyString(str) {
    return /^\s*$/.test(str);
  },
  validEmail(str) {
    return /^[a-z]\w*(\.\w+)*@[a-z]+(\.[a-z]+)+$/.test(str);
  },
  checkValidRequest(arr, request) {
    return arr.reduce((result, item) => {
      return result && !!request[item] && !/^\s*$/.test(request[item]);
    }, true);
  },
};
