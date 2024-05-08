#Librerias a utilizar

#pip install opencv-python
#pip install pyserial
#pip install mysql-connector-python

import cv2
import serial
import time
import mysql.connector

#ser = serial.Serial('COM4', 9600, timeout=1) #Poner el puerto COM al arduino
#time.sleep(2) #Para que la conexion se realice sin problema de tiempos

contadorCaras = 0
puertoSerial = serial.Serial("COM6", 9600)

# Crear una base de datos local llamada contador
# En esa base de datos crear una tabla con el siguiente script

#USE contador;
#CREATE TABLE contadora (
#    id INT AUTO_INCREMENT PRIMARY KEY,
#    valor INT
#);

# Insertar el valor del contador ejecutando la siguiente instruccion
#INSERT INTO contadora (valor) VALUES (0);

# Configuración de la conexión a la base de datos
db_config = {
    'user': 'root',
    'password': '7E64-A8574670-Abd',
    'host': 'localhost',
    'database': 'contador',
    'port': 3306,
}

# Función para establecer una conexión a la base de datos
def connect_to_database():
    connection = mysql.connector.connect(**db_config)
    return connection

#OpenCV
face_cascade=cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml") #Note the change

cap = cv2.VideoCapture(1)

while True:
	_, img = cap.read()
	gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
	faces = face_cascade.detectMultiScale(gray, 1.1, 4)
	for(x, y, w, h) in faces:
		string='X{0:d}Y{1:d}'.format((x+w//2),(y+h//2))
		print(string)
		puertoSerial.write(string.encode('utf-8'))
		cv2.circle(img,(x+w//2,y+h//2),2,(0,255,0),2)
        #plot the roi
		cv2.rectangle(img,(x,y),(x+w,y+h),(0,0,255),3)
    	#plot the squared region in the center of the screen
	cv2.rectangle(img,(640//2-30,480//2-30),
                 (640//2+30,480//2+30),
                  (255,255,255),3)
	cv2.imshow('img', img)
	k = cv2.waitKey(30)
	#print("El numero de caras es " + str(len(faces)))

	if len(faces) > contadorCaras: #Si hay mas caras de las que habia en el ciclo anterior, entonces hay mas caras, esto para que no se incremente si se mantiene el mismo numero de caras
		# Establecer conexión a la base de datos
		connection = connect_to_database()
		# Crear un cursor para ejecutar consultas SQL
		cursor = connection.cursor(dictionary=True)

		contadorCaras = len(faces) - contadorCaras 

		#Aumenta el contador
		query = f"""
UPDATE contadora SET valor = valor + {contadorCaras};
		"""

		# Ejecuta la consulta SQL
		cursor.execute(query)
		connection.commit()

		# Cerrar el cursor y la conexión
		cursor.close()
		connection.close()

		#Enviar por puerto serial al arduino la alerta de que si hay caras
		puertoSerial.write(b'g')
		time.sleep(500/1000)

	if puertoSerial.readline().decode('utf-8').strip == 'e':
		print('Salida exitosa')

	
		
	
	#Si no se encuentran caras, es por que hay un objeto
	if len(faces) == 0:
		cv2.circle(img, (200,200), 100, (0,255,255), -4)
		font = cv2.FONT_HERSHEY_SIMPLEX
		cv2.putText(img, 'No es un rostro', (120,200), font, 0.60, (0,0,0),2,cv2.LINE_AA)
		cv2.imshow('img', img)
		
		#Enviar por puerto serial la alerta al arduino la alerta de que no hay caras
		puertoSerial.write(b'r')
		time.sleep(500/1000)


		k = cv2.waitKey(30)
		if k == 27: #Para salir del programa
			break

	if k == 27: #Para salir del programa
		break

cap.release()
#ser.close() #Cerrando el puerto serial