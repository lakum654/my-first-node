require("dotenv").config();
const exporess = require('express');
const mysql = require('mysql2');
const bcrypt = require("bcrypt");

const app = exporess();
app.use(exporess.json());


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});


 db.connect((err)=> {
    if(err) {
        console.error('Error connecting to the database:', err);
        return;
    }

    console.log('Connected to the MySQL database.');
 });


 app.get('/',(req,res) => {
    res.json("hello this is the backend");
 });

 app.get('/api/users',(req,res) => {
    const q = "SELECT * FROM users";
    db.query(q,(err,results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
 });

// Add user
app.post("/api/users", async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: "Name and email required" });

  try {
    // Hash the static password "123456"
    const hashedPassword = await bcrypt.hash("123456", 10); // 10 = salt rounds
    console.log(hashedPassword)
    const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(query, [name, email, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      res.status(201).json({
        id: result.insertId,
        name,
        email,
        // password: hashedPassword,  // ❌ don't return to frontend (only for demo/testing)
      });
    });
  } catch (err) {
    res.status(500).json({ error: "Password hashing failed" });
  }
});

app.delete("/api/users/:id", (req, res) => {
  const userId = req.params.id; 
  const query = "DELETE FROM users WHERE id = ?";
  db.query(query, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  });
});

app.put("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: "Name and email required" });

  const query = "UPDATE users SET name = ?, email = ? WHERE id = ?";
  db.query(query, [name, email, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ id: userId, name, email });
  });
});


 // Start server
app.listen(process.env.PORT, () => {
  console.log("🚀 Server running at http://localhost:3000");
});