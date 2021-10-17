module.exports = {
  emptyString(str) {
    return /^\s*$/.test(str);
  },
  invalidEmail(str) {
    return /^[a-z]\w*(\.\w+)*@[a-z]+(\.[a-z]+)+$/.test(str);
  },
  checkInvalidRequest(arr, request) {
    return arr.reduce((result, item) => {
      return result && !!request[item] && !/^\s*$/.test(request[item]);
    }, true);
  },
};
