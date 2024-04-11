//Librerials
#include <Servo.h>

#define Trigger1 2
#define Echo1    3



// Declaramos la variable para controlar el servo
Servo servoMotor;
const int pinBoton1 = 4;
const int pinBoton2 = 9;
const int ledPin[]  = {4, 5, 6, 7, 8};
volatile int ledActual = 0;
volatile int habitacion = 0;
float x, y;
bool estadoSistema = LOW;

void setup() {
  Serial.begin(9600);
  pinMode(Trigger1, OUTPUT);
  pinMode(Echo1,    INPUT );

  pinMode(pinBoton1, INPUT);
  pinMode(pinBoton2, INPUT);

  //incializar pin de las leds
  for(int i = 0; i < 5; i++){
    pinMode(ledPin[i], OUTPUT);
  }
  
  servoMotor.attach(9);
  // Inicializamos al ángulo 0 el servomotor
  servoMotor.write(45);
  delay(200);
}

void loop() {
  //Leer estado de pinBoton
  bool estadoBoton1 = digitalRead(pinBoton1);
  bool estadoBoton2 = digitalRead(pinBoton2);


  if(estadoBoton1 == LOW){
    delay(50);
    if(estadoBoton1 == LOW && estadoSistema == HIGH){//si se pulsa el boton y esta prendido el sistema
      estadoSistema = LOW;
    }else if (estadoBoton1 == LOW && estadoSistema == LOW){// si se pulsa el boton y esta apagado el sistema
      sensorDetectar();
      estadoSistema = HIGH;
    }
  }

  if(estadoBoton2 == LOW){
    delay(50);
    if(estadoBoton2 == LOW){
      cambiarHabitacion();
    }
  }

  
  
}
void sensorDetectar(){
  long duracion1, distancia1;


  // de 45 a  135 grados
  for (int i = 45; i <= 135; i++)
  {
    //Ultrasonico
    digitalWrite(Trigger1, LOW);
    delayMicroseconds(2);
    digitalWrite(Trigger1, HIGH);
    delayMicroseconds(15);
    digitalWrite(Trigger1, LOW);
    duracion1 = pulseIn(Echo1, HIGH);
    distancia1 = (duracion1/2)/29.1;//este se utiliza para comvertir en distacia el tiempo que viajo el sonido
    delay(5);
    
    if(distancia1 < 18){
      polaresCartesianas(i,distancia1);
      Serial.print("{X: ");
      Serial.print(x);
      Serial.print(", Y: ");
      Serial.print(y);
      Serial.print(", Habitacion: ");
      Serial.print(habitacion);
      Serial.println("}");
    }
    
    //Servootor
    servoMotor.write(i);
  }

  // de 135 a 45 grados
  for (int i = 135; i >= 45; i--)
  {
    //Ultrasonico
    digitalWrite(Trigger1, LOW);
    delayMicroseconds(2);
    digitalWrite(Trigger1, HIGH);
    delayMicroseconds(15);
    digitalWrite(Trigger1, LOW);
    duracion1 = pulseIn(Echo1, HIGH);
    distancia1 = (duracion1/2)/29.1;//este se utiliza para comvertir en distacia el tiempo que viajo el sonido
    delay(5);
    
    if(distancia1 < 18){
      polaresCartesianas(i,distancia1);
      Serial.print("{X: ");
      Serial.print(x);
      Serial.print(", Y: ");
      Serial.print(y);
      Serial.print(", Habitacion: ");
      Serial.print(habitacion);
      Serial.println("}");
    }
    
    //ServoMotor
    servoMotor.write(i);
  }
}

void cambiarHabitacion(){
  digitalWrite(ledPin[ledActual], HIGH);//encender el led
  habitacion++; 
  
  ledActual++;
  if(ledActual >= 5){
    ledActual = 0;
    habitacion = 0;
  }
}

void polaresCartesianas(int angulo, float distancia){
  float anguloRad = angulo*PI/180.0;
  x = distancia * cos(anguloRad);
  y = distancia * sin(anguloRad);
}
