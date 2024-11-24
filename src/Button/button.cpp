#include "button.h"

void pressButton(bool buttonState) {
    if (buttonState != lastState) {
        if (buttonState == HIGH) {
            active = !active;
            isActive(active);
        }
        lastState = buttonState;
    }
    Serial.println("Button Pressed");
}