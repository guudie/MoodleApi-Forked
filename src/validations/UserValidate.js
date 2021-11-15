// const user = require("../collections/UserCollection");
// const regex = require("../modules/regex");

module.exports = {
  async profile(req, res, next) {
    let token = req.headers.x_authorization;

    if (!token) {
      res.status(400).send({
        msg: "Chưa đăng nhập",
        items: null,
      });
    } else next();
  },
};
