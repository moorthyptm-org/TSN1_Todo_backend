const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../../database/db");

const { invalidRequest, serverError } = require("../../messages/error");
const {
  todoCreatedSuccessfully,
  todoUpdatedSuccessfully,
  todoDeletedSuccessfully,
} = require("../../messages/success");

const todoRouter = express.Router();

/**
 * getTodos
 * @returns
 */
const getTodos = (userId) =>
  new Promise((resolve, reject) => {
    const records = [];
    db.each(
      "select * from todos where userId =?",
      userId,
      (error, row) => {
        if (error) reject(error);
        const { title, comment, status, addedOn, id } = row;
        records.push({
          title,
          comment,
          status,
          addedOn,
          id,
        });
      },
      () => resolve(records)
    );
  });

const getTodo = (id, userId) => {
  let query = `select title, comment,  status,  addedOn,  id, from todos where id= ? , userId=?
  }=? UNION ALL select NULL ,NULL, NULL ,NULL, NULL LIMIT 1`;

  return new Promise((resolve, reject) => {
    db.get(query, [id, userId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

todoRouter.get("/", async (req, res) => {
  const todos = await getTodos();
  res.json({
    message: "success",
    data: todos,
  });
});
todoRouter.get("/:todoId", async (req, res) => {
  const user = await getTodo(req.params.todoId, req.params.userId);
  if (user.id) {
    res.json({
      message: "success",
      data: user,
    });
  } else {
    res.status(400);
    invalidRequest(res);
  }
});

todoRouter.post("/", async (req, res) => {
  try {
    const { title, comment, addedOn, userId } = req.body;
    if (title && comment && addedOn && userId) {
      db.run(
        "insert into todos(title,comment,addedOn,userId) values(?,?,?,?)",
        [title, comment, addedOn, userId],
        (error) => {
          if (error) {
            res.status(500);
            serverError(res);
          } else {
            res.status(201);
            todoCreatedSuccessfully(res);
          }
        }
      );
    } else {
      res.status(400);
      invalidRequest(res);
    }
  } catch (error) {
    serverError(res);
  }
});

todoRouter.put("/:todoId", async (req, res) => {
  try {
    const { title, comment, userId } = req.body; // if you want add updatedOn
    const checkTodoExists =
      (await getTodo(req.params.todoId, req.params.userId)).id !== null;

    if (checkTodoExists) {
      db.run(
        "update user set title= ?, comment= ?  WHERE id=? , userId:?",
        [title, comment, req.params.todoId, userId],
        (error) => {
          if (error) {
            res.status(500);
            serverError(res);
          } else {
            todoUpdatedSuccessfully(res);
          }
        }
      );
    } else {
      res.status(400);
      invalidRequest(res);
    }
  } catch {
    res.status(500);
    serverError(res);
  }
});
todoRouter.delete("/:todoId", async (req, res) => {
  try {
    const checkTodoExists =
      (await getTodo(req.params.todoId, req.params.userId)).id !== null;
    if (checkTodoExists) {
      db.run(
        "delete from user where id = ? , userId=? ",
        [req.params.todoId, req.params.userId],
        (error) => {
          if (error) {
            res.status(500);
            serverError(res);
          } else {
            todoDeletedSuccessfully(res);
          }
        }
      );
    } else {
      res.status(400);
      invalidRequest(res);
    }
  } catch {
    res.status(500);
    serverError(res);
  }
});

module.exports = todoRouter;
