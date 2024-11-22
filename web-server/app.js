const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 3000;
app.use(express.static(path.join(__dirname, "./")));
const mongoDBUrl = 'mongodb+srv://NguyenTrongNhan:f2Us0g0IEjL43GHp@iotdatabase.p9hhk.mongodb.net/';

mongoose.connect(mongoDBUrl)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  sensorData: [
    {
      temperature: Number,
      humidity: Number,
      measuredAt: { type: Date, default: Date.now },
    },
  ],
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: "Username or Email already exists" });
    }
    const newUser = new User({ username, password, email });
    await newUser.save();
    res.status(200).json({ message: "Signup successful" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: "An error occurred during signup" });
  }
});


app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    res.redirect("/index");
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "An error occurred during login" });
  }
});
app.get("/index", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
 });
