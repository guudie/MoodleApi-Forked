const { nanoid } = require("nanoid");
const md5 = require("md5");
const user = require("../collections/UserCollection");
const account = require("../collections/AccountCollection");
const { profile } = require("../validations/UserValidate");

module.exports = {
  async profile(req, res) {
    let token = req.headers.x_authorization;
    let _account = await account.findOne({ id: token }).exec();

    if (!_account) {
      res.status(500).send({
        msg: "User không tồn tại",
      });
    } else {
      let _user = await user.findOne({ id: _account.id }).exec();
      if (!_user) {
        res.status(400).send({
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

  async editProfile(req, res) {
    let id = await nanoid();
    let password = await md5(req.body.password);

    let newAccount = new account({
      id: id,
      password: password,
    });
    let newUser = new user({
      id: id,
      name: req.body.name,
      email: req.body.email,
      level: req.body.level,
      user_id: req.body.user_id,
      phone: "",
      date_birth: "",
      address: "",
    });

    try {
      await newAccount.save();
      await newUser.save();

      res.status(200).send({
        items: {
          name: newUser.name,
          email: newUser.email,
          level: newUser.level,
          phone: "",
          date_birth: "",
          address: "",
        },
        msg: "Đăng ký thành công",
      });
    } catch (error) {
      res.status(500).send({
        msg: "Đăng ký thất bại",
      });
    }
  },
};
