import de.bezier.data.sql.*;
import de.bezier.data.sql.mapper.*;

//Para utilizar el conector a la base de datos, clic en Sketch > Importar Bibliotecas > Gestionar Bibilotecas
//En la ventana que se abre, en la pestaña Libraries, en el cuadro de texto para buscar, escribir mysql
//Instalar la que dice Bezier SQLib

MySQL gestorbd;
String valorCaras = ""; // Cantidad de caras
boolean redrawNeeded = true; // Bandera para indicar si se necesita redibujar

void setup() {
  size(200, 200);
  gestorbd = new MySQL(this, "localhost", "contador", "root", ""); // Conexión a la base de datos (this, "localhost", nombreBaseDatos, user, contrasena)
  frameRate(1); // Establecer la velocidad de actualización de la ventana
}

void draw() {
  background(210, 200, 255);
  
  if (gestorbd.connect()) { //Si hay conexion a la base de datos, lee el contador
    gestorbd.query("SELECT valor FROM contadora");
    while (gestorbd.next()) {
      valorCaras = gestorbd.getString("valor"); // Se obtiene el valor de la base de datos
      redrawNeeded = true; // Se necesita redibujar
      //println("VALOR BD - " + valorCaras);
    }
    gestorbd.close(); // Cierra la conexión con la base de datos
  } else {
    println("Error al conectar a la base de datos.");
  }
  
  if (redrawNeeded) { // Redibuja solo cuando sea necesario
    // Lógica para el color basado en la distancia
    color c;
    c = color(0, 255, 0); // Verde
    // Dibujar el círculo con el color correspondiente
    fill(c);
    noStroke();
    ellipse((float)width/2, (float)height/2, 100, 50);
    
    // Mostrar el valor de la distancia
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(20);
    text(valorCaras, width/2, height/2);
    text("Caras reconocidas" , width/2, height - 50);
    
    redrawNeeded = false; // Reinicia la bandera de redibujado
  }
}
