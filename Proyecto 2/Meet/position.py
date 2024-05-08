import pyautogui

# Función para obtener y mostrar las coordenadas del cursor
def obtener_coordenadas():
    try:
        # Obtener las coordenadas del cursor
        x, y = pyautogui.position()
        
        # Mostrar las coordenadas
        print(f"Coordenadas X: {x}, Coordenadas Y: {y}")
    except Exception as e:
        print(f"Error al obtener las coordenadas: {e}")

# Llamar a la función para obtener y mostrar las coordenadas continuamente
while True:
    obtener_coordenadas()