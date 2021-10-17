const { nanoid } = require("nanoid");
const md5 = require("md5");
const user = require("../collections/UserCollection");
const account = require("../collections/AccountCollection");

module.exports = {
  async register(req, res) {
    let id = await nanoid();
    let password = await md5(req.body.password);

    let newAccount = new account({ id: id, password: password });
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

      res.send({
        status: 200,
        items: newUser,
        msg: "Đăng ký thành công",
      });
    } catch (error) {
      res.send({
        status: 500,
        items: {},
        msg: "Đăng ký thất bại",
      });
    }
  },

  async login(req, res) {
    let _user = await user.findOne({ email: req.body.email }).exec();
    if (_user === null) {
      res.send({
        status: 500,
        items: {},
        msg: "Người dùng không tồn tại",
      });
    } else {
      let _account = await account.findOne({ id: _user.id }).exec();
      if (_account != null && _account.password === md5(req.body.password)) {
        res.send({
          status: 200,
          items: { token: _user.id },
          msg: "Đăng nhập thành công",
        });
      } else {
        res.send({
          status: 500,
          items: {},
          msg: "Đăng nhập thất bại",
        });
      }
    }
  },
};
