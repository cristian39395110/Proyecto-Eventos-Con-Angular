const express = require("express");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sequelize = require("./database/connection");
const initModels = require("./models/init-models");

require("dotenv").config();

const app = express();
const models = initModels(sequelize); // Inicializa los modelos

// Middleware para manejar JSON
app.use(express.json());

// Configurar el middleware de sesión
app.use(
  session({
    secret: process.env.SESSION_SECRET || "clave_secreta", // Cambia por una clave segura
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
      db: sequelize, // Almacena sesiones en la base de datos
    }),
    cookie: {
      maxAge: 1000 * 60 * 60, // Expira en 1 hora
    },
  })
);

// Sincronizar la base de datos y la tabla de sesiones
sequelize.sync()
  .then(() => console.log("Base de datos sincronizada"))
  .catch((err) => console.error("Error al sincronizar la base de datos:", err));

// Rutas
const authRoutes = require("./routes/authRoutes");
//http://localhost:3000/api/auth/login    aca me logueo email y paswword
//POST http://localhost:3000/api/usuarios    post 
/*
{
    "nombre": "Ana Asistente",
    "email": "ana.asistente@example.com",
    "password": "123456",
    "rol": "asistente"
}


http://localhost:3000/api/usuarios/getAllUsuarios  todos los usuarios get solo si son codidores
*/



const eventoRoutes = require("./routes/eventoRoutes");
const asistenteRoutes = require("./routes/asistenteRoutes");
const usuarioRoutes = require("./routes/usuariosRoutes");

// Registrar las rutas
app.use("/api/auth", authRoutes); // Rutas de autenticación
app.use("/api/eventos", eventoRoutes); // Rutas para eventos
app.use("/api/asistentes", asistenteRoutes); // Rutas para asistentes

app.use("/api/usuarios", usuarioRoutes);
app.get("/test-session", (req, res) => {
    console.log(req.session);
    res.send("Prueba de sesión");
});


// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
