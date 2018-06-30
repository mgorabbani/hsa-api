"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _dotenv = require("dotenv");

var _dotenv2 = _interopRequireDefault(_dotenv);

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

var _auth = require("./routes/auth");

var _auth2 = _interopRequireDefault(_auth);

var _users = require("./routes/users");

var _users2 = _interopRequireDefault(_users);

var _unilist = require("./routes/unilist");

var _unilist2 = _interopRequireDefault(_unilist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();
var app = (0, _express2.default)();
app.use(_bodyParser2.default.json());
_mongoose2.default.Promise = _bluebird2.default;
_mongoose2.default.connect(process.env.MONGODB_URL);

app.use("/api/auth", _auth2.default);
app.use("/api/users", _users2.default);
app.use("/api/unilist", _unilist2.default);

app.get("/", function (req, res) {
    res.sendFile(_path2.default.join(__dirname, "index.html"));
});

app.listen(8888, function () {
    return console.log("Running on localhost:8888");
});
//# sourceMappingURL=index.js.map