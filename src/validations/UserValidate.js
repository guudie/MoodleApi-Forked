// const user = require("../collections/UserCollection");
const account = require("../collections/AccountCollection");

const regex = require("../modules/regex");
const md5 = require("md5");

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

  async otp(req, res, next) {
    let token = req.headers.x_authorization;

    if (!token) {
      res.status(400).send({
        msg: "Chưa đăng nhập",
        items: null,
      });
    } else next();
  },

  async edit(req, res, next) {
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
        let valid = await regex.checkValidRequest(["name"], req.body);
        if (!valid) {
          res.status(400).send({
            msg: "Request không hợp lệ",
          });
        } else {
          next();
        }
      }
    }
  },

  async changePassword(req, res, next) {
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
        if (_account.password != md5(req.body.old_password)) {
          res.status(400).send({
            msg: "Mật khẩu không chính xác",
          });
        } else {
          let valid = await regex.checkValidRequest(
            ["old_password", "new_password"],
            req.body
          );
          if (!valid) {
            res.status(400).send({
              msg: "Request không hợp lệ",
            });
          } else {
            next();
          }
        }
      }
    }
  },

  async changeEmail(req, res, next) {
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
        let valid = await regex.checkValidRequest(
          ["otp", "new_email"],
          req.body
        );
        if (!valid) {
          res.status(400).send({
            msg: "Request không hợp lệ",
          });
        } else {
          if (_account.otp != req.body.otp) {
            res.status(400).send({
              msg: "OTP không chính xác",
            });
          } else {
            next();
          }
        }
      }
    }
  },
};
