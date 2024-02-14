CREATE DATABASE Parqueo;
USE Parqueo;

CREATE TABLE Rol(
id_rol int primary key not null auto_increment,
tipo_rol varchar(50) not null
);

CREATE TABLE Vehiculo(
id_vehiculo int primary key not null auto_increment,
tipo_vehiculo varchar(50) not null
);

CREATE TABLE Ingreso(
id_ingreso int primary key not null auto_increment,
fecha_ingreso date not null,
hora_ingreso time not null,
id_vehiculo int not null ,
id_rol int not null,
foreign key (id_vehiculo) references Vehiculo(id_vehiculo),
foreign key (id_rol) references Rol(id_rol)
);



CREATE TABLE Egreso(
id_egreso int primary key not null auto_increment,
fecha_egreso date not null,
hora_egreso time not null,
id_vehiculo int not null ,
id_rol int not null,
foreign key (id_vehiculo) references Vehiculo(id_vehiculo),
foreign key (id_rol) references Rol(id_rol)
);

CREATE TABLE Espacios(
id_espacio int not null primary key auto_increment,
cantidad int not null,
fecha date not null,
hora time not null
);

-- inserciones manuales de roles y vehiculos

insert into Rol(tipo_rol) values ('Estudiantes');
insert into Rol(tipo_rol) values ('Trabajadores');
insert into Rol(tipo_rol) values ('Catedraticos');
insert into Rol(tipo_rol) values ('Otros');
select * from Rol;

insert into Vehiculo(tipo_vehiculo) values ('Personal');
insert into Vehiculo(tipo_vehiculo) values ('Mediano');
insert into Vehiculo(tipo_vehiculo) values ('Grande');
select * from Vehiculo;

insert into Espacios(cantidad,fecha,hora) values (200,'2023/02/11','08:00:00');
select * from Espacios;
-- Procedimientos almacenados y funciones

DELIMITER //
CREATE PROCEDURE InsertarIngreso(
    IN p_id_vehiculo INT,
    IN p_id_rol INT
)
BEGIN
    INSERT INTO Ingreso(fecha_ingreso, hora_ingreso, id_vehiculo, id_rol)
    VALUES (CURRENT_DATE(), CURRENT_TIME(), p_id_vehiculo, p_id_rol);
END //
DELIMITER ;

CALL InsertarIngreso('2024-02-11', '12:30:00', 1, 2);


DELIMITER //
CREATE PROCEDURE InsertarEgresos(
    IN p_id_vehiculo INT,
    IN p_id_rol INT
)
BEGIN
    INSERT INTO Egreso(fecha_egreso, hora_egreso, id_vehiculo, id_rol)
    VALUES (CURRENT_DATE(), CURRENT_TIME(), p_id_vehiculo, p_id_rol);
END //
DELIMITER ;

CALL InsertarEgresos('2024-02-11', '12:35:00', 1, 2);
select * from Egreso;
-- trigger de resta espacios totales

DELIMITER //
CREATE TRIGGER before_insert_Ingreso
BEFORE INSERT ON Ingreso
FOR EACH ROW
BEGIN
    DECLARE cantidad_anterior INT;

    -- Obtener el valor del último registro de la tabla "Espacios" en el campo "cantidad"
    SELECT cantidad INTO cantidad_anterior
    FROM Espacios
    ORDER BY id_espacio DESC
    LIMIT 1;

    -- Insertar en la tabla "Espacios" el nuevo registro con la cantidad disminuida en 1
    INSERT INTO Espacios (cantidad, fecha, hora)
    VALUES (cantidad_anterior - 1,CURRENT_DATE(), CURRENT_TIME());
END //
DELIMITER ;

-- trigger de suma espacios totales
DELIMITER //
CREATE TRIGGER before_insert_Egreso
BEFORE INSERT ON Egreso
FOR EACH ROW
BEGIN
    DECLARE cantidad_anterior INT;

    SELECT cantidad INTO cantidad_anterior
    FROM Espacios
    ORDER BY id_espacio DESC
    LIMIT 1;

    INSERT INTO Espacios (cantidad, fecha, hora)
    VALUES (cantidad_anterior + 1,CURRENT_DATE(), CURRENT_TIME());
END //
DELIMITER ;

-- Dashboard principal

-- historial entrada COMPLETO
DELIMITER //
CREATE PROCEDURE HistorialEntrada()
BEGIN
    DECLARE fecha_actual DATE;
    
    -- Obtener la fecha actual
    SET fecha_actual = CURDATE();

    SELECT
    I.id_ingreso,
    I.fecha_ingreso,
    I.hora_ingreso,
    V.tipo_vehiculo,
    R.tipo_rol
	FROM
		Ingreso AS I
	JOIN
		Vehiculo AS V ON I.id_vehiculo = V.id_vehiculo
	JOIN
		Rol AS R ON I.id_rol = R.id_rol
    WHERE
        I.fecha_ingreso = fecha_actual;
