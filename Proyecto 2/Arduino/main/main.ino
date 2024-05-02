int led1 = 50; #Configurar pin del led 1
int led2 = 51; #Configurar pin del led 2
int alerta;

void setup() {
	Serial.begin(9600);
	pinMode(led1, OUTPUT);
	pinMode(led2, OUTPUT);
}

void loop() {
	if(Serial.available() > 0) {
		alerta = Serial.read();
		if(alerta == 'F') { //Se detecto un rostro
			digitalWrite(led1, HIGH);
			digitalWrite(led2, LOW);
		}
		if(alerta == 'O') { //Se detecto otro objeto, no hay rostros
			digitalWrite(led1, LOW);
			digitalWrite(led2, HIGH);
		}
	}
}
