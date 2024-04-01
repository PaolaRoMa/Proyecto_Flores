const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta de manejo para la ruta raíz "/"
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    res.sendFile(indexPath);
});

// Manejar solicitudes POST para guardar datos de usuario
app.post('/guardar-datos', (req, res) => {
    const {email, password } = req.body;
    const userData = `${email}|${password}\n`;

    const dataFilePath = path.join(__dirname,'datos_usuarios.txt');
    fs.appendFile(dataFilePath, userData, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al guardar los datos');
        } else {
            console.log('Datos guardados correctamente en el archivo.');
            res.status(200).send('Datos guardados correctamente');
        }
    });
});

// Ruta para manejar la solicitud POST de inicio de sesión
app.post('/iniciar-sesion', (req, res) => {
    const { email, password } = req.body;
    const dataFilePath = '../datos_usuarios.txt';

    // Leer el archivo de texto que contiene las credenciales
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo de usuarios:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }

        // Separar el contenido del archivo en líneas
        const lines = data.split('\n');

        // Buscar el usuario con las credenciales proporcionadas
        let userFound = false;
        lines.forEach(line => {
            const [savedEmail, savedPassword] = line.split('|');
            if (savedEmail === email && savedPassword === password) {
                userFound = true;
                res.send('Inicio de sesión exitoso');
            }
        });

        // Si el usuario no se encuentra, enviar un mensaje de error
        if (!userFound) {
            res.status(401).send('Credenciales inválidas');
        }
    });
});


app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
