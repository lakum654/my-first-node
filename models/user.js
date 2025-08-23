const db = require("../config/db");

const User = {
  getAll: (callback) => {
    db.query("SELECT * FROM users", callback);
  },

  create: (user, callback) => {
    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [user.name, user.email, user.password],
      callback
    );
  },

  update: (id, user, callback) => {
    db.query(
      "UPDATE users SET name=?, email=? WHERE id=?",
      [user.name, user.email, id],
      callback
    );
  },

  delete: (id, callback) => {
    db.query("DELETE FROM users WHERE id=?", [id], callback);
  }
};

module.exports = User;
