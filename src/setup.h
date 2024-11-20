#ifndef SETUP_H
#define SETUP_H

#include <Arduino.h>
#include <ESP32Servo.h>
#include <DHTesp.h>
#include <ESP32Time.h>
#include <Wire.h>
#include <SSD1306.h>  

#define OLED_ADDRESS 0x3C
#define SDA_PIN 21
#define SCL_PIN 22

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

#endif // SETUP_H