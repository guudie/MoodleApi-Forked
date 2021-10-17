require("./src/modules/connection");

const express = require("express");

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let AuthRoute = require("./src/routes/AuthRoute");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/auth", AuthRoute);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
