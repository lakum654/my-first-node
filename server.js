require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());

// Routes
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
app.use("/api/users", userRoutes);
app.use('/api/auth', authRoutes);

app.get("/", (req, res) => {
  res.send("Hello, this is the backend");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 Server running at http://localhost:${process.env.PORT || 3000}`);
});
