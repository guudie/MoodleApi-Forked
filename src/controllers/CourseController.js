const course = require("../collections/CourseCollection");
const method = require("../modules/method");

module.exports = {
  async list(req, res) {
    let cate_id = req.query.category;

    switch (cate_id) {
      case "0":
        let _list = await course.find().exec();
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

        break;

      default:
        res.status(400).send({
          msg: "Không thể lấy khóa học!",
        });
        break;
    }
  },
};
