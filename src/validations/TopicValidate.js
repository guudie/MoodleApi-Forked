const account = require("../collections/AccountCollection");
const topic = require("../collections/TopicCollection");
const tags = require("../collections/TagsCollection");
const user = require("../collections/UserCollection");
const regex = require("../modules/regex");

module.exports = {
  async list(req, res, next) {
    next();
  },

  async detail(req, res, next) {
    next();
  },

  async getComments(req, res, next) {
    next();
  },

  async edit(req, res, next) {
    const token = req.headers.x_authorization;
    const id = req.body.id;

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
          ["id", "title", "description", "content", "tags"],
          req.body
        );
        if (!valid) {
          res.status(400).send({
            msg: "Request không hợp lệ",
          });
        } else {
          let _topic = await topic.findOne({ id: id }).exec();

          if (!_topic) {
            res.status(400).send({
              msg: "Topic không tồn tại",
            });
          } else {
            // Edit topic
            let _user = await user.findOne({ id: _account.id }).exec();
            // Check user
            let _checkAuthor = await user.findOne({ id: _topic.author }).exec();
            let _editor = user.level == "999" || _checkAuthor &&  _user.id == _checkAuthor.id;

            if (_editor) {
              next();
            } else {
              res.status(400).send({
                msg: "Permission denied.",
              });
            }
          }
        }
      }
    }
  },

  async create(req, res, next) {
    const token = req.headers.x_authorization;

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
          ["title", "description", "content", "tags"],
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
  },

  async comment(req, res, next) {
    const token = req.headers.x_authorization;

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
          ["topic_id", "content"],
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
  },

  async editComment(req, res, next) {
    const token = req.headers.x_authorization;

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
          ["topic_id", "id", "content"],
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
  },

  async deleteComment(req, res, next) {
    const token = req.headers.x_authorization;

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
        let valid = await regex.checkValidRequest(["topic_id", "id"], req.body);
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

  async tags(req, res, next) {
    next();
  },

  async like(req, res, next) {
     const token = req.headers.x_authorization;

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
          ["topic_id"],
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
  },

  async unlike(req, res, next) {
     const token = req.headers.x_authorization;

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
          ["topic_id"],
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
  },
};
