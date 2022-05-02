const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const db = require("../../database/db");
const { serverError, invalidUsernamePassword } = require("../../messages/error");
const { secret } = require("../../config");

const authRouter = express.Router();

authRouter.post("/", (req, res) => {
  try {
    const { username, password } = req.body;

    db.get(
      "select id,username,password,role from user where username = ? UNION ALL select NULL ,NULL, NULL,NUll LIMIT 1",
      username,
      async (error, row) => {
        if (error) {
          serverError();
        }
        if (row.username && (await bcrypt.compare(password, row.password))) {
          const payload = {
            userId: row.id, // use UUID for better security
            username: row.username, // Just for display purpose | use firstname last name instead
            role: row.role, //else if you want query database everytime and check the role
          };
          const token = jwt.sign(payload, secret, { expiresIn: "1h" });

          res.setHeader("Authorization", `Bearer ${token}`);
          res.json({
            message: "Login success",
          });
        } else {
          res.status(401);
          invalidUsernamePassword(res);
        }
      }
    );
  } catch {
    serverError(res);
  }
});

module.exports = authRouter;
