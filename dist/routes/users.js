"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _User = require("../models/User");

var _User2 = _interopRequireDefault(_User);

var _parseErrors = require("../utils/parseErrors");

var _parseErrors2 = _interopRequireDefault(_parseErrors);

var _mailer = require("../mailer");

var _authenticate = require("../middlewares/authenticate");

var _authenticate2 = _interopRequireDefault(_authenticate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get("/sd", function (req, res) {
  // User.aggregate.sortByCount('users').then((err, user) => {
  //   if (!err) {
  //     res.json({
  //       result: user
  //     });
  //   }

  // })

  res.json({
    result: 'worng'
  });
});

router.post("/", function (req, res) {
  var _req$body$user = req.body.user,
      email = _req$body$user.email,
      password = _req$body$user.password,
      name = _req$body$user.name;

  var user = new _User2.default({ email: email, name: name });
  user.setPassword(password);
  user.setConfirmationToken();
  user.save().then(function (userRecord) {
    (0, _mailer.sendConfirmationEmail)(userRecord);
    res.json({ user: userRecord.toAuthJSON() });
  }).catch(function (err) {
    return res.status(400).json({ errors: err });
  });
});

router.get("/current_user", _authenticate2.default, function (req, res) {
  if (!!req.currentUser) {
    res.json({
      user: req.currentUser
    });
  } else {
    res.json({
      errors: 'No User found'
    });
  }
});

router.patch("/current_user", _authenticate2.default, function (req, res) {
  console.log('dukse!');
  var email = req.currentUser.email;
  var data = req.body.data;

  _User2.default.findOneAndUpdate({ email: email }, { $set: data }, { new: true }).then(function (user) {
    console.log('CurrentUSer', req.currentUser);
  });

  res.json({
    message: 'Successfully Updated!'
  });
});

router.post("/uni_bucket", _authenticate2.default, function (req, res) {
  var email = req.currentUser.email;
  var value = req.body.data;

  try {
    _User2.default.findOneAndUpdate({ email: email }, { $push: { bucket_list: { name: value } } }).then(function (user) {
      res.json(user);
    });
  } catch (e) {
    res.status(500).json(e);
  }
});

router.delete("/uni_bucket", _authenticate2.default, function (req, res) {
  var email = req.currentUser.email;
  var value = req.body.data;
  console.log(value);
  try {
    _User2.default.findOneAndUpdate({ email: email }, { $pull: { bucket_list: { name: value } } }).then(function (member) {
      // console.log(member)
      res.json(member);
    });
  } catch (e) {
    res.status(500).json(e);
  }
});

exports.default = router;
//# sourceMappingURL=users.js.map