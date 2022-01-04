const topic = require("../collections/TopicCollection");
const topicComment = require("../collections/TopicCommentCollection");
const tags = require("../collections/TagsCollection");

const account = require("../collections/AccountCollection");
const user = require("../collections/UserCollection");

const { customAlphabet } = require("nanoid");

module.exports = {
  async list(req, res) {
    const filter = req.query.filter;

    let _list = [];

    if (filter == undefined) {
      _list = await topic.find().exec();
    } else {
      _list = await topic.find({ tags: { $elemMatch: { name: filter } } }).exec();
    }

    for (let index = 0; index < _list.length; index++) {
      let _comment = await topicComment.findOne({ topic_id: _list[index].id }).exec();
      _list[index] = {
        id: _list[index].id,
        title: _list[index].title,
        description: _list[index].description,
        author: _list[index].author,
        tags: _list[index].tags,
        likes: _list[index].likes.length,
        comments: _comment ? _comment.comments.length : 0,
      };
    }

    res.status(200).send({
      msg: "Success",
      items: _list,
    });
  },

  async detail(req, res) {
    const id = req.query.id;

    let _topic = await topic.findOne({ id: id }).exec();

    let _comment = await topicComment.findOne({ topic_id: id }).exec();

    if (!_topic) {
      res.status(400).send({
        msg: "Topic không tồn tại.",
      });
    } else {
      const token = req.headers.x_authorization;
      let _account = null;
      let _user = null;
      let _editor = 0;
      let _isLike = -1;

      let _checkAuthor = await user.findOne({ id: _topic.author }).exec();

      if (token) {
        _account = await account.findOne({ id: token }).exec();
      }

      if (_account) {
        _user = await user.findOne({ id: _account.id }).exec();

        

        _editor = _user.level == "999" || _checkAuthor && _user.id == _checkAuthor.id ? 1 : 0;

        _isLike = _topic.likes.findIndex((item) => item.user_id == _user.id);
      }

      res.status(200).send({
        msg: "Success",
        items: {
          id: _topic.id,
          title: _topic.title,
          description: _topic.description,
          content: _topic.content,
          author: _checkAuthor ? _checkAuthor.name : "",
          tags: _topic.tags,
          date: _topic.date,
          likes: _topic.likes.length,
          isLike: _isLike >= 0 ? 1 : 0,
          editor: _editor,
          comments:_comment? _comment.length: 0,
        },
      });
    }
  },



  async edit(req, res) {
    const token = req.headers.x_authorization;
    const body = req.body;
    const id = body.id;

    let _topic = await topic.findOne({ id: id }).exec();
    let _comment = await topicComment.findOne({ topic_id: id }).exec();
    let _account = await account.findOne({ id: token }).exec();
    let _user = await user.findOne({ id: _account.id }).exec();

    if (body.title) _topic.title = body.title;
    if (body.description) _topic.description = body.description;
    if (body.content) _topic.content = body.content;
    if (body.tags) {
      let _tags = await body.tags.map((item) => {
        return { name: item };
      });
  
      for (let index = 0; index < _tags.length; index++) {
        let tagItem = await tags.findOne({ name: _tags[index].name }).exec();
        if (!tagItem) {
          let tagID = await nanoid();
          let newTag = new tags({ id: tagID, name: _tags[index].name });
          newTag.save();
        }
      }

      _topic.tags = _tags;
    }

   

    _topic.save();

    let _isLike = _topic.likes.findIndex((item) => item.user_id == _user.id);

    res.status(200).send({
      msg: "Success",
      items: {
        id: _topic.id,
        title: _topic.title,
        description: _topic.description,
        content: _topic.content,
        author:_user? _user.name: "",
        tags: _topic.tags,
        date: _topic.date,
        likes: _topic.likes.length,
        isLike: _isLike >= 0 ? 1 : 0,
        editor: 1,
        comments: _comment?_comment.length : 0,
      },
    });
  },

  async create(req, res) {
    const body = req.body;
    const token = req.headers.x_authorization;

    let _account = await account.findOne({ id: token }).exec();
    let _user = await user.findOne({ id: _account.id }).exec();

    let date = new Date();
    let _date = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    const nanoid = customAlphabet("1234567890abcdef", 11);

    let topicID = 0;

    do {
      topicID = await nanoid();
      let checkTopic = await topic.findOne({ id: topicID }).exec();

      if (checkTopic) {
        topicID = 0;
      }
    } while (!topicID);

    let _tags = await body.tags.map((item) => {
      return { name: item };
    });

    for (let index = 0; index < _tags.length; index++) {
      let tagItem = await tags.findOne({ name: _tags[index].name }).exec();
      if (!tagItem) {
        let tagID = await nanoid();
        let newTag = new tags({ id: tagID, name: _tags[index].name });
        newTag.save();
      }
    }

    let newTopic = new topic({
      id: topicID,
      title: body.title,
      description: body.description,
      content: body.content,
      author: _user.id,
      tags: _tags,
      date: _date,
      likes: [],
    });

    newTopic.save();

    res.status(200).send({
      msg: "Success",
      items: {
        id: newTopic.id,
        title: newTopic.title,
        description: newTopic.description,
        content: newTopic.content,
        author: newTopic.author,
        tags: newTopic.tags,
        date: newTopic.date,
        likes: newTopic.likes.length,
        isLike: 0,
        editor: 1,
        comment: [],
      },
    });
  },

  async getComments(req, res) {
    const token = req.headers.x_authorization;
    const id = req.query.id;
    let _comment = await topicComment.findOne({ topic_id: id }).exec();

    if (_comment) {
      comments = _comment.comments.map((item) => {
        return {
          content: item.content,
          date: item.date,
          id: item.id,
          time: item.time,
        };
      });
      for (let index = 0; index < comments.length; index++) {
        let _user = await user.findOne({ id: _comment.comments[index].user_id }).exec();
        if (_user) {
          comments[index].user_name = _user.name;
          if (token) {
            comments[index].editor = token == comments[index].user_id ? 1 : 0;
          }
        } else {
          comments[index].user_name = "Unknow";
          comments[index].editor = 0;
        }
      }
    }

    res.status(200).send({
      msg: "Success",
      items: comments
        ? {
            topic_id: _comment.topic_id,
            comments: comments,
          }
        : {},
    });
  }, 
  
  async getComments(req, res) {
    const token = req.headers.x_authorization;
    const id = req.query.id;
    let _comment = await topicComment.findOne({ topic_id: id }).exec();

    if (_comment) {
      comments = _comment.comments.map((item) => {
        return {
          content: item.content,
          date: item.date,
          id: item.id,
          time: item.time,
        };
      });
      for (let index = 0; index < comments.length; index++) {
        let _user = await user.findOne({ id: _comment.comments[index].user_id }).exec();
        if (_user) {
          comments[index].user_name = _user.name;
          if (token) {
            comments[index].editor = token == _comment.comments[index].user_id ? 1 : 0;
          }
        } else {
          comments[index].user_name = "Unknow";
          comments[index].editor = 0;
        }
      }
    }


    res.status(200).send({
      msg: "Success",
      items: comments
        ? {
            topic_id: _comment.topic_id,
            comments: comments,
          }
        : {},
    });
  },

  async comment(req, res) {
    const token = req.headers.x_authorization;

    let _account = await account.findOne({ id: token }).exec();
    let _user = await user.findOne({ id: _account.id }).exec();
    let _topic = await topic.findOne({ id: req.body.topic_id }).exec();

    if (!_topic) {
      res.status(400).send({
        msg: "Topic không tồn tại",
      });
      return;
    }

    let _comment = await topicComment.findOne({ topic_id: req.body.topic_id }).exec();

    const nanoid = customAlphabet("1234567890abcdef", 10);
    let _id = await nanoid();

    let date = new Date();

    let _date = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
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
      let newComment = new topicComment({
        topic_id: req.body.topic_id,
        comments: [obj],
      });
     await newComment.save();
    }
    res.status(200).send({
      msg: "Success",
      items: {
        id: obj.id,
        user_id: obj.user_id,
        user_name: _user.name,
        editor: 1,
        date: obj.date,
        time: obj.time,
        content: obj.content,
      }
    });

  
  },

  async editComment(req, res) {
    const token = req.headers.x_authorization;

    let _account = await account.findOne({ id: token }).exec();
    let _user = await user.findOne({ id: _account.id }).exec();

    let _comment = await topicComment.findOne({ topic_id: req.body.topic_id }).exec();

    if (_comment) {
      let index = await _comment.comments.findIndex((item) => item.id == req.body.id);

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

    let _comment = await topicComment.findOne({ topic_id: req.body.topic_id }).exec();

    if (_comment) {
      let index = await _comment.comments.findIndex((item) => item.id == req.body.id);

      if (index >= 0) {
        if (_user.id == _comment.comments[index].user_id) {
          _comment.comments = await _comment.comments.filter((item) => item.id != req.body.id);
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

  async tags(req, res) {
    const key = req.query.key;

    let _list = [];

    if (key == undefined) {
      _list = await tags.find({}, "name").exec();
    } else {
      _list = await tags.find({ name: new RegExp(key, "i") }, "name").exec();
    }

    _list = await _list.map((item) => {
      return { name: item.name };
    });

    res.status(200).send({
      msg: "Success",
      items: _list,
    });
  },

  async like(req, res) {
    const token = req.headers.x_authorization;

    let _account = await account.findOne({ id: token }).exec();
    let _user = await user.findOne({ id: _account.id }).exec();
    let _topic = await topic.findOne({ id: req.body.topic_id }).exec();

    if (!_topic) {
      res.status(400).send({
        msg: "Topic không tồn tại",
      });
      return;
    }

    let _checkLike = _topic.likes.findIndex(item => item.user_id == _user.id)
    if (_checkLike >= 0){
      res.status(200).send({
        msg: "Liked!!!",
      });
    } else {
      _topic.likes = [..._topic.likes, {user_id: _user.id}]
      _topic.save();
      res.status(200).send({
        msg: "Success",
      });
    }
  },

  async unlike(req, res) {
    const token = req.headers.x_authorization;

    let _account = await account.findOne({ id: token }).exec();
    let _user = await user.findOne({ id: _account.id }).exec();
    let _topic = await topic.findOne({ id: req.body.topic_id }).exec();

    if (!_topic) {
      res.status(400).send({
        msg: "Topic không tồn tại",
      });
      return;
    }

    let _checkLike = _topic.likes.findIndex(item => item.user_id == _user.id)
    if (_checkLike >= 0){
      _topic.likes = _topic.likes.filter(item => item.user_id != _user.id)
      _topic.save();
      res.status(200).send({
        msg: "Success",
      });
      
    } else {
      res.status(200).send({
        msg: "!!!",
      });
    }
  },
};
