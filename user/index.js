const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../database/db");

const router = express.Router();

/**
 * getUsers
 * @returns
 */
const getUsers = () =>
  new Promise((resolve, reject) => {
    const records = [];
    db.each(
      "select * from user",
      (error, row) => {
        if (error) reject(error);
        const { username, id, role } = row;
        records.push({
          id,
          username,
          role,
        });
      },
      () => resolve(records)
    );
  });

const getUser = (username) =>
  new Promise((resolve, reject) => {
    db.get(
      "select id from user where username=? UNION ALL select NULL LIMIT 1",
      username,
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });

const serverError = (res) => res.json({ message: "Internal server error" });

router.get("/", async (req, res) => {
  const users = await getUsers();
  res.json({
    message: "success",
    data: users,
  });
});

router.post("/", async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (username && password && role) {
      // Add more validation if you want
      // * password min and max // password strength

      // Hash password before storing into db
      const hashedPassword = await bcrypt.hash(password, 10);

      // check user already exists or not
      const checkUser = (await getUser(username)).id === null;
      if (checkUser)
        db.run(
          "insert into user(username,password,role) values(?,?,?)",
          [username, hashedPassword, role],
          (error) => {
            if (error) {
              serverError(res);
            } else {
              res.json({ message: "User created successfully" });
            }
          }
        );
      else
        res.json({
          message: "user already exists",
        });
    } else {
      res.json({
        message: "Invalid request",
      });
    }
  } catch {
    serverError(res);
  }
});

module.exports = router;
