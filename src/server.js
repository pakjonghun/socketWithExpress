import express from "express";
import { resolve } from "path";

const app = express();

app.use("/public", express.static(resolve(__dirname, "public")));
app.set("view engine", "pug");
app.set("views", resolve(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(3000, () => {
  console.log("start");
});
