const express = require("express");
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
  let query = `select title, comment,  status,  addedOn,  id from todos where id= ? AND userId=? UNION ALL select NULL ,NULL, NULL ,NULL, NULL LIMIT 1`;

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
  const todos = await getTodos(res.locals.userId);
  res.json({
    message: "success",
    data: todos,
  });
});
todoRouter.get("/:todoId", async (req, res) => {
  const user = await getTodo(req.params.todoId, res.locals.userId);
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
    const { title, comment, addedOn } = req.body;
    const { userId } = res.locals;
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
    const { title, comment } = req.body; // if you want add updatedOn
    const checkTodoExists =
      (await getTodo(req.params.todoId, res.locals.userId)).id !== null;

    if (checkTodoExists) {
      db.run(
        "update todos set title= ?, comment= ?  WHERE id=? AND userId=?",
        [title, comment, req.params.todoId, res.locals.userId],
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
  } catch (e) {
    res.status(500);
    serverError(res);
  }
});
todoRouter.delete("/:todoId", async (req, res) => {
  try {
    const checkTodoExists =
      (await getTodo(req.params.todoId, res.locals.userId)).id !== null;
    if (checkTodoExists) {
      db.run(
        "delete from todos where id = ? AND userId= ? ",
        [req.params.todoId, res.locals.userId],
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
todoRouter.patch("/:todoId/mark-done", async (req, res) => {
  try {
    const checkTodoExists =
      (await getTodo(req.params.todoId, res.locals.userId)).id !== null;
    if (checkTodoExists) {
      db.run(
        "update todos set status= ? WHERE id=? AND userId=?",
        [1, req.params.todoId, res.locals.userId],
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

module.exports = todoRouter;
