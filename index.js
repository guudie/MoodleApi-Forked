require("./src/modules/connection");

const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

const AuthRoute = require("./src/routes/AuthRoute");
const UserRoute = require("./src/routes/UserRoute");
const CourseRoute = require("./src/routes/CourseRoute");
const TopicRoute = require("./src/routes/TopicRoute");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  next();
});

app.post("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  next();
});

app.use("/auth", AuthRoute);
app.use("/user", UserRoute);
app.use("/course", CourseRoute);
app.use("/topic", TopicRoute);

app.listen(port, () => {
  console.log(`App listening at ${port}`);
});
