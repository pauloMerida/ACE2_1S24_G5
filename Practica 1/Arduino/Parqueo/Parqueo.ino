#include <Wire.h>
#include <SparkFun_APDS9960.h>

SparkFun_APDS9960 apds = SparkFun_APDS9960();

const int Echo1 = 5;
const int Echo2 = 6;
const int Trigger1 = 4;
const int Trigger2 = 7;


uint16_t valor_ambiente = 0;
uint16_t valor_rojo = 0;
uint16_t valor_verde = 0;
uint16_t valor_azul = 0;

void setup() {
  Serial.begin(9600);//Inicializacion Serial
  pinMode(Trigger1, OUTPUT);
  pinMode(Trigger2, OUTPUT);
  pinMode(Echo1, INPUT);
  pinMode(Echo2, INPUT);
  digitalWrite(Trigger1, LOW);
  digitalWrite(Trigger2, LOW);

  //Inicializar APDS-9960
  if(apds.init()){
    Serial.println(F("APDS-9960"));
  }else {
    Serial.println(F("Algo salio mal durante la incializacion"));
  }

  //corriendo APDS-9960
  if(apds.enableLightSensor(false)){
    Serial.println(F("El sensor esta corriendo"));
  }else {
    Serial.println(F("Algo salio mal durante la incializacion"));
  }
  delay(500);
}

void loop() {
  long t1;
  long t2;
  long d1;
  long d2;
  digitalWrite(Trigger1, HIGH);
  delayMicroseconds(15);//se envia un pulso que dura 10us
  digitalWrite(Trigger1,LOW);

  t1 = pulseIn(Echo1, HIGH);//guardamos el valor devuelto por el pulso
  d1 = t1/59;//escalamos el tiempo para obtener un dato
  
  digitalWrite(Trigger2, HIGH);
  delayMicroseconds(15);//se envia un pulso que dura 10us
  digitalWrite(Trigger2,LOW);
  
  t2 = pulseIn(Echo2, HIGH);//guardamos el valor devuelto por el pulso
  d2 = t2/59;//escalamos el tiempo para obtener un dato

  //Imprimiendo tiempo obtenido y el dato al escalar
  Serial.println("****************");
  Serial.print(">>>> t1: ");
  Serial.println(t1);
  Serial.print(">> D1: ");
  Serial.println(d1);
  Serial.println(">>>>>>>><<<<<<<<");
  Serial.print(">>>> t2: ");
  Serial.println(t2);
  Serial.print(">> D2: ");
  Serial.println(d2);
  if(d1<16){
    Serial.println(">>>>>>>>>>>>>ENTRADA<<<<<<<<<<<<<<<<<<<<<");
    //AQUI PONER LA IDENFICACION DE COLOR 
    //AQUI PONER LA DISTANCIA
    entrada_salida(d1,1);
    delay(5000);
  }
  if(d2>17){
    Serial.println(">>>>>>>>>>>>>SALIDA<<<<<<<<<<<<<<<<<<<<<<<");
    //AQUI PONER LA IDENFICACION DE COLOR 
    //AQUI PONER LA DISTANCIA
    entrada_salida(d2,0);
    delay(5000);
  }

  delay(1000); //este delay es para obtener este dato cada 1 segundo

  

}

void entrada_salida(long d, int bnd_entrada_salida){
  //leer niveles de luz para cada color 
  if (  !apds.readAmbientLight(valor_ambiente) ||
        !apds.readRedLight(valor_rojo) ||
        !apds.readGreenLight(valor_verde) ||
        !apds.readBlueLight(valor_azul) ) {
    Serial.println("Error al leer valores de luz");
  } else {
    Serial.print("Ambiente: ");
    Serial.print(valor_ambiente);
    Serial.print(" Red: ");
    Serial.print(valor_rojo);
    /*Serial.print(" Green: ");
    Serial.print(valor_verde);*/
    Serial.print(" Blue: ");
    Serial.println(valor_azul);
    // Verificar si el valor de valor_ambiente está entre 1100 y 1300 si el color es amarillo
    if (valor_ambiente >= 1100 && valor_ambiente <= 1300) {
      Serial.println("Amarillo");
    }
    //verifica si el valor cambia fuera del rango de luz ambiente y esta fuera del rago de amarillo
    if (valor_ambiente < 900 || (valor_ambiente > 1099 && valor_ambiente < 1100) || valor_ambiente > 1300) {
      Serial.println("Otro");
    }
    if (valor_rojo >= 400 && valor_rojo <= 500) {
      Serial.println("ROJO");
    }
    if (valor_azul > 800 && valor_azul < 900) {
      Serial.println("Azul");
    }

  }
  
  String tamano = tamano_vehiculo(d);
  delay(1000);
  //enviar datos a base de datos 
  Serial.println(tamano);
  if(bnd_entrada_salida == 0){
    Serial.println("Entrada");
  }
  if(bnd_entrada_salida == 1){
    Serial.println("Salida");
  }
  
}
String tamano_vehiculo(long d){
  if(d > 14){//si es mayor a 14 el tamaño es pequeño
    return "Peque";
    }
  if(d > 10 && d < 12){//si es el valor es entre 10 y 12 el tamaño es mediando
    return "Mediano";
    }
  if(d <= 10){//si es menor a 10 el tamaño es grande
    return "Grand";
    }
}
