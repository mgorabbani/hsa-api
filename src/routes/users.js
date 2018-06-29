import express from "express";
import User from "../models/User";

import parseErrors from "../utils/parseErrors";
import { sendConfirmationEmail } from "../mailer";
import authenticate from "../middlewares/authenticate";

const router = express.Router();

router.get("/sd", (req, res) => {
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

router.post("/", (req, res) => {
  const { email, password, name } = req.body.user;
  const user = new User({ email, name });
  user.setPassword(password);
  user.setConfirmationToken();
  user
    .save()
    .then(userRecord => {
      sendConfirmationEmail(userRecord);
      res.json({ user: userRecord.toAuthJSON() });
    })
    .catch(err => res.status(400).json({ errors: err }));
});

router.get("/current_user", authenticate, (req, res) => {
  if (!!req.currentUser) {
    res.json({
      user: req.currentUser
    });
  } else {
    res.json({
      errors: 'No User found',
    });
  }

});

router.patch("/current_user", authenticate, (req, res) => {
  console.log('dukse!')
  let email = req.currentUser.email;
  let data = req.body.data

  User.findOneAndUpdate({ email: email }, { $set: data }, { new: true }).then((user) => {
    console.log('CurrentUSer', req.currentUser)
  })

  res.json({
    message: 'Successfully Updated!'
  });
});

router.post("/uni_bucket", authenticate, (req, res) => {
  let email = req.currentUser.email;
  const value = req.body.data;

  try {
    User.findOneAndUpdate({ email: email }, { $push: { bucket_list: { name: value } } }).then((user) => {
      res.json(user)
    })
  } catch (e) {
    res.status(500).json(e)
  }
});

router.delete("/uni_bucket", authenticate, (req, res) => {
  let email = req.currentUser.email;
  const value = req.body.data;
  console.log(value)
  try {
    User.findOneAndUpdate({ email: email }, { $pull: { bucket_list: { name: value } } }).then((member) => {
      // console.log(member)
      res.json(member)
    })
  } catch (e) {
    res.status(500).json(e)
  }
});


export default router;
