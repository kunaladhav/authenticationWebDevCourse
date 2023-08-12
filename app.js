require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

// console.log(process.env.API_KEY);

app.set("view engine", "ejs");

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });

  async function loadSecret() {
    try {
      newUser.save();

      res.render("secrets");
    } catch (error) {
      res.send(error);
    }
  }

  loadSecret();
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  async function checkCred() {
    try {
      const check = await User.findOne({ email: username });

      if (check) {
        if (check.password === password) {
          res.render("secrets");
        }
      }
    } catch (error) {
      res.send(error);
    }
  }

  checkCred();
});

app.listen("3000", function (req, res) {
  console.log("Server Connected on Port 3000");
});
