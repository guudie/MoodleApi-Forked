const { nanoid } = require("nanoid");
const md5 = require("md5");
const user = require("../collections/UserCollection");
const account = require("../collections/AccountCollection");

module.exports = {
  async register(req, res) {
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

  async login(req, res) {
    let _user = await user.findOne({ email: req.body.email }).exec();
    if (_user === null) {
      res.status(400).send({
        msg: "Người dùng không tồn tại",
      });
    } else {
      let _account = await account.findOne({ id: _user.id }).exec();
      if (_account === null) {
        res.status(500).send({
          msg: "Đăng nhập thất bại",
        });
      } else {
        if (_account.password === md5(req.body.password)) {
          res.status(200).send({
            items: { token: _account.id },
            msg: "Đăng nhập thành công",
          });
        } else {
          res.status(400).send({
            msg: "Mật khẩu không chính xác",
          });
        }
      }
    }
  },
};
