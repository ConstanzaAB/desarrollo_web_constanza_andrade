-- Active: 1757340472229@@127.0.0.1@3306@tarea2
-- Crear usuario
CREATE USER 'cc5002'@'localhost' IDENTIFIED BY 'programacionweb';
ALTER USER 'cc5002'@'localhost' IDENTIFIED WITH mysql_native_password BY 'programacionweb';


GRANT ALL PRIVILEGES ON tarea2.* TO 'cc5002'@'localhost';

-- Eliminar usuario de ser necesario
DROP USER 'cc5002'@'localhost';



