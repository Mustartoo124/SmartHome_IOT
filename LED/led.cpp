#include "led.h"

void isActive(bool active) {
    if (active) {
        digitalWrite(ledPin, HIGH);
    } else {
        digitalWrite(ledPin, LOW);
    }
}