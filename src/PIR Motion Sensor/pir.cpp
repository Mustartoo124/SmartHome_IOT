#include "pir.h"

int pirController() {
  int value = digitalRead(pirPin);
  return value; 
}