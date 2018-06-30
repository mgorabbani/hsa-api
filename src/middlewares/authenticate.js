import jwt from "jsonwebtoken";
import User from "../models/User";
require('dotenv').config();
export default (req, res, next) => {
  const header = req.headers.authorization;
  let token;

  if (header) token = header.split(" ")[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json({ errors: { global: "Invalid token" } });
      } else {
        User.findOne({ email: decoded.email }).then(user => {
          if (user)
            req.currentUser = user.toAuthJSON();
          next();
        });
      }
    });
  } else {
    res.status(401).json({ errors: { global: "No token" } });
  }
};
