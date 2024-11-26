#include "setup.h"  

// button 
void pressButton(bool buttonState) {
    if (buttonState != lastButtonState) {
        if (buttonState == HIGH) {
            activeButton = !activeButton;
        }
        lastButtonState = buttonState;
    }
}

// OLED
void displayController(int hour, int minute, float temperature, float humidity) {
  display.init();
  display.flipScreenVertically();
  display.setFont(ArialMT_Plain_10);
  display.setTextAlignment(TEXT_ALIGN_LEFT);

  display.clear();

  char timeBuffer[16];
  snprintf(timeBuffer, sizeof(timeBuffer), "Time: %02d:%02d", hour, minute);
  display.drawString(0, 0, timeBuffer);

  char tempBuffer[16];
  snprintf(tempBuffer, sizeof(tempBuffer), "Temp: %.1f C", temperature);
  display.drawString(0, 12, tempBuffer);

  char humidityBuffer[16];
  snprintf(humidityBuffer, sizeof(humidityBuffer), "Humidity: %.1f%%", humidity);
  display.drawString(0, 24, humidityBuffer);

  display.display();
}

// relay
void relayController(bool state) {
  digitalWrite(relayPin, state);
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

  // INPUT
  pinMode(buttonPin, INPUT);
  pinMode(photoPin, INPUT); 
  dht.setup(dhtPin, DHTesp::DHT22); 
  rtc.setTime(12, 0, 0, 1, 1, 2021);
}

void loop() {
  pressButton(digitalRead(buttonPin));
  if (activeButton) {
    // led on 
    digitalWrite(ledPin, HIGH);

    // Sensor data
    temperature = dht.getTemperature(); 
    humidity = dht.getHumidity(); 
    pirState = digitalRead(pirPin);
    photoState = analogRead(photoPin) > 500 ? true : false;
    slideValue = analogRead(slidePin); 
    Serial.println(slideValue);
  
    // Display data 
    displayController(rtc.getHour(), rtc.getMinute(), temperature, humidity);

    // adjust servo 
    servoAngle = map(slideValue, 0, 4095, 0, 180);
    myServo.write(servoAngle);

    // turn on led when dark    
    digitalWrite(relayPin, photoState);

    // temp > 70
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

    // Control from web 
       // light control 
       // servo control 
    
    // push data to server 
  } 
}
