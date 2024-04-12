//server.js
const express = require('express');
const path = require('path');
const mysql = require('mysql');
const morgan = require('morgan'); // Importa el middleware de registro morgan

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Middleware de registro morgan
app.use(morgan('dev')); // Registra las solicitudes HTTP en la consola

// Ruta de manejo para la ruta raíz "/"
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'login.html');
    res.sendFile(indexPath);
});

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'MiriamJal01@', // Reemplaza 'tu_contraseña' con la contraseña de tu base de datos
    database: 'datos' // Reemplaza 'nombre_de_tu_base_de_datos' con el nombre de tu base de datos
});

const session = require('express-session');

app.use(session({
    secret: 'secreto', // Clave secreta para firmar la cookie de sesión
    resave: false,
    saveUninitialized: false
}));

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conexión exitosa a la base de datos MySQL');
});

app.post('/register', (req, res) => {

    const {username, email, password } = req.body;

    // Verificar si email y password están presentes y no son cadenas vacías
    if ( !username||!email || !password) {
        console.error('Email o contraseña vacíos.');
        return res.status(400).send('Email y contraseña son obligatorios.');
    }

    const sql = 'INSERT INTO usuarios (username, email, password) VALUES (?, ?, ?)';
    console.log('SQL:', sql); // Agregamos un registro para mostrar la consulta SQL
    console.log('Datos:', [username, email, password]); // Agregamos un registro para mostrar los datos a insertar

    db.query(sql, [username, email, password], (err, result) => {
        if (err) {
            console.error('Error al ejecutar la consulta de inserción:', err);
            return res.status(500).send('Error interno del servidor');
        }
    
        res.redirect('/login.html');
        
    });

});


app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Verificar las credenciales en la base de datos
    const sql = 'SELECT * FROM usuarios WHERE email = ? AND password = ?';

    db.query(sql, [email, password], (err, result) => {
        if (err) {
            console.error('Error al realizar la consulta:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }

        // Si no se encuentra ningún usuario con las credenciales proporcionadas
        if (result.length === 0) {
            res.status(401).send('Credenciales incorrectas');
        } else {
            // Guardar el nombre de usuario en la sesión
            req.session.username = result[0].username; // Aquí asignamos el nombre de usuario a req.session.username

            // Enviar una respuesta JSON con el nombre de usuario y cualquier otra información necesaria
            res.status(200).json({ username: result[0].username });
        }
    });
});



app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
