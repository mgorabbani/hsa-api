'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _Uni = require('../models/Uni');

var _Uni2 = _interopRequireDefault(_Uni);

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

var _parseErrors = require('../utils/parseErrors');

var _parseErrors2 = _interopRequireDefault(_parseErrors);

var _authenticate = require('../middlewares/authenticate');

var _authenticate2 = _interopRequireDefault(_authenticate);

var _assert = require('assert');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MongoClient = require('mongodb').MongoClient;


var router = _express2.default.Router();

var url = 'mongodb://localhost:27017';
var dbName = 'hsa';
router.get("/insights", function (req, res) {

    MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        if (err) {
            throw err;
        } else {

            var db = client.db(dbName);
            var collection = db.collection('admittedStudents');
            collection.aggregate([{ "$sort": { "us_state": 1 } }, { $project: { name: 1, us_state: 1 } }, {
                "$group": {
                    "_id": "$us_state",
                    "count": { "$sum": 1 }
                }
            }]).toArray(function (err, results) {
                if (err) throw err;
                res.json(results);
            });
        }
        client.close();
    });
});

router.post("/recommend", function (req, res) {

    var data = req.body.data;
    // console.log(data.undergradcgpa, 'RECOMMEND DATA')
    // get category from py API


    var category = void 0;
    _axios2.default.post('http://ec2-18-222-28-1.us-east-2.compute.amazonaws.com:5000', {
        "bd_cgpa": data.undergradcgpa,
        "gre_verbal": data.univarbal,
        "gre_quant": data.uniquant,
        "intjournal": data.intjournal,
        "intconference": data.intconference,
        "natjournal": data.natjournal,
        "natconference": data.natconference,
        "research_experience": data.research_experience,
        "job_experience": data.job_experience
    }).then(function (response) {
        console.log('classssss', response.data);
        category = response.data.class;
    }).catch(function (error) {
        console.log(error);
    });

    category = category || 1;
    var start = void 0,
        end = void 0;

    switch (category) {
        case 1:
            start = 0;
            end = 20;
            break;
        case 2:
            start = 20;
            end = 40;
            break;
        case 3:
            start = 40;
            end = 60;
            break;
        case 4:
            start = 60;
            end = 100;
            break;
        case 5:
            start = 100;
            end = 200;
            break;
        case 6:
            start = 200;
            end = 900;
            break;

        default:
            break;
    }

    MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        if (err) {
            res.json({ err: err });
        } else {

            var db = client.db(dbName);
            var collection = db.collection('universities');

            var dept = data.major || 'Engr';
            var sort = {};
            sort[dept] = 1;
            sort['HasBDAlumni'] = -1;
            var query = {};
            query[dept] = { $gt: start, $lt: end };

            collection.aggregate([{ $match: query }, { $limit: 15 }, { $sort: sort }]).toArray(function (err, docs) {
                if (err) res.json({ err: 'Something went wrong on database' });
                if (docs.length < 5) {
                    dept = 'Engr';
                    sort[dept] = 1;
                    var query = {};
                    query[dept] = { $gt: start, $lt: end };
                    collection.aggregate([{ $match: query }, { $limit: 15 }, { $sort: sort }]).toArray(function (err, docs) {
                        if (err) res.json({ err: 'Something went wrong on database' });
                        res.json({ docs: docs, dept: dept });
                        client.close();
                    });
                } else {
                    res.json({ docs: docs, dept: dept });
                    client.close();
                }
            });
        }
    });
});
router.post("/bd", function (req, res) {
    var data = req.body.data;

    _Uni2.default.find({ name: new RegExp(data, 'i') }).limit(10).then(function (list) {
        res.json(list);
    }).catch(function (err) {
        return res.status(400).json({ errors: (0, _parseErrors2.default)(err.errors) });
    });
});

router.post("/selected_uni_list", function (req, res) {
    var data = req.body.data;
    var tempdata = ['Abilene Christian University'];
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        if (err) {
            throw err;
        } else {

            var db = client.db(dbName);
            var collection = db.collection('universities');

            collection.find({ Name: { $in: tempdata } }).toArray(function (err, docs) {
                if (err) {
                    res.json({ err: err });
                } else {
                    res.json({ docs: docs });
                }
                client.close();
            });
        }
    });
});

exports.default = router;
//# sourceMappingURL=unilist.js.map