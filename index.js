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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/auth", AuthRoute);
app.use("/user", UserRoute);

app.listen(port, () => {
  console.log(`App listening at ${port}`);
});
