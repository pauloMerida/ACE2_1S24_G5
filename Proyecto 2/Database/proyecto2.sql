CREATE DATABASE proyecto2;
USE proyecto2;

CREATE TABLE Ingresos(
id int not null auto_increment primary key,
fecha_hora datetime not null
);

CREATE TABLE Egresos(
id int not null auto_increment primary key,
fecha_hora datetime not null
);

CREATE TABLE Logueo(
id int not null auto_increment primary key,
estado varchar(100) not null
);

DELIMITER //

CREATE PROCEDURE obtener_egresos_en_rango(
    fecha_inicial DATETIME,
    fecha_final DATETIME
)
BEGIN
    SELECT *
    FROM Egresos
    WHERE fecha_hora BETWEEN fecha_inicial AND fecha_final
    ORDER BY fecha_hora;
END//

DELIMITER ;

CREATE TABLE Egresos(
id int not null auto_increment primary key,
fecha_hora datetime not null
);

DELIMITER //

CREATE PROCEDURE obtener_ingresos_en_rango(
    fecha_inicial DATETIME,
    fecha_final DATETIME
)
BEGIN
    SELECT *
    FROM Ingresos
    WHERE fecha_hora BETWEEN fecha_inicial AND fecha_final
    ORDER BY fecha_hora;
END//

DELIMITER ;

DELIMITER //

CREATE PROCEDURE todos_ingresos(
)
BEGIN
    SELECT *
    FROM Ingresos
    ORDER BY fecha_hora;
END//

DELIMITER ;

DELIMITER //

CREATE PROCEDURE todos_egresos(
)
BEGIN
    SELECT *
    FROM Egresos
    ORDER BY fecha_hora;
END//

DELIMITER ;

DELIMITER //
CREATE TRIGGER actualizar_estado_logueado AFTER INSERT ON Ingresos
FOR EACH ROW
BEGIN
    UPDATE Logueo SET estado = 'logueado' WHERE id = 1;
END;//

DELIMITER ;

DELIMITER //
CREATE TRIGGER actualizar_estado_deslogueado AFTER INSERT ON Egresos
FOR EACH ROW
BEGIN
    UPDATE Logueo SET estado = 'deslogueado' WHERE id = 1;
END;//

DELIMITER ;


INSERT INTO Egresos (fecha_hora) VALUES
('2024-04-30 09:15:00'),
('2024-04-30 12:30:00'),
('2024-04-30 15:45:00'),
('2024-04-30 18:20:00'),
('2024-04-30 20:05:00'),
('2024-04-30 23:40:00'),
('2024-05-01 07:25:00'),
('2024-05-01 10:10:00'),
('2024-05-01 13:55:00'),
('2024-05-01 16:30:00'),
('2024-05-01 19:45:00'),
('2024-05-01 22:00:00'),
('2024-05-02 09:35:00'),
('2024-05-02 12:20:00'),
('2024-05-02 15:05:00'),
('2024-05-02 18:30:00'),
('2024-05-02 21:15:00'),
('2024-05-02 23:50:00'),
('2024-04-30 06:45:00'),
('2024-04-30 10:00:00'),
('2024-04-30 13:15:00'),
('2024-04-30 16:40:00'),
('2024-04-30 19:25:00'),
('2024-04-30 21:50:00'),
('2024-05-01 08:35:00'),
('2024-05-01 11:20:00'),
('2024-05-01 14:05:00'),
('2024-05-01 17:30:00'),
('2024-05-01 20:15:00'),
('2024-05-01 23:30:00'),
('2024-05-02 07:15:00'),
('2024-05-02 10:00:00'),
('2024-05-02 12:45:00'),
('2024-05-02 16:10:00'),
('2024-05-02 19:25:00'),
('2024-05-02 22:40:00'),
('2024-04-30 09:25:00'),
('2024-04-30 11:40:00'),
('2024-04-30 14:55:00'),
('2024-04-30 17:20:00'),
('2024-04-30 20:35:00'),
('2024-04-30 23:50:00'),
('2024-05-01 06:15:00'),
('2024-05-01 09:00:00'),
('2024-05-01 12:15:00'),
('2024-05-01 15:40:00'),
('2024-05-01 18:55:00'),
('2024-05-01 21:10:00'),
('2024-05-02 08:45:00');

INSERT INTO Ingresos (fecha_hora) VALUES
('2024-04-30 09:30:00'),
('2024-04-30 11:45:00'),
('2024-04-30 14:20:00'),
('2024-04-30 17:05:00'),
('2024-04-30 19:40:00'),
('2024-04-30 22:15:00'),
('2024-05-01 07:50:00'),
('2024-05-01 10:35:00'),
('2024-05-01 13:20:00'),
('2024-05-01 16:45:00'),
('2024-05-01 19:30:00'),
('2024-05-01 22:45:00'),
('2024-05-02 08:20:00'),
('2024-05-02 11:05:00'),
('2024-05-02 14:30:00'),
('2024-05-02 17:15:00'),
('2024-05-02 20:00:00'),
('2024-05-02 23:25:00'),
('2024-04-30 07:15:00'),
('2024-04-30 09:30:00'),
('2024-04-30 12:45:00'),
('2024-04-30 16:00:00'),
('2024-04-30 18:35:00'),
('2024-04-30 21:00:00'),
('2024-05-01 08:45:00'),
('2024-05-01 11:30:00'),
('2024-05-01 14:15:00'),
('2024-05-01 17:40:00'),
('2024-05-01 20:25:00'),
('2024-05-01 23:40:00'),
('2024-05-02 07:25:00'),
('2024-05-02 10:10:00'),
('2024-05-02 12:55:00'),
('2024-05-02 16:20:00'),
('2024-05-02 19:35:00'),
('2024-05-02 22:50:00'),
('2024-04-30 08:15:00'),
('2024-04-30 10:30:00'),
('2024-04-30 13:55:00'),
('2024-04-30 17:10:00'),
('2024-04-30 20:25:00'),
('2024-04-30 23:40:00'),
('2024-05-01 06:05:00'),
('2024-05-01 09:20:00'),
('2024-05-01 12:35:00'),
('2024-05-01 15:50:00'),
('2024-05-01 18:15:00'),
('2024-05-01 21:30:00'),
('2024-05-02 08:05:00');

CALL obtener_egresos_en_rango('2024-04-30 00:00:00', '2024-05-1 15:00:00');

CALL obtener_ingresos_en_rango('2024-04-30 00:00:00', '2024-05-30 12:00:00');

CALL todos_ingresos();

CALL todos_egresos();

insert into Logueo (estado) values ("inicial");

select * from Logueo;

