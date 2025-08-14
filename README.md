# SmartHome IoT with Chatbot & Web Control

## 📌 Overview
**SmartHome IoT** is a complete smart home solution that integrates:
- **ESP32** for controlling sensors and actuators
- **Firebase Realtime Database** for cloud storage and device state synchronization
- **Web dashboard** for remote control and monitoring
- **AI Chatbot** using **Ollama + LangChain** to answer questions and control devices via chat interface

---

## 🛠 Features
- Display temperature, humidity, light status, and gas level on the web
- Control servo motors, relays, and LEDs from the web or via Firebase
- Motion detection (PIR) for automated light activation
- Automatic lighting when dark or when motion is detected
- Buzzer alarm and servo action when temperature exceeds safety limits
- AI Chatbot to answer sensor-related queries and control devices

---

## 📂 Project Structure
SMARTHOME_IOT/
│
├── chat-server/ # AI Chatbot server
│ └── chat_api.py # Chatbot API (FastAPI + Ollama + LangChain)
│
├── src/ # ESP32 firmware
│ ├── main.cpp
│ └── setup.h
│
├── web-server/ # Web dashboard
│ ├── index.html
│ ├── index.js
│ ├── login.html
│ └── style.css
│
├── package.json # Node.js dependencies
├── platformio.ini # PlatformIO configuration for ESP32
├── requirements.txt # Python dependencies for chatbot
└── README.md

## ⚙ Hardware Requirements
- **ESP32**
- **DHT22** temperature & humidity sensor
- **PIR motion sensor**
- **Photoresistor** (light sensor)
- **Relay module** (for lights/fans)
- **Buzzer**
- **Servo motor**
- **OLED SSD1306** display
- 5V power supply

---

## 💻 Software Requirements
- **PlatformIO** (Arduino framework)
- **Firebase Realtime Database**
- **Node.js + Express** for web server
- **Python + FastAPI + Ollama + LangChain** for AI chatbot

---

## 🔧 Setup Instructions

### 1. ESP32 Firmware
1. Open the project in **VSCode**.
2. Install the **PlatformIO** extension.
3. Connect the ESP32 via USB.
4. Update **WIFI_SSID** and **WIFI_PASSWORD** in `setup.h`.
5. Upload the code:
```bash
pio run --target upload 

### Dependencies for chatbot server
pip install -r requirements.txt

### Activate Chatbot server
ollama pull llama3
uvicorn chat_api:app --reload --port 5000

### Web server 
cd web-server
npm install
npm start

Open your browser at:
http://localhost:3000 (or the configured port).
