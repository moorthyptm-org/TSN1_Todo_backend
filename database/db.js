const sqlLite = require("sqlite3").verbose();
const path = require("path");

const db = new sqlLite.Database(path.join("database", "todo.db"));

db.run(
  "CREATE TABLE IF NOT EXISTS user(id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(20) UNIQUE, password VARCHAR(20), role VARCHAR(10))"
);
db.run(
  `CREATE TABLE IF NOT EXISTS todos(id INTEGER PRIMARY KEY AUTOINCREMENT, 
    title VARCHAR(50), comment VARCHAR(100), addedOn real, status BOOLEAN NOT NULL default 0, userId INTEGER NOT NULL,FOREIGN KEY(userId) REFERENCES user(id) )`
);

// Todo
// PRAGMA foreign_keys = ON;

module.exports = db;
