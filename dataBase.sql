CREATE TABLE usuarios(
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

SELECT * FROM usuarios;

INSERT INTO usuarios (email, password) VALUES ('usuario1@example.com', 'contraseña1');
INSERT INTO usuarios (email, password) VALUES ('usuario2@example.com', 'contraseña2');

USE datos;
SHOW TABLES;

ALTER TABLE usuarios
ADD username VARCHAR(20) NOT NULL;

DELETE FROM usuarios WHERE id = 11