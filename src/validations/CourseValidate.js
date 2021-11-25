const account = require("../collections/AccountCollection");

const regex = require("../modules/regex");

module.exports = {
  async list(req, res, next) {
    let token = req.headers.x_authorization;

    if (!token) {
      res.status(400).send({
        msg: "Chưa đăng nhập",
        items: null,
      });
    } else {
      let _account = await account.findOne({ id: token }).exec();

      if (!_account) {
        res.status(400).send({
          msg: "User không tồn tại",
          items: null,
        });
      } else {
        next();
      }
    }
  },
};
