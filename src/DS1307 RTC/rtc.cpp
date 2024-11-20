#include "rtc.h"

void rtcController(int hours, int minutes, int seconds, int day, int month, int year) {
  rtc.setTime(hours, minutes, seconds, day, month, year);
}
