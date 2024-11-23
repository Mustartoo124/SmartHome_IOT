#include "dht22.h"

std::vector<double> readDHTData() {
  TempAndHumidity data = dht.getTempAndHumidity();

  if (isnan(data.temperature) || isnan(data.humidity)) {
    Serial.println("Failed to read from DHT sensor!");
    return {NAN, NAN};
  }

  return {data.temperature, data.humidity};
}