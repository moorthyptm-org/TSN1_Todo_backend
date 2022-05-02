const sqlLite = require("sqlite3").verbose();
const path = require("path");

const db = new sqlLite.Database(path.join("database", "todo.db"));

db.run(
  "CREATE TABLE IF NOT EXISTS user(id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(20) UNIQUE, password VARCHAR(20), role VARCHAR(10))"
);

module.exports = db;
