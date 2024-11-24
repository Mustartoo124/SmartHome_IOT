#include "servo.h"
#include "../Slide Potentionmeter/slide.h"

void controlServo(bool active){
    if(active){

        //Servo can either be control using 
        int potValue = controlSlidePotent(active);

        if(potValue != -1){
            //Control 1: using potvalue

            int servoAngle = map(potValue, 0 , 1023, 0, 180);
            myServo.write(servoAngle);
            delay(100); // Đợi một chút để giảm tải

        }else{
            //Control 2: Using server ???
        } 
    }
    else{
        //Do nothing
    }
}