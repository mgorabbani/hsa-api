import express from "express";
const MongoClient = require('mongodb').MongoClient;
import axios from 'axios';
import Uni from "../models/Uni";
import User from "../models/User";
import parseErrors from "../utils/parseErrors";
import authenticate from "../middlewares/authenticate";
import { throws } from "assert";

const router = express.Router();

const url = 'mongodb://localhost:27017';
const dbName = 'hsa';
router.get("/insights", (req, res) => {


    MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        if (err) {
            throw err;
        } else {

            const db = client.db(dbName);
            const collection = db.collection('admittedStudents');
            collection.aggregate(
                [
                    { "$sort": { "us_state": 1 } },
                    { $project: { name: 1, us_state: 1 } },
                    {
                        "$group": {
                            "_id": "$us_state",
                            "count": { "$sum": 1 }
                        }
                    }
                ]).toArray(function (err, results) {
                    if (err) throw err;
                    res.json(results)
                }
                )


        }
        client.close();
    });




});

router.post("/recommend", (req, res) => {

    const data = req.body.data;
    // console.log(data.undergradcgpa, 'RECOMMEND DATA')
    // get category from py API


    let category;
    axios.post('http://ec2-18-222-28-1.us-east-2.compute.amazonaws.com:5000', {
        "bd_cgpa": data.undergradcgpa,
        "gre_verbal": data.univarbal,
        "gre_quant": data.uniquant,
        "intjournal": data.intjournal,
        "intconference": data.intconference,
        "natjournal": data.natjournal,
        "natconference": data.natconference,
        "research_experience": data.research_experience,
        "job_experience": data.job_experience,
    })
        .then(function (response) {
            console.log('classssss', response.data);
            category = response.data.class;
        })
        .catch(function (error) {
            console.log(error);
        });

    category = category || 1
    let start, end;

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

            const db = client.db(dbName);
            const collection = db.collection('universities');

            let dept = data.major || 'Engr'
            var sort = {};
            sort[dept] = 1
            sort['HasBDAlumni'] = -1
            var query = {};
            query[dept] = { $gt: start, $lt: end };

            collection.aggregate([
                { $match: query },
                { $limit: 15 },
                { $sort: sort }
            ]).toArray(function (err, docs) {
                if (err) res.json({ err: 'Something went wrong on database' });
                if (docs.length < 5) {
                    dept = 'Engr'
                    sort[dept] = 1
                    var query = {};
                    query[dept] = { $gt: start, $lt: end };
                    collection.aggregate([
                        { $match: query },
                        { $limit: 15 },
                        { $sort: sort }
                    ]).toArray(function (err, docs) {
                        if (err) res.json({ err: 'Something went wrong on database' });
                        res.json({ docs: docs, dept: dept })
                        client.close();
                    });
                } else {
                    res.json({ docs: docs, dept: dept })
                    client.close();
                }

            });


        }

    });



});
router.post("/bd", (req, res) => {
    const data = req.body.data;


    Uni.find({ name: new RegExp(data, 'i') }).limit(10).then(list => {
        res.json(list)
    }).catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});



router.post("/selected_uni_list", (req, res) => {
    const data = req.body.data;
    let tempdata = ['Abilene Christian University']
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        if (err) {
            throw err
        } else {

            const db = client.db(dbName);
            const collection = db.collection('universities');

            collection.find({ Name: { $in: tempdata } }).toArray(function (err, docs) {
                if (err) {
                    res.json({ err: err })
                } else {
                    res.json({ docs: docs })
                }
                client.close();
            });

        }

    });
});


export default router;
