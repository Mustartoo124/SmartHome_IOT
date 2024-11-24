#include "slide.h"

int controlSlidePotent(bool active){
    if(active){
        int potValue = analogRead(slidePin);
       
        return potValue;
    }
    else{
        return -1;
    }
    return -1;
}