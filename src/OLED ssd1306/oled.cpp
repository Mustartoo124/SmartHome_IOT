#include "oled.h"

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
