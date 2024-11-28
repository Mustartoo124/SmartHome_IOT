const express = require("express");
const axios = require("axios"); 
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
  servoData:[
    {
      servoState: Boolean,
      measuredAt:{type: Date, default: Date.now}
    }
  ]
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
//Adding device data to the server
app.post("/add-sensor-data", async(req,res) =>{
  const {username, temperature, humidity,servoState} = req.body;
  try{
    const user = await User.findOne({username});
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.sensorData.push({ temperature, humidity});
    user.servoData.push({servoState});
    await user.save();
    res.status(200).json({ message: "Sensor data added successfully" });

  }
  catch(error){
    console.error("Error adding sensor data:", error);
    res.status(500).json({ error: "An error occurred while adding sensor data" });
  }
});

// Chatbot endpoint
app.post("/chatbot", async (req, res) => {
  const { username, question } = req.body;

  try {
    // Gửi câu hỏi tới Flask API
    const flaskResponse = await axios.post("http://localhost:5000/analyze", { question });
    const { intent, response: nlpResponse } = flaskResponse.data;

    // Xử lý intent
    if (intent === "temperature") {
      // Lấy dữ liệu nhiệt độ từ MongoDB
      const user = await User.findOne({ username });
      if (user && user.sensorData.length > 0) {
        const latestData = user.sensorData[user.sensorData.length - 1];
        return res.json({ response: `Nhiệt độ hiện tại là ${latestData.temperature}°C` });
      } else {
        return res.json({ response: "Không có dữ liệu nhiệt độ." });
      }
    } else if (intent === "humidity") {
      // Lấy dữ liệu độ ẩm từ MongoDB
      const user = await User.findOne({ username });
      if (user && user.sensorData.length > 0) {
        const latestData = user.sensorData[user.sensorData.length - 1];
        return res.json({ response: `Độ ẩm hiện tại là ${latestData.humidity}%` });
      } else {
        return res.json({ response: "Không có dữ liệu độ ẩm." });
      }
    } else if (intent === "weather_food") {
      // Đưa ra gợi ý món ăn dựa trên nhiệt độ
      const user = await User.findOne({ username });
      if (user && user.sensorData.length > 0) {
        const latestData = user.sensorData[user.sensorData.length - 1];
        const temp = latestData.temperature;
        const foodSuggestion = temp > 30 ? "món lạnh như kem, chè" : "món nóng như lẩu, phở";
        return res.json({ response: `Với nhiệt độ ${temp}°C, bạn nên ăn ${foodSuggestion}.` });
      } else {
        return res.json({ response: "Không có dữ liệu để gợi ý món ăn." });
      }
    }

    // Trả lời intent không liên quan đến thiết bị
    res.json({ response: nlpResponse });

  } catch (error) {
    console.error("Error in chatbot:", error);
    res.status(500).json({ error: "Có lỗi xảy ra, vui lòng thử lại." });
  }
});

//======
app.get("/index", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
 });

 