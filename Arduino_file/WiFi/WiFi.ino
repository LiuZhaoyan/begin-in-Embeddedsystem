#include<WiFi.h>

const char* ssid="iPPT";
const char* password="ffGTL3FSfK";

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  WiFi.begin(ssid,password);
  while(WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Well Connected!");

}

void loop() {
  // put your main code here, to run repeatedly:
  delay(10000);
}
