#include <Wire.h>

char cadena;
const byte pinBuzzer = 4;
const int ledRed = 2;
const int ledGreen = 3;

void setup() {
  Serial.begin(9600);
  pinMode(ledRed, OUTPUT);
  pinMode(ledGreen, OUTPUT);
  pinMode(pinBuzzer, OUTPUT);

}

void loop() {
  if(Serial.available() > 0){
    cadena = Serial.read();
    if (cadena == 'g'){
      digitalWrite(ledGreen, HIGH);
      delay(1000);
      digitalWrite(ledGreen, LOW);
      tone(pinBuzzer, 1000, 500);
    }
    if (cadena == 'r'){
      digitalWrite(ledRed, HIGH);
      delay(4000);
      digitalWrite(ledRed, LOW);
      tone(pinBuzzer, 500, 2000);
    }
  }

}
