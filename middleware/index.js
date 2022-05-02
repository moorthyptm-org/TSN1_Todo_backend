const jwtLib = require("jsonwebtoken");
const { secret } = require("../config");
const { serverError } = require("../messages/error");

const authendication = (req, res, next) => {
  try {
    const jwt = req.headers.authorization?.split("Bearer")[1].trim();
    if (jwtLib.verify(jwt, secret)) {
      const { userId, role } = jwtLib.decode(jwt);
      res.locals.userId = userId;
      res.locals.role = role;
      next();
    } else {
      res.json({
        message: "Please login to access",
      });
    }
  } catch (e) {
    if (e.message === "jwt must be provided" || e.message === "jwt expired") {
      res.json({
        message: "Please login to access",
      });
      return;
    }
    serverError(res);
  }
};
const authorization = (expectedRole, req, res, next) => {
  if (res.locals.role === expectedRole) {
    next();
  } else {
    res.json({
      message: "Your not authorized to perform this operation",
    });
  }
};

module.exports = {
  authendication,
  authorization,
};
