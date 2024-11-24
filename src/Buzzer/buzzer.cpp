#include "buzzer.h"

void activateBuzzer(bool active){
    if(active){
        tone(buzzerPin, 1000); 
        delay(1000); 
        noTone(buzzerPin); 
        delay(500);
    }else{
        noTone(buzzerPin);

    }
}