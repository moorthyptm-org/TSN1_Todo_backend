const express = require("express");
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

router.get("/", async (req, res) => {
  const users = await getUsers();
  res.json({
    message: "success",
    data: users,
  });
});

router.post("/", (req, res) => {
  const { username, password, role } = req.body;
  if (username && password && role) {
    // storing password as plain text not recommended
    db.run(
      "insert into user(username,password,role) values(?,?,?)",
      [username, password, role],
      (error) => {
        if (error) {
          res.json({ message: "Internal Server error" });
        } else {
          res.json({ message: "User created successfully " });
        }
      }
    );
  } else {
    res.json({
      message: "Invalid request ",
    });
  }
});

module.exports = router;
