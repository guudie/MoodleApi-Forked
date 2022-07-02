const { nanoid } = require("nanoid");
const md5 = require("md5");
const user = require("../collections/UserCollection");
const account = require("../collections/AccountCollection");
const { profile, changePass } = require("../validations/UserValidate");

module.exports = {
  async profile(req, res) {
    let token = req.headers.x_authorization;
    let _account = await account.findOne({ id: token }).exec();

    if (!_account) {
      res.status(400).send({
        items: null,
        msg: "User không tồn tại",
      });
    } else {
      let _user = await user.findOne({ id: _account.id }).exec();
      if (!_user) {
        res.status(500).send({
          msg: "Lỗi",
        });
      } else {
        res.status(200).send({
          items: {
            name: _user.name,
            email: _user.email,
            level: _user.level,
            phone: _user.phone,
            date_birth: _user.date_birth,
            address: _user.address,
          },
          msg: "Thành công",
        });
      }
    }
  },

  async otp(req, res) {
    let token = req.headers.x_authorization;
    let _account = await account.findOne({ id: token }).exec();

    if (!_account) {
      res.status(400).send({
        items: null,
        msg: "User không tồn tại",
      });
    } else {
      account.findOneAndUpdate(
        { id: token },
        { otp: "0000" },
        { strict: false },
        async () => {
          res.status(200).send({
            items: {
              status: "1",
            },
            msg: "Thành công",
          });
        }
      );
    }
  },

  async edit(req, res) {
    user.findOneAndUpdate(
      { id: req.headers.x_authorization },
      req.body,
      {},
      async () => {
        let _user = await user
          .findOne({ id: req.headers.x_authorization })
          .exec();
        res.status(200).send({
          items: {
            name: _user.name,
            email: _user.email,
            level: _user.level,
            phone: _user.phone,
            date_birth: _user.date_birth,
            address: _user.address,
          },
          msg: "Thành công",
        });
      }
    );
  },

  async changePassword(req, res) {
    account.findOneAndUpdate(
      { id: req.headers.x_authorization },
      { password: await md5(req.body.new_password) },
      {},
      async () => {
        res.status(200).send({
          items: {
            status: "1",
          },
          msg: "Thành công",
        });
      }
    );
  },

  async changeEmail(req, res) {
    let _user = await user.findOne({ email: req.body.new_email }).exec();

    if (!_user) {
      user.findOneAndUpdate(
        { id: req.headers.x_authorization },
        { email: req.body.new_email },
        {},
        async () => {
          let _user = await user
            .findOne({ id: req.headers.x_authorization })
            .exec();
          res.status(200).send({
            items: {
              email: _user.email,
            },
            msg: "Thành công",
          });
        }
      );
    } else {
      res.status(400).send({
        msg: "Email đã được sử dụng",
        items: null,
      });
    }
  },
};
