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

void rgbController() {
  Serial.println("Red");
  analogWrite(redPin, 255);  
  analogWrite(greenPin, 0);     
  analogWrite(bluePin, 0);   
  Serial.println("Green");  
  delay(1000);
}

void displayController() {
  display.init();
  display.flipScreenVertically();
  display.setFont(ArialMT_Plain_10);
  display.setTextAlignment(TEXT_ALIGN_LEFT);
  display.drawString(0, 0, "Hello World");
  display.display();
}

void rtcController() {
  Serial.println(rtc.getTime());
  delay(1000);
}

void potentiometerController() {
  int value = analogRead(slidePin); 
  Serial.println(value); 
  delay(100); 
}

void dhtController() {
  TempAndHumidity data = dht.getTempAndHumidity();

  if (isnan(data.temperature) || isnan(data.humidity)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  } 

  Serial.print("Humidity: "); Serial.print(data.humidity); Serial.print("%  ");
  Serial.print("Temperature: "); Serial.print(data.temperature); Serial.println("°C");
  delay(2000);
} 

void pirController() {
  int value = digitalRead(pirPin);
  Serial.println(value); 
  delay(100);
}

void photoController() {
  Serial.println(analogRead(photoPin));
  delay(100);
}

void servoController() {
  myServo.write(0); 
  delay(1000); 
  myServo.write(90); 
  delay(1000); 
  myServo.write(180); 
  delay(1000); 
  myServo.write(0); 
  delay(1000); 
} 

void relayController() {
  digitalWrite(relayPin, HIGH);
  delay(1000); 
  digitalWrite(relayPin, LOW); 
  delay(500);
} 

void buzzerController() {
  tone(buzzerPin, 1000); 
  delay(1000); 
  noTone(buzzerPin); 
  delay(500); 
}

void buttonController() {
  int signal = digitalRead(buttonPin); 
  if (signal == HIGH) Serial.println("Button pressed");
} 

void setup() {  
  Serial.begin(9600);

  // Set up servo 
  myServo.setPeriodHertz(50);
  myServo.attach(servoPin, 500, 2400); 
  myServo.attach(16); 

  // OUTPUT 
  pinMode(ledPin, OUTPUT);
  pinMode(buzzerPin, OUTPUT);
  pinMode(relayPin, OUTPUT);
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);
  displayController();   

  // INPUT
  pinMode(buttonPin, INPUT);
  pinMode(photoPin, INPUT); 
  dht.setup(dhtPin, DHTesp::DHT22); 
  rtc.setTime(30, 24, 15, 17, 1, 2021);  // 17th Jan 2021 15:24:30
}

void loop() {
  relayController();
}
