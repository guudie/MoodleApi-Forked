const user = require("../collections/UserCollection");
const regex = require("../modules/regex");

module.exports = {
  async register(req, res, next) {
    let invalid = await regex.checkInvalidRequest(["name", "email", "level", "password"], req.body);
    if (!invalid) {
      res.status(400).send({
        msg: "Request không hợp lệ",
      });
    } else {
      if (!regex.invalidEmail(req.body.email)) {
        res.status(400).send({
          msg: "Email không hợp lệ",
        });
      } else {
        let _user = await user.findOne({ email: req.body.email }).exec();
        if (_user !== null) {
          res.status(400).send({
            msg: "Người dùng đã tồn tại",
          });
        } else {
          next();
        }
      }
    }
  },

  async login(req, res, next) {
    let invalid = await regex.checkInvalidRequest(["email", "password"], req.body);
    if (!invalid) {
      res.status(400).send({
        msg: "Request không hợp lệ",
      });
    } else {
      if (!regex.invalidEmail(req.body.email)) {
        res.status(400).send({
          msg: "Email không hợp lệ",
        });
      } else {
        next();
      }
    }
  },
};
