#include "relay.h"

void relayController(bool state) {
  digitalWrite(relayPin, state);
} 
