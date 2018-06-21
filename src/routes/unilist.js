import express from "express";
import Uni from "../models/Uni";
import parseErrors from "../utils/parseErrors";
import authenticate from "../middlewares/authenticate";

const router = express.Router();

router.get("/s", (req, res) => {


    User.aggregate(
        [
            { "$sort": { "state": 1 } },
            { $project: { name: 1, State: 1 } },
            {
                "$group": {
                    "_id": "$State",
                    "count": { "$sum": 1 }
                }
            }
        ],
        function (err, results) {
            if (err) throw err;
            return results;
        }
    ).then(u => {
        res.json(u)
    })


});
router.post("/bd", (req, res) => {
    const data = req.body.data;
    console.log(data, 'bd uni list')

    Uni.find({ name: new RegExp(data, 'i') }).then(list => {
        res.json(list)
    }).catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.post("/usa", (req, res) => {
    const data = req.body.data;
    console.log(data, 'bd uni list')

    Uni.find({ name: new RegExp(data, 'i') }).then(list => {
        res.json(list)
    }).catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});


export default router;
