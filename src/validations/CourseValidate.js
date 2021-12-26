const account = require("../collections/AccountCollection");
const course = require("../collections/CourseCollection");
const user = require("../collections/UserCollection");
const regex = require("../modules/regex");

module.exports = {
  async list(req, res, next) {
    next();
  },

  async categories(req, res, next) {
    next();
  },

  async related(req, res, next) {
    next();
  },

  async registered(req, res, next) {
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

  async courseRegister(req, res, next) {
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
        let valid = await regex.checkValidRequest(["course_id"], req.body);
        if (!valid) {
          res.status(400).send({
            msg: "Request không hợp lệ",
          });
        } else {
          let _course = await course.findOne({ id: req.body.course_id }).exec();
          if (!_course) {
            res.status(400).send({
              msg: "Khóa học không tồn tại",
            });
          } else {
            next();
          }
        }
      }
    }
  },

  async courseUnregister(req, res, next) {
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
        let valid = await regex.checkValidRequest(["course_id"], req.body);
        if (!valid) {
          res.status(400).send({
            msg: "Request không hợp lệ",
          });
        } else {
          let _course = await course.findOne({ id: req.body.course_id }).exec();
          if (!_course) {
            res.status(400).send({
              msg: "Khóa học không tồn tại",
            });
          } else {
            next();
          }
        }
      }
    }
  },

  async detail(req, res, next) {
    next();
  },

  async edit(req, res, next) {
    const token = req.headers.x_authorization;
    const courseID = req.body.id;

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
          ["cate_id", "title", "short_title", "description"],
          req.body
        );
        if (!valid) {
          res.status(400).send({
            msg: "Request không hợp lệ",
          });
        } else {
          let _course = await course.findOne({ id: courseID }).exec();

          if (!_course) {
            res.status(400).send({
              msg: "Khóa học không tồn tại",
            });
          } else {
            // Edit course
            let _user = await user.findOne({ id: _account.id }).exec();
            // Check user
            let _editor = 0;

            if (_user.level == "999") {
              _editor = 1;
            } else {
              let _mIndex = _course.manager.findIndex(
                (item) => item.user_id == _user.id
              );
              if (_mIndex >= 0) {
                _editor = 1;
              }
            }

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
          ["cate_id", "title", "short_title", "description"],
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
          ["course_id", "content"],
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
          ["course_id", "id", "content"],
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
        let valid = await regex.checkValidRequest(
          ["course_id", "id"],
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
