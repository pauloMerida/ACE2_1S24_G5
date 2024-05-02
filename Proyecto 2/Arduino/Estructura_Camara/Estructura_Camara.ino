#include <Servo.h>
#include <Wire.h>
#include "GFButton.h"

Servo servoMotorRed;
Servo servoMotorGreen;

char cadena;

const byte pinBuzzer = 2;
const int ledGreen = 3;
const int ledRed = 4;
const int pinBotonPause = 22;
const int pinBotonSistema = 24;

bool estadoSistema = HIGH;
bool estadoPause = LOW;
int x;
int y;
int prevX;
int prevY;

void setup() {
  Serial.begin(9600);

  pinMode(pinBotonPause, INPUT);
  pinMode(pinBotonSistema, INPUT);
  
  pinMode(pinBuzzer, OUTPUT);
  
  pinMode(ledGreen, OUTPUT);
  pinMode(ledRed, OUTPUT);

  servoMotorRed.attach(26);
  servoMotorGreen.attach(28);

  servoMotorRed.write(90);
  servoMotorGreen.write(90);

}

void loop() {
  
  bool estadoBotonPause = digitalRead(pinBotonPause);
  bool estadoBotonSistema = digitalRead(pinBotonSistema);

  if(Serial.available() > 0){
    if(estadoSistema == LOW){
      if(Serial.read() == 'g'){
        estadoSistema = HIGH;
        Serial.println(">>>> LOG IN <<<<");
        tone(pinBuzzer, 2000, 5000);
        digitalWrite(ledGreen, HIGH);
        delay(5000);
        digitalWrite(ledGreen, LOW);
      }
    }
    
    if(estadoSistema == HIGH && estadoPause == LOW){
    
      if(Serial.read() == 'X'){
        x = Serial.parseInt();
        if(Serial.read() == 'Y'){
          y = Serial.parseInt();
          posicion();
        }
      while(Serial.available() > 0){
        Serial.read();
      }
      }else if(Serial.read() == 'r'){
        tone(pinBuzzer, 1500, 1000);
        digitalWrite(ledRed, HIGH);
        delay(2000);
        digitalWrite(ledRed, LOW);
      }
    }
 }

  if(estadoSistema == HIGH){
    if(estadoBotonPause == HIGH && estadoSistema == HIGH){
      delay(300);
      if(estadoBotonPause == HIGH && estadoPause == LOW){
        estadoPause = HIGH;
        Serial.println(">>>> PAUSE <<<<");
        Serial.println(2);
      }else if(estadoBotonPause == HIGH && estadoPause == HIGH){
        estadoPause = LOW;
        Serial.println(">>>> PLAY <<<<");
        Serial.println(3);
      /*tone(pinBuzzer, 500, 1000);
      digitalWrite(ledGreen, HIGH);
      delay(1000);
      digitalWrite(ledGreen, LOW);
      servoMotorGreen.write(45);
      delay(500);
      servoMotorGreen.write(90);*/
      }
    }
    if(estadoBotonSistema == HIGH){
      delay(200);
      if(estadoBotonSistema == HIGH && estadoSistema == HIGH && estadoPause == LOW){
        estadoSistema = LOW;
        Serial.println(">>>> LOG OUT <<<<");
        tone(pinBuzzer, 1500, 1000);
        digitalWrite(ledRed, HIGH);
        delay(2000);
        digitalWrite(ledRed, LOW);
        
        servoMotorRed.write(90);
        servoMotorGreen.write(90);
        Serial.println('e');  
      }/*else if(estadoBotonSistema == HIGH && estadoSistema == LOW){
        estadoSistema = HIGH;

        tone(pinBuzzer, 1800, 2000);
        digitalWrite(ledGreen, HIGH);
        delay(2000);
        digitalWrite(ledGreen, LOW);
      }*/
    }
    
  }

}

void posicion(){
  /*if(prevX != x || prevY != y){*/
    int servoX = map(x, 319, 0, 90, 179);
    int servoY = map(y, 240, 0, 90, 179);
    servoX = min(servoX, 179);
    servoX = max(servoX, 1);
    servoY = min(servoY, 134);
    servoY = max(servoY, 60);
      
    servoMotorRed.write(servoX);
    servoMotorGreen.write(servoY);
  /*}
  prevX = x;
  prevY = y;*/
}
