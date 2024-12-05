#ifndef SETUP_H
#define SETUP_H

#include <Arduino.h>
#include <ESP32Servo.h>
#include <DHTesp.h>
#include <ESP32Time.h>
#include <Wire.h>
#include <SSD1306.h>
#include <vector>
#include <cmath>
#include <string>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

#include <WiFi.h>
#include <FireBase_ESP_Client.h>

#define OLED_ADDRESS 0x3C
#define SDA_PIN 21
#define SCL_PIN 22

#define WIFI_SSID "Wokwi-GUEST"
#define WIFI_PASSWORD ""

// Firebase Credentials
#define FIREBASE_HOST "https://iotfirebase-cbc07-default-rtdb.asia-southeast1.firebasedatabase.app/"
#define FIREBASE_AUTH "AIzaSyDAGxRZC-StIXj5O75N4wTU7Xr0kNLXUfY"

const int ledPin = 15;
const int buzzerPin = 2; 
const int relayPin = 32; 
const int servoPin = 16; 
const int photoPin = 35; 
const int pirPin = 17; 
const int buttonPin = 5; 
const int dhtPin = 18; 
const int slidePin = 34;
const int redPin = 25;
const int greenPin = 33;
const int bluePin = 32;

Servo myServo; 
DHTesp dht;
ESP32Time rtc;
SSD1306 display(OLED_ADDRESS, SDA_PIN, SCL_PIN);

float temperature = 0.0; 
float humidity = 0.0; 
float slideValue = 0.0;
float servoAngle = 0.0; 
float servoFirebase = 0.0;
unsigned long lastDebounceTime = 0;
bool led = false;
int lastMinute = 0;
bool photoState = false; // false: dark, true: light
bool pirState = false; // false: no motion, true: motion
std::string currentTime = "01-01-2024 00:00:00";
std::string firebaseTime = "01-01-2024 00:00:00";

bool activeButton = false;
bool lastButtonState = LOW; 


// Firebase objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;
#endif // SETUP_H