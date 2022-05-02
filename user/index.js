const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../database/db");

const { invalidRequest, serverError } = require("../messages/error");

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

const getUser = (username, id = null) => {
  let query = `select id,username,role from user where ${
    id ? "id" : "username"
  }=? UNION ALL select NULL ,NULL, NULL LIMIT 1`;

  return new Promise((resolve, reject) => {
    db.get(query, id || username, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

router.get("/", async (req, res) => {
  const users = await getUsers();
  res.json({
    message: "success",
    data: users,
  });
});
router.get("/:userId", async (req, res) => {
  const user = await getUser(null, req.params.userId);
  if (user.id) {
    res.json({
      message: "success",
      data: user,
    });
  } else {
    invalidRequest(res);
  }
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
      invalidRequest(res);
    }
  } catch {
    serverError(res);
  }
});

router.put("/:userId", async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const checkUserExists =
      (await getUser(null, req.params.userId)).id !== null;
    if (checkUserExists) {
      // Hash password before storing into db
      const hashedPassword = await bcrypt.hash(password, 10);
      db.run(
        "update user set username= ?, password= ? ,role = ? WHERE id=?",
        [username, hashedPassword, role, req.params.userId],
        [username, hashedPassword, role],
        (error) => {
          if (error) {
            serverError(res);
          } else {
            res.json({ message: "User updated successfully" });
          }
        }
      );
    } else {
      invalidRequest(res);
    }
  } catch {
    serverError(res);
  }
});
router.delete("/:userId", async (req, res) => {
  try {
    const checkUserExists =
      (await getUser(null, req.params.userId)).id !== null;
    if (checkUserExists) {
      db.run("delete from user where id = ? ", req.params.userId, (error) => {
        if (error) {
          serverError(res);
        } else {
          res.json({ message: "User deleted successfully" });
        }
      });
    } else {
      invalidRequest(res);
    }
  } catch {
    serverError(res);
  }
});

module.exports = router;
