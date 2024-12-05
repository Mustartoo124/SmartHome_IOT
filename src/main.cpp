#include "setup.h"  

// OLED
void displayController(float temperature, float humidity) {
  display.init();
  display.flipScreenVertically();
  display.setFont(ArialMT_Plain_10);
  display.setTextAlignment(TEXT_ALIGN_LEFT);

  display.clear();

  char timeBuffer[16];
  snprintf(timeBuffer, sizeof(timeBuffer), "Time: %02d:%02d", rtc.getHour(true), rtc.getMinute());
  display.drawString(0, 0, timeBuffer);

  char dateBuffer[16];
  snprintf(dateBuffer, sizeof(dateBuffer), "%02d-%02d-%04d", rtc.getDay(), rtc.getMonth(), rtc.getYear());
  display.drawString(0, 12, dateBuffer);

  char tempBuffer[16];
  snprintf(tempBuffer, sizeof(tempBuffer), "Temp: %.1f C", temperature);
  display.drawString(0, 24, tempBuffer);

  char humidityBuffer[16];
  snprintf(humidityBuffer, sizeof(humidityBuffer), "Humidity: %.1f%%", humidity);
  display.drawString(0, 36, humidityBuffer);

  display.display();
}

// button 
void pressButton(bool buttonState) {
    unsigned long currentTime = millis();
    if ((currentTime - lastDebounceTime) > 50) {
        if (buttonState != lastButtonState) {
            if (buttonState == HIGH) {
                activeButton = !activeButton;
                digitalWrite(ledPin, activeButton);
                temperature = dht.getTemperature(); 
                humidity = dht.getHumidity(); 
                displayController(humidity, temperature);
            }
            lastDebounceTime = currentTime;
        }
    }
    lastButtonState = buttonState;
}
// real time clock
void setTime(std::string currentTime) {
  int day, month, year, hour, minute, second;
  sscanf(currentTime.c_str(), "%2d-%2d-%4d %2d:%2d:%2d", &day, &month, &year, &hour, &minute, &second);
  Serial.printf("Setting time to: %02d-%02d-%04d %02d:%02d:%02d\n", day, month, year, hour, minute, second);
  rtc.setTime(second, minute, hour, day, month, year);
}

// relay
void relayController(bool state) {
  digitalWrite(relayPin, state);
} 

void connectToWiFi(){
  Serial.print("Wifi...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while(WiFi.status() != WL_CONNECTED){
    delay(500);
    Serial.print(".");
  }
  Serial.println("connected!");
}

void connectToFirebase(){
  // Configure Firebase
  config.api_key = FIREBASE_AUTH;
  config.database_url = FIREBASE_HOST;
  if (Firebase.signUp(&config, &auth, "", "")) {
    Serial.println("Connected to Firebase!");
  } else {
    Serial.println("Failed to connect to Firebase!");
    Serial.println(config.signer.signupError.message.c_str());
  }
  // Initialize Firebase
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

}

void setup() {  
  Serial.begin(9600);
  connectToWiFi();
  connectToFirebase();

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

  // INPUT
  pinMode(buttonPin, INPUT);
  pinMode(photoPin, INPUT); 
  dht.setup(dhtPin, DHTesp::DHT22); 
  setTime(currentTime);
}

void loop() {
  pressButton(digitalRead(buttonPin));
  if (activeButton) {
    if (Firebase.ready()){
      Firebase.RTDB.getFloat(&fbdo, "/servo",  &servoFirebase);
      Firebase.RTDB.getString(&fbdo, "/time",  &firebaseTime);
      if (firebaseTime != currentTime) {
        currentTime = firebaseTime;
        setTime(currentTime);
        displayController(humidity, temperature);
      }
        if (servoFirebase != servoAngle) {
          servoAngle = servoFirebase;
          myServo.write(servoAngle);
    }
    
      if (Firebase.RTDB.getBool(&fbdo, "/light",  &led)){
        digitalWrite(relayPin, led);
      }
    }
    // Sensor data
    pirState = digitalRead(pirPin);
    photoState = analogRead(photoPin) > 500 ? true : false;
    // Display data 
    // adjust servo 
    if (analogRead(slidePin) != slideValue) {
      slideValue = analogRead(slidePin);
      servoAngle = map(slideValue, 0, 4095, 0, 180);
      myServo.write(servoAngle);
      servoFirebase = servoAngle;
          if (Firebase.ready()){
        Firebase.RTDB.setFloat(&fbdo, "/servo", servoFirebase);
    }
    }

    if (led == false) {
      // turn on led when dark    
      digitalWrite(relayPin, photoState);

      // turn on led when motion detected
      digitalWrite(relayPin, pirState);
    }

    // temp > 60
    if (temperature > 60) {
      // led on
      digitalWrite(relayPin, HIGH); 
      delay(200); 
      digitalWrite(relayPin, LOW);
      delay(200); 

      // buzzer on
      tone(buzzerPin, 1000); 
      delay(1000); 
      noTone(buzzerPin); 
      delay(500);
      // servo on 
      myServo.write(0); 
    }
    if (rtc.getMinute() != lastMinute || dht.getHumidity() != humidity || dht.getTemperature() != temperature) {
      humidity = dht.getHumidity();
      temperature = dht.getTemperature();
      lastMinute = rtc.getMinute();
      displayController(temperature, humidity);
      if (Firebase.ready()){
        Firebase.RTDB.setFloat(&fbdo, "/temp", temperature);
        Firebase.RTDB.setFloat(&fbdo, "/humid", humidity);
      }
    }
  }
  else {
    display.init();
    display.clear();
  }
}