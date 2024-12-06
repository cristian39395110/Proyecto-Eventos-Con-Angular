const express = require("express");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sequelize = require("./database/connection");
const initModels = require("./models/init-models");
const cors = require("cors"); // Importa el middleware cors
const multer = require("multer"); // Importar multer
const path = require("path"); // Importar path para trabajar con rutas

require("dotenv").config();

const app = express();
const models = initModels(sequelize); // Inicializa los modelos

// Middleware para manejar JSON
app.use(express.json());
const router = express.Router();

// Configurar el middleware de CORS para permitir cualquier origen
app.use(
  cors({
    origin: 'http://localhost:4200',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  })
);

// Configurar el middleware de sesión
app.use(
  session({
    secret: process.env.SESSION_SECRET || "clave_secreta", 
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
      db: sequelize,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60, // Expira en 1 hora
    },
  })
);

app.use((req, res, next) => {
  console.log("Sesión en middleware:", req.session);
  console.log("ID del usuario desde la cookie:", req.session?.userId);
  next();
});


// Middleware para servir archivos estáticos desde la carpeta "uploads"
app.use("/uploads", express.static("uploads"));


// Sincronizar la base de datos y la tabla de sesiones
sequelize
  .sync()
  .then(() => console.log("Base de datos sincronizada"))
  .catch((err) => console.error("Error al sincronizar la base de datos:", err));

// Rutas
const authRoutes = require("./routes/authRoutes");
const eventoRoutes = require("./routes/eventoRoutes");
const asistenteRoutes = require("./routes/asistenteRoutes");
const usuarioRoutes = require("./routes/usuariosRoutes");
const certificadoRoutes = require("./routes/certificadoRoutes");

// Registrar las rutas
app.use("/api/auth", authRoutes); // Rutas de autenticación
app.use("/api/eventos", eventoRoutes); // Rutas para eventos
app.use("/api/asistentes", asistenteRoutes); // Rutas para asistentes
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/certificados", certificadoRoutes);

// Prueba de sesión

app.get('/test-session', (req, res) => {
  console.log('Contenido de la sesión:', req.session); // Para depurar en el servidor

  if (req.session && req.session.userId) {
    res.json({
      message: 'Sesión activa',
      session: {
        userId: req.session.userId,
        userRole: req.session.userRole,
      },
    });
  } else {
    res.status(401).json({ message: 'No estás autenticado' });
  }
});


// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
