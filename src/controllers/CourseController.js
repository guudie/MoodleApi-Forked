const course = require("../collections/CourseCollection");
const registedUser = require("../collections/RegistedUserCollection");
const registedCourse = require("../collections/RegistedCourseCollection");
const courseDetail = require("../collections/CourseDetailCollection");
const courseComment = require("../collections/CourseCommentCollection");
const category = require("../collections/categoryCollection");

const account = require("../collections/AccountCollection");
const user = require("../collections/UserCollection");

const method = require("../modules/method");
const { customAlphabet } = require("nanoid");

module.exports = {
  async list(req, res) {
    let cate_id = req.query.category;

    let queryObj = {};

    if (cate_id !== "0") {
      queryObj = { cate_id: cate_id };
    }

    let _list = await course.find(queryObj).exec();
    _list = await _list.map((item) => {
      return {
        id: item.id,
        cate_id: item.cate_id,
        title: item.title,
        short_title: item.short_title,
        description: item.description,
        image: method.getImgDrive(item.image),
      };
    });

    res.status(200).send({
      msg: "Success",
      items: _list,
    });
  },

  async categories(req, res) {
    let _categories = await category.find().exec();
    _categories = await _categories.map((item) => {
      return {
        id: item.id,
        title: item.title,
      };
    });

    res.status(200).send({
      msg: "Success",
      items: _categories,
    });
  },

  async related(req, res) {
    let _list = await course.find().exec();

    _list = await _list.slice(0, 10).map((item) => {
      return {
        id: item.id,
        cate_id: item.cate_id,
        title: item.title,
        short_title: item.short_title,
        description: item.description,
        image: method.getImgDrive(item.image),
      };
    });

    res.status(200).send({
      msg: "Success",
      items: _list.slice(0, 10),
    });
  },

  async registered(req, res) {
    let token = req.headers.x_authorization;

    let _data = await registedUser.findOne({ user_id: token }).exec();

    if (_data) {
      let _list = [];

      for (let index = 0; index < _data.list.length; index++) {
        let _course = await course
          .findOne({ id: _data.list[index].course_id })
          .exec();

        if (_course) {
          _list[index] = {
            id: _course.id,
            cate_id: _course.cate_id,
            title: _course.title,
            short_title: _course.short_title,
            description: _course.description,
            image: method.getImgDrive(_course.image),
          };
        } else {
          _list[index] = null;
        }
      }

      _list = await _list.filter((item) => item != null);

      res.status(200).send({
        msg: "Success",
        items: _list,
      });
    } else {
      res.status(200).send({
        msg: "Success",
        items: [],
      });
    }
  },

  async courseRegister(req, res) {
    const userID = req.headers.x_authorization;
    const courseID = req.body.course_id;

    // register_course
    let checkRgsCourse = await registedCourse
      .findOne({ course_id: courseID })
      .exec();
    if (checkRgsCourse) {
      let index = await checkRgsCourse.list.findIndex(
        (item) => item.user_id == userID
      );
      if (index < 0) {
        let _list = [...checkRgsCourse.list, { user_id: userID }];

        checkRgsCourse.list = _list;
        checkRgsCourse.save();
      }
    } else {
      let newRgsCourse = new registedCourse({
        course_id: courseID,
        list: [{ user_id: userID }],
      });
      await newRgsCourse.save();
    }

    // register_user
    let checkRgsUser = await registedUser.findOne({ user_id: userID }).exec();
    if (checkRgsUser) {
      let index = await checkRgsUser.list.findIndex(
        (item) => item.course_id == courseID
      );

      if (index >= 0) {
        res.status(400).send({
          msg: "Khóa học đã đăng ký.",
        });

        return;
      } else {
        let _list = [...checkRgsUser.list, { course_id: courseID }];

        checkRgsUser.list = _list;
        checkRgsUser.save();
      }
    } else {
      let newRgsUser = new registedUser({
        user_id: userID,
        list: [{ course_id: courseID }],
      });
      await newRgsUser.save();
    }

    res.status(200).send({
      msg: "Success.",
    });
  },

  async courseUnregister(req, res) {
    const userID = req.headers.x_authorization;
    const courseID = req.body.course_id;

    // register_course
    let checkRgsCourse = await registedCourse
      .findOne({ course_id: courseID })
      .exec();
    if (checkRgsCourse) {
      checkRgsCourse.list = checkRgsCourse.list.filter(
        (item) => item.user_id !== userID
      );
      checkRgsCourse.save();
    }

    // register_user
    let checkRgsUser = await registedUser.findOne({ user_id: userID }).exec();
    if (checkRgsUser) {
      let index = await checkRgsUser.list.findIndex(
        (item) => item.course_id == courseID
      );

      if (index >= 0) {
        checkRgsUser.list = checkRgsUser.list.filter(
          (item) => item.course_id !== courseID
        );
        checkRgsUser.save();
      } else {
        res.status(400).send({
          msg: "Khóa học chưa được đăng ký.",
        });
        return;
      }
    } else {
      res.status(400).send({
        msg: "Khóa học chưa được đăng ký.",
      });
      return;
    }

    res.status(200).send({
      msg: "Success.",
    });
  },

  async detail(req, res) {
    const courseID = req.query.course;

    let _course = await course.findOne({ id: courseID }).exec();
    let _detail = await courseDetail.findOne({ course_id: courseID }).exec();
    let _courseComment = await courseComment
      .findOne({ course_id: courseID })
      .exec();

    let _comment = [];
    if (_courseComment) _comment = await getComment(_courseComment.comments);

    let _manager = [];

    if (!_course || !_detail) {
      res.status(400).send({
        msg: "Khóa học không tồn tại.",
      });
    } else {
      const token = req.headers.x_authorization;
      let _account = null;
      let _user = null;
      let checkRgsUser = null;
      let checkRgs = -1;
      let _editor = 0;

      if (token) {
        _account = await account.findOne({ id: token }).exec();
      }

      if (_account) {
        _user = await user.findOne({ id: _account.id }).exec();
        checkRgsUser = await registedUser
          .findOne({ user_id: _account.id })
          .exec();
      }

      if (checkRgsUser) {
        checkRgs = await checkRgsUser.list.findIndex(
          (item) => item.course_id == courseID
        );
      }

      if (_user) {
        if (_user.level == "999") {
          _editor = 1;
          checkRgs = 1;
        } else {
          let _mIndex = _course.manager.findIndex(
            (item) => item.user_id == _user.id
          );
          if (_mIndex >= 0) {
            _editor = 1;
            checkRgs = 1;
          }
        }
      }

      for (let index = 0; index < _course.manager.length; index++) {
        let _id = _course.manager[index].user_id;
        let m_user = await user.findOne({ id: _id }).exec();
        if (m_user && m_user.level == "999") {
          _manager[index] = { id: _id, name: m_user.name };
        } else {
          _manager[index] = { name: m_user.name };
        }
      }

      let rgsCourse = await registedCourse
        .findOne({ course_id: courseID })
        .exec();

      if (checkRgs >= 0) {
        res.status(200).send({
          msg: "Success",
          items: {
            id: _course.id,
            cate_id: _course.cate_id,
            title: _course.title,
            short_title: _course.short_title,
            description: _course.description,
            image: method.getImgDrive(_course.image),
            registed: 1,
            num_register: rgsCourse ? rgsCourse.list.length : 0,
            editor: _editor,
            teachers: _manager,
            intro: _detail.intro,
            chapters: _detail.chapters,
            comments: _comment,
          },
        });
      } else {
        let _chapters = await _detail.chapters.map((item) => {
          return { ...item, content: "" };
        });
        res.status(200).send({
          msg: "Success",
          items: {
            id: _course.id,
            cate_id: _course.cate_id,
            title: _course.title,
            short_title: _course.short_title,
            description: _course.description,
            image: method.getImgDrive(_course.image),
            registed: 0,
            num_register: rgsCourse ? rgsCourse.list.length : 0,
            editor: 0,
            teachers: _manager,
            intro: _detail.intro,
            chapters: _chapters,
            comments: [],
          },
        });
      }
    }
  },

  async edit(req, res) {
    const token = req.headers.x_authorization;
    const body = req.body;
    const courseID = body.id;

    let _course = await course.findOne({ id: courseID }).exec();
    let _detail = await courseDetail.findOne({ course_id: courseID }).exec();
    let _comment = await courseComment.findOne({ course_id: courseID }).exec();
    let _account = await account.findOne({ id: token }).exec();
    let _user = await user.findOne({ id: _account.id }).exec();
    let rgsCourse = await registedCourse
      .findOne({ course_id: courseID })
      .exec();

    if (body.cate_id) _course.cate_id = body.cate_id;
    if (body.title) _course.title = body.title;
    if (body.short_title) _course.short_title = body.short_title;
    if (body.description) _course.description = body.description;

    if (body.intro) _detail.intro = body.intro;
    if (body.chapters) _detail.chapters = body.chapters;

    _course.save();
    _detail.save();

    let _manager = [];
    for (let index = 0; index < _course.manager.length; index++) {
      let _id = _course.manager[index].user_id;
      let m_user = await user.findOne({ id: _id }).exec();
      if (_user && _user.level == "999") {
        _manager[index] = { id: _id, name: m_user.name };
      } else {
        _manager[index] = { name: m_user.name };
      }
    }

    res.status(200).send({
      msg: "Success",
      items: {
        id: _course.id,
        cate_id: _course.cate_id,
        title: _course.title,
        short_title: _course.short_title,
        description: _course.description,
        image: method.getImgDrive(_course.image),
        registed: 1,
        num_register: rgsCourse.list.length,
        editor: 1,
        teachers: _manager,
        intro: _detail.intro,
        chapters: _detail.chapters,
        comments: _comment ? _comment.comments : [],
      },
    });
  },

  async create(req, res) {
    const body = req.body;
    const token = req.headers.x_authorization;

    let _account = await account.findOne({ id: token }).exec();
    let _user = await user.findOne({ id: _account.id }).exec();

    if (_user.level) {
      const nanoid = customAlphabet("1234567890", 6);

      let courseID = 0;

      do {
        courseID = await nanoid();
        let checkCourse = await course.findOne({ id: courseID }).exec();

        if (checkCourse) {
          courseID = 0;
        }
      } while (!courseID);

      let newCourse = new course({
        id: courseID,
        cate_id: body.cate_id,
        title: body.title,
        short_title: body.short_title,
        description: body.description,
        image: "",
        manager: _user.level == 1 ? [{ user_id: _user.id }] : [],
      });

      let newDetail = new courseDetail({
        course_id: courseID,
        intro: body.intro,
        chapters: body.chapters,
      });

      newCourse.save();
      newDetail.save();

      res.status(200).send({
        msg: "Success",
        items: {
          id: newCourse.id,
          cate_id: newCourse.cate_id,
          title: newCourse.title,
          short_title: newCourse.short_title,
          description: newCourse.description,
          image: method.getImgDrive(newCourse.image),
          registed: 1,
          num_register: 0,
          editor: 1,
          teachers:
            _user.level == 1
              ? [{ name: _user.name }]
              : [{ id: _user.id, name: _user.name }],
          intro: newDetail.intro,
          chapters: newDetail.chapters,
          comments: [],
        },
      });
    } else {
      res.status(400).send({
        msg: "Permission denied.",
      });
    }
  },

  async comment(req, res) {
    const token = req.headers.x_authorization;

    let allow = 0;

    let _account = await account.findOne({ id: token }).exec();
    let _user = await user.findOne({ id: _account.id }).exec();
    let _course = await course.findOne({ id: req.body.course_id }).exec();

    if (!_course) {
      res.status(400).send({
        msg: "Khóa học không tồn tại",
      });
      return;
    }

    if (_user.level) {
      if (_user == 1) {
        let index = await _course.manager.findIndex(
          (item) => item.user_id == _user.id
        );

        if (index >= 0) {
          allow = 1;
        }
      } else {
        allow = 1;
      }
    }

    let checkRgsUser = await registedUser.findOne({ user_id: _user.id }).exec();
    if (checkRgsUser) {
      let index = await checkRgsUser.list.findIndex(
        (item) => item.course_id == req.body.course_id
      );

      if (index >= 0) {
        allow = 1;
      } else {
        res.status(400).send({
          msg: "User chưa đăng ký khóa học.",
        });
        return;
      }
    } else {
      res.status(400).send({
        msg: "User chưa đăng ký khóa học.",
      });
      return;
    }

    if (allow) {
      let _comment = await courseComment
        .findOne({ course_id: req.body.course_id })
        .exec();

      const nanoid = customAlphabet("1234567890abcdef", 10);
      let _id = await nanoid();

      let date = new Date();

      let _date = `${date.getDate()}/${
        date.getMonth() + 1
      }/${date.getFullYear()}`;
      let _time = `${date.getHours()}:${date.getMinutes()}`;

      let obj = {
        id: _id,
        user_id: _user.id,
        date: _date,
        time: _time,
        content: req.body.content,
      };

      if (_comment) {
        _comment.comments = [obj, ..._comment.comments];
        _comment.save();
      } else {
        let newComment = new courseComment({
          course_id: req.body.course_id,
          comments: [obj],
        });
        newComment.save();
      }
      res.status(200).send({
        msg: "Success",
      });
    } else {
      res.status(400).send({
        msg: "Permission denied.",
      });
    }
  },

  async editComment(req, res) {
    const token = req.headers.x_authorization;

    let _account = await account.findOne({ id: token }).exec();
    let _user = await user.findOne({ id: _account.id }).exec();

    let _comment = await courseComment
      .findOne({ course_id: req.body.course_id })
      .exec();

    if (_comment) {
      let index = await _comment.comments.findIndex(
        (item) => item.id == req.body.id
      );

      if (index >= 0) {
        if (_user.id == _comment.comments[index].user_id) {
          let _listCmt = [..._comment.comments];
          _listCmt[index].content = req.body.content;

          _comment.comments = [];
          await _comment.save();

          _comment.comments = _listCmt;
          await _comment.save();

          res.status(200).send({
            msg: "Success",
          });
        } else {
          res.status(400).send({
            msg: "Permission denied.",
          });
        }
      } else {
        res.status(400).send({
          msg: "Comment not found.",
        });
      }
    } else {
      res.status(400).send({
        msg: "Comment not found.",
      });
    }
  },

  async deleteComment(req, res) {
    const token = req.headers.x_authorization;

    let _account = await account.findOne({ id: token }).exec();
    let _user = await user.findOne({ id: _account.id }).exec();

    let _comment = await courseComment
      .findOne({ course_id: req.body.course_id })
      .exec();

    if (_comment) {
      let index = await _comment.comments.findIndex(
        (item) => item.id == req.body.id
      );

      if (index >= 0) {
        if (_user.id == _comment.comments[index].user_id) {
          _comment.comments = await _comment.comments.filter(
            (item) => item.id != req.body.id
          );
          await _comment.save();

          res.status(200).send({
            msg: "Success",
          });
        } else {
          res.status(400).send({
            msg: "Permission denied.",
          });
        }
      } else {
        res.status(400).send({
          msg: "Comment not found.",
        });
      }
    } else {
      res.status(400).send({
        msg: "Comment not found.",
      });
    }
  },
};

async function getComment(arr) {
  let cmt = [];
  for (let index = 0; index < arr.length; index++) {
    let _user = await user.findOne({ id: arr[index].user_id }).exec();
    cmt[index] = {
      id: arr[index].id,
      date: arr[index].date,
      time: arr[index].time,
      content: arr[index].content,
      name: _user.name || "Incognito",
      avatar: "",
    };
  }
  return cmt;
}
