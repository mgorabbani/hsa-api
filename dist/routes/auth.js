"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _User = require("../models/User");

var _User2 = _interopRequireDefault(_User);

var _mailer = require("../mailer");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post("/", function (req, res) {
  var credentials = req.body.credentials;

  _User2.default.findOne({ email: credentials.email }).then(function (user) {
    if (user && user.isValidPassword(credentials.password)) {
      res.json({ user: user.toAuthJSON() });
    } else {
      res.status(400).json({ errors: { global: "Invalid credentials" } });
    }
  });
});

router.post("/confirmation", function (req, res) {
  var token = req.body.token;
  _User2.default.findOneAndUpdate({ confirmationToken: token }, { confirmationToken: "", confirmed: true }, { new: true }).then(function (user) {
    return user ? res.json({ user: user.toAuthJSON() }) : res.status(400).json({});
  });
});

router.post("/reset_password_request", function (req, res) {
  _User2.default.findOne({ email: req.body.email }).then(function (user) {
    if (user) {
      (0, _mailer.sendResetPasswordEmail)(user);
      res.json({});
    } else {
      res.status(400).json({ errors: { global: "There is no user with such email" } });
    }
  });
});

router.post("/validate_token", function (req, res) {
  _jsonwebtoken2.default.verify(req.body.token, process.env.JWT_SECRET, function (err) {
    if (err) {
      res.status(401).json({});
    } else {
      res.json({});
    }
  });
});

router.post("/reset_password", function (req, res) {
  var _req$body$data = req.body.data,
      password = _req$body$data.password,
      token = _req$body$data.token;

  _jsonwebtoken2.default.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      res.status(401).json({ errors: { global: "Invalid token" } });
    } else {
      _User2.default.findOne({ _id: decoded._id }).then(function (user) {
        if (user) {
          user.setPassword(password);
          user.save().then(function () {
            return res.json({});
          });
        } else {
          res.status(404).json({ errors: { global: "Invalid token" } });
        }
      });
    }
  });
});

exports.default = router;
//# sourceMappingURL=auth.js.map