END //
DELIMITER ;
call HistorialEntrada();

-- historial salida COMPLETO
DELIMITER //
CREATE PROCEDURE HistorialSalida()
BEGIN
	DECLARE fecha_actual DATE;
    SET fecha_actual = CURDATE();
   SELECT
    E.id_egreso,
    E.fecha_egreso,
    E.hora_egreso,
    V.tipo_vehiculo,
    R.tipo_rol
	FROM
		Egreso AS E
	JOIN
		Vehiculo AS V ON E.id_vehiculo = V.id_vehiculo
	JOIN
		Rol AS R ON E.id_rol = R.id_rol
	WHERE
			E.fecha_egreso = fecha_actual;
END //
DELIMITER ;

call HistorialSalida();
-- Cantidad de vehiculos dentro del parqueo COMPLETO

DELIMITER //
CREATE PROCEDURE Cantidad_vehiculos_parqueo()
BEGIN
	DECLARE cantidad_disponible INT;

    SELECT cantidad INTO cantidad_disponible
    FROM Espacios
    ORDER BY id_espacio DESC
    LIMIT 1;
    
    SELECT (200 - cantidad_disponible) as Cantidad_ocupada;
END //
DELIMITER ;
call Cantidad_vehiculos_parqueo();

-- cantidad de espacios vacios COMPLETO
DELIMITER //
CREATE PROCEDURE Cantidad_espacios_vacios()
BEGIN
	DECLARE cantidad_disponible INT;

    SELECT cantidad INTO cantidad_disponible
    FROM Espacios
    ORDER BY id_espacio DESC
    LIMIT 1;
    
    SELECT (cantidad_disponible) as Disponibles;
END //
DELIMITER ;

call Cantidad_espacios_vacios();

-- cantidad de peronas que ingresaron al parqueo COMPLETO
DELIMITER //
CREATE PROCEDURE Suma_personas_porFecha()
BEGIN
    SELECT 
        SUM(
            CASE 
                WHEN v.tipo_vehiculo = 'Personal' THEN 1
                WHEN v.tipo_vehiculo = 'Mediano' THEN 2
                WHEN v.tipo_vehiculo = 'Grande' THEN 4
                ELSE 0
            END
        ) AS Total_Personas
    FROM 
        Ingreso i
    INNER JOIN 
        Vehiculo v ON i.id_vehiculo = v.id_vehiculo
    WHERE 
        i.fecha_ingreso = CURRENT_DATE();
END //
DELIMITER ;


call Suma_personas_porFecha();

-- Cantidad vehiculos por rol ingresos y egresos COMPLETO
DELIMITER //
CREATE PROCEDURE Vehiculos_Rol_Ingreso_Egreso()
BEGIN
    DECLARE totalEstudiantesIngresos INT;
    DECLARE totalTrabajadoresIngresos INT;
    DECLARE totalCatedraticosIngresos INT;
    DECLARE totalOtrosIngresos INT;

    DECLARE totalEstudiantesEgresos INT;
    DECLARE totalTrabajadoresEgresos INT;
    DECLARE totalCatedraticosEgresos INT;
    DECLARE totalOtrosEgresos INT;

    -- Calcular total de ingresos por rol
    SELECT COUNT(*) INTO totalEstudiantesIngresos FROM Ingreso WHERE id_rol = (SELECT id_rol FROM Rol WHERE tipo_rol = 'Estudiantes');
    SELECT COUNT(*) INTO totalTrabajadoresIngresos FROM Ingreso WHERE id_rol = (SELECT id_rol FROM Rol WHERE tipo_rol = 'Trabajadores');
    SELECT COUNT(*) INTO totalCatedraticosIngresos FROM Ingreso WHERE id_rol = (SELECT id_rol FROM Rol WHERE tipo_rol = 'Catedraticos');
    SELECT COUNT(*) INTO totalOtrosIngresos FROM Ingreso WHERE id_rol = (SELECT id_rol FROM Rol WHERE tipo_rol = 'Otros');

    -- Calcular total de egresos por rol
    SELECT COUNT(*) INTO totalEstudiantesEgresos FROM Egreso WHERE id_rol = (SELECT id_rol FROM Rol WHERE tipo_rol = 'Estudiantes');
    SELECT COUNT(*) INTO totalTrabajadoresEgresos FROM Egreso WHERE id_rol = (SELECT id_rol FROM Rol WHERE tipo_rol = 'Trabajadores');
    SELECT COUNT(*) INTO totalCatedraticosEgresos FROM Egreso WHERE id_rol = (SELECT id_rol FROM Rol WHERE tipo_rol = 'Catedraticos');
    SELECT COUNT(*) INTO totalOtrosEgresos FROM Egreso WHERE id_rol = (SELECT id_rol FROM Rol WHERE tipo_rol = 'Otros');

    -- Calcular diferencia
    SELECT (totalEstudiantesIngresos - totalEstudiantesEgresos) AS Estudiantes,
           (totalTrabajadoresIngresos - totalTrabajadoresEgresos) AS Trabajadores,
           (totalCatedraticosIngresos - totalCatedraticosEgresos) AS Catedraticos,
           (totalOtrosIngresos - totalOtrosEgresos) AS Otros;
