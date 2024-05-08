import webbrowser
import datetime
import pyautogui as pyto
import time
from pandas import *
import serial
import mysql.connector
'''
db_config = {
    'user': 'root',
    'password': '',
    'host': 'localhost',
    'database': 'proyecto2',
    'port': 3306,
}
'''
'''
def connect_to_database():
    connection = mysql.connector.connect(**db_config)
    return connection
'''
def open_class():

    
    #puerto_serial = serial.Serial('COM4', 9600)
    #entrada = puerto_serial.readline().decode().strip()

    while  True:
        #Lectura comunicacion serial
        #entrada = puerto_serial.readline().decode().strip()
        entrada=input()
        if entrada == 'i':
            print("Abriendo clase...")
            webbrowser.open('https://meet.google.com/ubr-mjej-srx')
            started = True
            time.sleep(5)
            #pyto.hotkey('ctrlleft', 'd')
            #pyto.hotkey('ctrlleft', 'e')
            time.sleep(1)
            pyto.moveTo(1341,600)                         
            pyto.click()
            time.sleep(3)
            pyto.hotkey('ctrlleft', 'altleft', 'c')
            time.sleep(2)
            pyto.write("Bienvenidos al Curso Arquitectura de computadores y Ensambladores 2")
            time.sleep(1)
            pyto.press("enter")
            #ciclo para salirse
                                           
        elif  entrada== 'e':
            pyto.moveTo(1224,963)
            pyto.click()
            time.sleep(1)

if __name__ == '__main__':
    open_class()