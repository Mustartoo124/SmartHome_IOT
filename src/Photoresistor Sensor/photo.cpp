#include "photo.h"
const int threshold = 500;
void activatePhoto(bool active){
    if(active){
        int photoValue = analogRead(photoPin);  // Read the value from the photoresistor
        Serial.println(photoValue);  // Print the value to the Serial Monitor

        // Check the threshold value to switch modes
        if (photoValue > threshold) {
            // Mode is "Bright"
            Serial.println("Mode: Bright");
        } else {
            //Mode is "Dark"
            Serial.println("Mode: Dark");
        }
        delay(100);  // Optional delay to prevent flooding the serial output

    }
    else{
        //Do nothing   
    }
}