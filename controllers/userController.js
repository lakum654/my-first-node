const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.getUsers = (req, res) => {
  User.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.addUser = async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: "Name and email required" });

  try {
    const hashedPassword = await bcrypt.hash("123456", 10);
    const newUser = { name, email, password: hashedPassword };

    User.create(newUser, (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ id: result.insertId, name, email });
    });
  } catch (err) {
    res.status(500).json({ error: "Password hashing failed" });
  }
};

exports.updateUser = (req, res) => {
  const { name, email } = req.body;
  const id = req.params.id;

  if (!name || !email) return res.status(400).json({ error: "Name and email required" });

  User.update(id, { name, email }, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });

    res.json({ id, name, email });
  });
};

exports.deleteUser = (req, res) => {
  const id = req.params.id;

  User.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  });
};

exports.getProfile = (req, res) => {
  // req.user comes from token (id, email)
  const userId = req.user.id;

  // Query DB by ID
  const query = "SELECT id, name, email FROM users WHERE id = ?";
  require("../config/db").query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user: results[0] });
  });
};