END //
DELIMITER ;

call Vehiculos_Rol_Ingreso_Egreso();


-- Dashboard Historico

-- grafica de ingresos y egresos versus hora en un intervalo de tiempo.alter COMPLETO

DELIMITER //
CREATE PROCEDURE Consultar_Ingresos_Egresos(
    IN fecha_inicial DATE,
    IN fecha_final DATE
)
BEGIN
    DECLARE contador INT DEFAULT 0;

    SELECT tipo, fecha, hora, id_vehiculo, id_rol, @contador := @contador + cambio AS contador
    FROM (
        SELECT 'Ingreso' AS tipo, fecha_ingreso AS fecha, hora_ingreso AS hora, id_vehiculo, id_rol, 1 AS cambio
        FROM Ingreso
        WHERE fecha_ingreso BETWEEN fecha_inicial AND fecha_final
        UNION ALL
        SELECT 'Egreso' AS tipo, fecha_egreso AS fecha, hora_egreso AS hora, id_vehiculo, id_rol, -1 AS cambio
        FROM Egreso
        WHERE fecha_egreso BETWEEN fecha_inicial AND fecha_final
    ) AS ingresos_y_egresos
    JOIN (SELECT @contador := 0) AS init
    ORDER BY fecha, hora;
END //
DELIMITER ;

call Consultar_Ingresos_Egresos('2024/02/12','2024/02/12');
-- Historial de roles cambiar el de abajo por que es un intervalo de tiempo
DELIMITER //

CREATE PROCEDURE Vehiculos_Por_Rol_Intervalo_Fechas(
    IN fecha_inicial DATE,
    IN fecha_final DATE
)
BEGIN
    SELECT 
        r.tipo_rol,
        i.fecha_ingreso AS fecha,
        COUNT(i.id_ingreso) AS Total_Vehiculos
    FROM 
        Ingreso i
    INNER JOIN 
        Rol r ON i.id_rol = r.id_rol
    WHERE 
        i.fecha_ingreso BETWEEN fecha_inicial AND fecha_final
    GROUP BY 
        r.tipo_rol, i.fecha_ingreso
    ORDER BY 
        i.fecha_ingreso;
END //
DELIMITER ;
drop procedure Vehiculos_Por_Rol_Intervalo_Fechas;
call Vehiculos_Por_Rol_Intervalo_Fechas('2024/02/05','2024/02/11');

-- Cantidad de personas en el parqueo por fecha.
DELIMITER //
CREATE PROCEDURE Suma_personas_porIntervaloFechas(
    IN fecha_inicial DATE,
    IN fecha_final DATE
)
BEGIN
    SELECT 
        i.fecha_ingreso AS fecha,
        SUM(
            CASE 
                WHEN v.tipo_vehiculo = 'Personal' THEN 1
                WHEN v.tipo_vehiculo = 'Mediano' THEN 2
                WHEN v.tipo_vehiculo = 'Grande' THEN 4
                ELSE 0
            END
        ) AS Total_Personas
    FROM 
        Ingreso i
    INNER JOIN 
        Vehiculo v ON i.id_vehiculo = v.id_vehiculo
    WHERE 
        i.fecha_ingreso BETWEEN fecha_inicial AND fecha_final
    GROUP BY
        i.fecha_ingreso
    ORDER BY
        i.fecha_ingreso;
END //
DELIMITER ;
call Suma_personas_porIntervaloFechas('2024/02/10','2024/02/12');

-- TEST
select * from Espacios;
select * from Ingreso;
select * from Egreso;
CALL InsertarIngreso(2, 4);
CALL InsertarEgresos(3, 4);
delete from Espacios where id_espacio=2;
